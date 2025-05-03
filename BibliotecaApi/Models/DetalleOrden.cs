namespace BibliotecaApi.Models
{
        public class DetalleOrden
        {
        public int Id { get; set; }
        public int IdOrden { get; set; }
        public Orden? Orden { get; set; }
        public int IdLibro { get; set; }
        public Libro? Libro { get; set; }
        public int Cantidad { get; set; }
        public float PrecioUnitario { get; set; }
        public float PrecioTotal { get; set; }
    }

  
}
