using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BibliotecaApi.Models
{
    [Table("detalles_ordenes")]
    public class DetalleOrden
        {
        public int Id { get; set; }

        [Column("id_orden")] public int? IdOrden { get; set; }
        public Orden? Orden { get; set; }

        [Column("id_libro")] public int IdLibro { get; set; }
        public Libro? Libro { get; set; }

        [Column("id_usuario")] public int IdUsuario { get; set; }
        public Usuario? Usuario { get; set; }

        public int Cantidad { get; set; }
        [Column("precio_unitario")] public float PrecioUnitario { get; set; }
        [Column("precio_total")] public float PrecioTotal { get; set; }
    }

  
}
