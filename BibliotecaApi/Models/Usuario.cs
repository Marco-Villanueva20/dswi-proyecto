namespace BibliotecaApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombres { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty; // Debe ser "ADMINISTRADOR" o "USUARIO"

        // Navegación: un usuario puede tener varios libros
        public List<Libro> Libros { get; set; } = new();
    }
}
