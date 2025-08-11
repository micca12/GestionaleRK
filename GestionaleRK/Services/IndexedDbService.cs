using Microsoft.JSInterop;
using System.Text.Json;
using GestionaleRK.Models;

namespace GestionaleRK.Services;

public class IndexedDbService
{
    private readonly IJSRuntime _jsRuntime;
    private readonly string _dbName = "GestionaleRkDb";
    private readonly string _clientsStoreName = "clients";
    
    public IndexedDbService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }
    
    public async Task InitializeAsync()
    {
        await _jsRuntime.InvokeVoidAsync("indexedDbHelper.initialize", _dbName, _clientsStoreName);
    }
    
    public async Task<List<Client>> GetAllClientsAsync()
    {
        var jsonResult = await _jsRuntime.InvokeAsync<string>("indexedDbHelper.getAllClients");
        if (string.IsNullOrEmpty(jsonResult))
            return new List<Client>();
            
        var clients = JsonSerializer.Deserialize<List<Client>>(jsonResult) ?? new List<Client>();
        return clients.OrderBy(c => c.Cognome).ThenBy(c => c.Nome).ToList();
    }
    
    public async Task<Client?> GetClientAsync(string id)
    {
        var jsonResult = await _jsRuntime.InvokeAsync<string>("indexedDbHelper.getClient", id);
        if (string.IsNullOrEmpty(jsonResult))
            return null;
            
        return JsonSerializer.Deserialize<Client>(jsonResult);
    }
    
    public async Task SaveClientAsync(Client client)
    {
        client.DataUltimaModifica = DateTime.Now;
        var json = JsonSerializer.Serialize(client);
        await _jsRuntime.InvokeVoidAsync("indexedDbHelper.saveClient", json);
    }
    
    public async Task DeleteClientAsync(string id)
    {
        await _jsRuntime.InvokeVoidAsync("indexedDbHelper.deleteClient", id);
    }
}