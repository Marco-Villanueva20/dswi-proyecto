namespace BibliotecaApi.Models
{
    public class Orden
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty; // ejemplo: "#ORD001"
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public int CantidadTotal { get; set; }
        public float PrecioTotal { get; set; }

        // Navegación: una orden puede tener muchos detalles
        public List<DetalleOrden> Detalles { get; set; } = new();
    }
}
