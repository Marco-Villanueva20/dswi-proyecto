document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
  
    // Remueve la card de ejemplo que hay en el HTML (si la dejaste fija)
    const cardEjemplo = container.querySelector('.card');
    if (cardEjemplo) cardEjemplo.remove();
  
    fetch('https://localhost:7070/api/ordenes') // Cambia por tu URL real
      .then(res => res.json())
      .then(data => {
        data.forEach(orden => {
          const ordenCard = document.createElement('div');
          ordenCard.className = 'card mb-4 shadow-sm';
  
          ordenCard.innerHTML = `
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <div>
                  <strong>Pedido ${orden.descripcion}</strong>
                  <div class="text-muted small">Colocado el  ${new Date(orden.fechaCreacion).toLocaleDateString()}</div>
                </div>
                <div class="text-end">
                  <span class="fw-bold text-primary">$${orden.precioTotal}</span>
                  <div class="text-muted small">${orden.cantidadTotal} libro(s)</div>
                </div>
              </div>
              <hr />
              <p class="mb-2 fw-semibold">Libros pedidos:</p>
              ${orden.detallesOrdenes.map(detalle => `
                <div class="d-flex align-items-center mb-3">
                  <img src="../${detalle.libro.imagen}" class="rounded me-3" style="width: 50px; height: 75px;" alt="${detalle.libro.titulo}">
                  <div class="flex-grow-1">
                    <div class="fw-semibold">${detalle.libro.titulo}</div>
                    <div class="text-muted small">${detalle.libro.autor}</div>
                  </div>
                  <div class="text-end">
                    <div>Qty: ${detalle.cantidad}</div>
                    <div class="text-muted small">$${detalle.precioUnitario}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
  
          container.appendChild(ordenCard);
        });
      })
      .catch(error => {
        console.error('Error al cargar las órdenes:', error);
        container.innerHTML += `<div class="alert alert-danger mt-4">No se pudo cargar el historial de órdenes.</div>`;
      });
  });
  