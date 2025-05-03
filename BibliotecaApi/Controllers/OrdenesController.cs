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
        public async Task<ActionResult<IEnumerable<Orden>>> GetOrdenes()
        {
            return await _context.Ordenes.ToListAsync();
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

        private bool OrdenExists(int id)
        {
            return _context.Ordenes.Any(e => e.Id == id);
        }
    }
}
