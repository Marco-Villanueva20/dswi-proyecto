using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Models
{
    public class ApplicationDBContext: DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { 
        
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
    }
}
