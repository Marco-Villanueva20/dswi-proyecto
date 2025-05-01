namespace BibliotecaApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; } // Considerar hashearla si es real
        public List<Orden> Ordenes { get; set; }
    }
}
