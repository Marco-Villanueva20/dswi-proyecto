using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        [Column("id_usuario")] public int? IdUsuario { get; set; }
        public virtual Usuario? Usuario { get; set; }

        [JsonIgnore]
        public ICollection<DetalleOrden> DetallesOrdenes { get; } = new List<DetalleOrden>();

    }
}
