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
    public class OrdenesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public OrdenesController(ApplicationDBContext context)
        {
            _context = context;
        }

        
        // GET: api/Ordenes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrdenes()
        {
            var ordenes = await _context.Ordenes
                .Include(o => o.DetallesOrdenes)
                .ToListAsync();

            var resultado = new List<object>();

            foreach (var orden in ordenes)
            {
                var detallesConLibros = new List<object>();

                foreach (var detalle in orden.DetallesOrdenes)
                {
                    // Busca el libro correspondiente
                    var libro = await _context.Libros.FindAsync(detalle.IdLibro);

                    detallesConLibros.Add(new
                    {
                        detalle.Id,
                        detalle.IdOrden,
                        detalle.IdLibro,
                        detalle.IdUsuario,
                        detalle.Cantidad,
                        PrecioUnitario = detalle.PrecioUnitario,
                        PrecioTotal = detalle.PrecioTotal,
                        Libro = libro == null ? null : new
                        {
                            libro.Titulo,
                            libro.Autor,
                            libro.Imagen
                        }
                    });
                }

                resultado.Add(new
                {
                    orden.Id,
                    orden.Descripcion,
                    orden.FechaCreacion,
                    orden.CantidadTotal,
                    orden.PrecioTotal,
                    DetallesOrdenes = detallesConLibros
                });
            }

            return Ok(resultado);
        }


        // GET: api/Ordenes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Orden>> GetOrden(int id)
        {
            var orden = await _context.Ordenes.FindAsync(id);

            if (orden == null)
            {
                return NotFound();
            }

            return orden;
        }

        // PUT: api/Ordenes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrden(int id, Orden orden)
        {
            if (id != orden.Id)
            {
                return BadRequest();
            }

            _context.Entry(orden).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrdenExists(id))
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

        // POST: api/Ordenes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Orden>> PostOrden(Orden orden)
        {
            _context.Ordenes.Add(orden);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrden", new { id = orden.Id }, orden);
        }

        // DELETE: api/Ordenes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrden(int id)
        {
            var orden = await _context.Ordenes.FindAsync(id);
            if (orden == null)
            {
                return NotFound();
            }

            _context.Ordenes.Remove(orden);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPost("CrearConDetalles/{idUsuario}")]
        public async Task<ActionResult<Orden>> CrearOrdenConDetalles(int idUsuario, Orden orden)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Crear orden
                _context.Ordenes.Add(orden);
                await _context.SaveChangesAsync();

                // 2. Obtener detalles del carrito de ese usuario
                var detallesCarrito = await _context.DetallesOrdenes
                    .Where(d => d.IdUsuario == idUsuario && d.IdOrden == null)
                    .ToListAsync();

                // 3. Asignar el id de la orden a cada detalle
                foreach (var detalle in detallesCarrito)
                {
                    detalle.IdOrden = orden.Id; // Asigna el ID recién creado
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction("GetOrden", new { id = orden.Id }, orden);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { mensaje = "Error al crear la orden y asignar detalles.", error = ex.Message });
            }
        }


        private bool OrdenExists(int id)
        {
            return _context.Ordenes.Any(e => e.Id == id);
        }
    }
}
