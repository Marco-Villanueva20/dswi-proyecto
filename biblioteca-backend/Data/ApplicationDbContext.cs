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
        public DbSet<DetalleOrden> DetallesOrdenes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar la relación explícitamente
            modelBuilder.Entity<Usuario>()
                .HasMany(e => e.Libros)
                .WithOne(e=> e.Usuario)
                .HasForeignKey(e => e.IdUsuario)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Usuario>()
               .HasMany(e => e.DetallesOrdenes)
               .WithOne(e => e.Usuario)
               .HasForeignKey(e => e.IdUsuario)
               .IsRequired()
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Orden>()
                .HasMany(e => e.DetallesOrdenes)
                .WithOne(e => e.Orden)
                .HasForeignKey(e => e.IdOrden)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Libro>()
                .HasMany(e => e.DetallesOrdenes)
                .WithOne(e => e.Libro)
                .HasForeignKey(e => e.IdLibro)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            

        }



    }
}
