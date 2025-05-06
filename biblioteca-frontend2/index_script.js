document.addEventListener("DOMContentLoaded", () => {
  fetch("https://localhost:7070/api/Libros")
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById("catalogo");
      data.forEach(libro => {
        const card = document.createElement("div");
        card.className = "col-sm-6 col-md-4 col-lg-3";

        card.innerHTML = `
  <div class="card shadow-sm h-100">
    <img src="${libro.imagen}" class="card-img-top" alt="${libro.titulo}" style="height: 250px; object-fit: cover;">
    <div class="card-body">
      <h5 class="card-title fw-bold">${libro.titulo}</h5>
      <p class="card-text text-muted mb-1">${libro.autor}</p>
      <p class="card-text text-primary fw-semibold">$${libro.precio.toFixed(2)}</p>
      <button class="btn btn-warning w-100" onclick='agregarAlCarrito(${libro.id}, ${libro.precio})'>
        <i class="bi bi-cart me-2"></i> Añadir al carrito
      </button>
    </div>
  </div>
`;

        contenedor.appendChild(card);
      });
    })
    .catch(error => console.error("Error al obtener libros:", error));
});

// Función para agregar un libro al carrito
function agregarAlCarrito(idLibro, precio) {
  const detalle = {
      idLibro: idLibro,
      idUsuario: 1,
      cantidad: 1,
      precioUnitario: precio,
      precioTotal: precio
  };

  console.log("JSON enviado al backend:", detalle);

  fetch("https://localhost:7070/api/DetallesOrdenes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(detalle) // <<--- usa el objeto dinámico aquí
  })
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
}
