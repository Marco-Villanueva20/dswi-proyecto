namespace BibliotecaApi.Models
{
    public class Libro
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public float Precio { get; set; }
        public string? Imagen { get; set; }

        // Relación con Usuario
        public int IdUsuario { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
