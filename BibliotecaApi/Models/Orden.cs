using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BibliotecaApi.Models
{
    public class Orden
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty; // ejemplo: "#ORD001"
        [Column("fecha_creacion")] public DateTime FechaCreacion { get; set; } = DateTime.Now;
        [Column("cantidad_total")] public int CantidadTotal { get; set; }
        [Column("precio_total")] public float PrecioTotal { get; set; }

        // Navegación: una orden puede tener muchos detalles
        [JsonIgnore]
        public List<DetalleOrden> DetallesOrdenes { get; set; } = new();
    }
}
