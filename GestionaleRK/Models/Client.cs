namespace GestionaleRK.Models;

public class Client
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Nome { get; set; } = string.Empty;
    public string Cognome { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public List<ClientNote> Note { get; set; } = new();
    public DateTime DataCreazione { get; set; } = DateTime.Now;
    public DateTime DataUltimaModifica { get; set; } = DateTime.Now;
    
    public string NomeCompleto => $"{Nome} {Cognome}".Trim();
}

public class ClientNote
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Testo { get; set; } = string.Empty;
    public DateTime DataCreazione { get; set; } = DateTime.Now;
}