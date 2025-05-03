using BibliotecaApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Data
{
    public class ApplicationDBContext: DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { 
        
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Libro> Libros { get; set; } = null!;
        public DbSet<Orden> Ordenes { get; set; } = null!;
        public DbSet<DetalleOrden> OrdenDetalles { get; set; } = null!;
    }
}
