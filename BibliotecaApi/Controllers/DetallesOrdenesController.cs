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
            return await _context.OrdenDetalles.ToListAsync();
        }

        // GET: api/DetallesOrdenes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleOrden>> GetDetalleOrden(int id)
        {
            var detalleOrden = await _context.OrdenDetalles.FindAsync(id);

            if (detalleOrden == null)
            {
                return NotFound();
            }

            return detalleOrden;
        }

        // PUT: api/DetallesOrdenes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleOrden(int id, DetalleOrden detalleOrden)
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

        // POST: api/DetallesOrdenes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleOrden>> PostDetalleOrden(DetalleOrden detalleOrden)
        {
            _context.OrdenDetalles.Add(detalleOrden);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleOrden", new { id = detalleOrden.Id }, detalleOrden);
        }

        // DELETE: api/DetallesOrdenes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleOrden(int id)
        {
            var detalleOrden = await _context.OrdenDetalles.FindAsync(id);
            if (detalleOrden == null)
            {
                return NotFound();
            }

            _context.OrdenDetalles.Remove(detalleOrden);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleOrdenExists(int id)
        {
            return _context.OrdenDetalles.Any(e => e.Id == id);
        }
    }
}
