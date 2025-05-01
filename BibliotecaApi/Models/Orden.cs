namespace BibliotecaApi.Models
{
    public class Orden
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime Fecha { get; set; }
        public List<OrdenItem> Items { get; set; }

        public string Estado { get; set; } // "Pendiente", "Entregado", "Cancelado"
    }
}
