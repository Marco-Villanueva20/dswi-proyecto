namespace BibliotecaApi.Models
{
    public class CarritoItem
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public int LibroId { get; set; }
        public Libro Libro { get; set; }

        public int Cantidad { get; set; }
    }
}
