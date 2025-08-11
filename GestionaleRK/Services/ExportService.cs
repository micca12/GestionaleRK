using Microsoft.JSInterop;
using System.Text;
using System.Text.Json;
using GestionaleRK.Models;

namespace GestionaleRK.Services;

public class ExportService
{
    private readonly IJSRuntime _jsRuntime;
    
    public ExportService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }
    
    public async Task ExportToCsvAsync(List<Client> clients, string filename = "clienti")
    {
        var csv = GenerateCsv(clients);
        var fileName = $"{filename}_{DateTime.Now:yyyy-MM-dd_HH-mm}.csv";
        
        await _jsRuntime.InvokeVoidAsync("downloadFile", fileName, csv, "text/csv");
    }
    
    public async Task ExportBackupAsync(List<Client> clients, string filename = "backup_clienti")
    {
        var json = JsonSerializer.Serialize(clients, new JsonSerializerOptions 
        { 
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });
        
        var fileName = $"{filename}_{DateTime.Now:yyyy-MM-dd_HH-mm}.json";
        
        await _jsRuntime.InvokeVoidAsync("downloadFile", fileName, json, "application/json");
    }
    
    public async Task<List<Client>?> ImportBackupAsync(string jsonContent)
    {
        try
        {
            var clients = JsonSerializer.Deserialize<List<Client>>(jsonContent);
            return clients ?? new List<Client>();
        }
        catch (Exception)
        {
            return null;
        }
    }
    
    private string GenerateCsv(List<Client> clients)
    {
        var csv = new StringBuilder();
        
        // Header
        csv.AppendLine("Nome,Cognome,Telefono,Email,Note,Data Creazione,Data Ultima Modifica");
        
        // Data rows
        foreach (var client in clients.OrderBy(c => c.Cognome).ThenBy(c => c.Nome))
        {
            var noteText = string.Join(" | ", client.Note.OrderByDescending(n => n.DataCreazione)
                .Select(n => $"[{n.DataCreazione:dd/MM/yyyy}] {n.Testo}"));
            
            csv.AppendLine($"\"{EscapeCsvField(client.Nome)}\"," +
                          $"\"{EscapeCsvField(client.Cognome)}\"," +
                          $"\"{EscapeCsvField(client.Telefono ?? "")}\"," +
                          $"\"{EscapeCsvField(client.Email ?? "")}\"," +
                          $"\"{EscapeCsvField(noteText)}\"," +
                          $"\"{client.DataCreazione:dd/MM/yyyy HH:mm}\"," +
                          $"\"{client.DataUltimaModifica:dd/MM/yyyy HH:mm}\"");
        }
        
        return csv.ToString();
    }
    
    private string EscapeCsvField(string field)
    {
        if (string.IsNullOrEmpty(field))
            return "";
            
        // Escape quotes by doubling them
        return field.Replace("\"", "\"\"");
    }
}