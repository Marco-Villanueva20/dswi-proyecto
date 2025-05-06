using BibliotecaApi.Data;
using BibliotecaApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public UsuariosController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }


        // GET: api/usuarios/5/carrito
        [HttpGet("{idUsuario}/carrito")]
        public async Task<ActionResult<IEnumerable<DetalleOrden>>> GetCarritoUsuario(int idUsuario)
        {
            var carrito = await _context.DetallesOrdenes
                .Where(det => det.IdUsuario == idUsuario && det.IdOrden == null)
                .Include(det => det.Libro) // Incluye el libro
                .Include(det => det.Usuario) // Incluye el usuario
                .ToListAsync();

            if (carrito == null || !carrito.Any())
            {
                return NotFound("El carrito está vacío.");
            }

            return carrito;
        }


        [HttpGet("login/{username},{password}")]
        public async Task<ActionResult<Usuario>> GetUsuarioPorCredenciales(string username, string password)
        {
            // Busca el usuario que tenga ese username y password (compara en la BD)
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
            // Si no se encuentra, devuelve 404
            if (usuario == null)
            {
                return NotFound(new { success = false, message = "Usuario o contraseña incorrectos" });
            }
            return Ok(new
            {
                success = true, // <-- NECESARIO PARA QUE EL FRONTEND LO DETECTE
                usuario = new
                {
                    usuario.Id,
                    usuario.Nombres,
                    usuario.Username,
                    usuario.Rol // No se devuelve la contraseña por seguridad
                }
               
            });
        }


        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}
