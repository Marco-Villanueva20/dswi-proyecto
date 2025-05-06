using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotecaApi.Data;
using BibliotecaApi.Models;

namespace BibliotecaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallesOrdenesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public DetallesOrdenesController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/DetallesOrdenes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleOrden>>> GetOrdenDetalles()
        {
            return await _context.DetallesOrdenes.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<DetalleOrden>> PostDetalleOrden(DetalleOrden detalleOrden)
        {
            try
            {
                // Buscar si ya existe un detalle en el carrito con ese libro y usuario (sin orden finalizada)
                var existente = await _context.DetallesOrdenes
                    .FirstOrDefaultAsync(d => d.IdUsuario == detalleOrden.IdUsuario &&
                                              d.IdLibro == detalleOrden.IdLibro &&
                                              d.IdOrden == null);

                if (existente != null)
                {
                    // Ya existe -> actualizar cantidad y precios
                    existente.Cantidad += detalleOrden.Cantidad;
                    existente.PrecioTotal = existente.Cantidad * existente.PrecioUnitario;

                    _context.DetallesOrdenes.Update(existente);
                    await _context.SaveChangesAsync();

                    return Ok(existente); // o return CreatedAtAction() si prefieres mantener el formato
                }

                // No existe -> agregar nuevo
                _context.DetallesOrdenes.Add(detalleOrden);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetDetalleOrden", new { id = detalleOrden.Id }, detalleOrden);
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR en PostDetalleOrden: " + ex.Message);
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }


        // GET: api/DetallesOrdenes/CarritoUsuario/5
        [HttpGet("CarritoUsuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<object>>> GetCarritoUsuario(int idUsuario)
        {
            var detalles = await _context.DetallesOrdenes
                .Where(d => d.IdUsuario == idUsuario && d.IdOrden == null)
                .Include(d => d.Libro) // Incluimos el objeto relacionado Libro
                .Include(d=> d.Usuario).ToListAsync();

            if (detalles.Count == 0)
            {
                return NotFound("No se encontraron elementos en el carrito.");
            }

            var resultado = detalles.Select(d => new
            {
                d.Id,
                d.IdLibro,
                d.Cantidad,
                d.PrecioUnitario,
                d.PrecioTotal,
                d.IdUsuario,
                Libro = new
                {
                    d.Libro!.Id,
                    d.Libro.Titulo,
                    d.Libro.Imagen
                }
                
            });

            return Ok(resultado);
        }

        // DELETE: api/DetallesOrdenes/LimpiarCarrito/5
        [HttpDelete("LimpiarCarrito/{idUsuario}")]
        public async Task<IActionResult> LimpiarCarrito(int idUsuario)
        {
            var detallesEnCarrito = await _context.DetallesOrdenes
                .Where(d => d.IdUsuario == idUsuario && d.IdOrden == null)
                .ToListAsync();

            if (!detallesEnCarrito.Any())
            {
                return NotFound("El carrito ya está vacío.");
            }

            _context.DetallesOrdenes.RemoveRange(detallesEnCarrito);
            await _context.SaveChangesAsync();

            return Ok("Carrito limpiado correctamente.");
        }



        // PUT: api/DetallesOrdenes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleOrden(int id, [FromBody] DetalleOrden detalleOrden)
        {
            if (id != detalleOrden.Id)
            {
                return BadRequest();
            }

            _context.Entry(detalleOrden).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleOrdenExists(id))
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

        
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleOrden>> GetDetalleOrden(int id)
        {
            var detalle = await _context.DetallesOrdenes.FindAsync(id);

            if (detalle == null)
            {
                return NotFound();
            }

            return detalle;
        }


        // DELETE: api/DetallesOrdenes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleOrden(int id)
        {
            var detalleOrden = await _context.DetallesOrdenes
                .FindAsync(id);
            if (detalleOrden == null)
            {
                return NotFound();
            }

            _context.DetallesOrdenes.Remove(detalleOrden);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleOrdenExists(int id)
        {
            return _context.DetallesOrdenes.Any(e => e.Id == id);
        }
    }
}


/*
 // POST: api/DetallesOrdenes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleOrden>> PostDetalleOrden(DetalleOrden detalleOrden)
        {
            try
            {
                _context.DetallesOrdenes.Add(detalleOrden);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetDetalleOrden", new { id = detalleOrden.Id }, detalleOrden);
            }
            catch (Exception ex)
            {
                // Esto imprime el error completo en consola
                Console.WriteLine("ERROR en PostDetalleOrden: " + ex.Message);
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }

 */
