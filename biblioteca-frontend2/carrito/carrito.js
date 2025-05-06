document.addEventListener("DOMContentLoaded", () => {
    const contenedorItems = document.getElementById("contenedor-libros");
    const resumenTotal = document.querySelector(".fs-5 span:last-child");
    const totalItems = document.querySelector("p span:first-child");
    let total = 0;
    let cantidadLibros = 0;

    fetch("https://localhost:7070/api/DetallesOrdenes/CarritoUsuario/1") // ID del usuario
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.mensaje || "Error desconocido");
            });
        }
        return response.json();
    })
        .then(detalles => {
            if (detalles.length === 0) {
                contenedorItems.innerHTML = `<p class="text-warning">Tu carrito está vacío.</p>`;
                resumenTotal.textContent = `$0.00`;
                totalItems.textContent = `Items (0)`;
                return;
            }
            detalles.forEach(detalle => {
                cantidadLibros += detalle.cantidad;
                total += detalle.precioTotal;

                const card = document.createElement("div");
                card.className = "row align-items-center m-3";

                card.innerHTML = `
                    <div class="col-md-2">
                        <img src="../${detalle.libro.imagen}" class="img-fluid rounded-start" alt="Book image" />
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h6 class="card-title fw-bold mb-1">${detalle.libro.titulo}</h6>
                            <p class="card-text text-muted mb-1">${detalle.libro.autor}</p>
                            <p class="card-text text-primary fw-semibold">$${detalle.precioUnitario.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="d-flex justify-content-center align-items-center gap-2">
                            <button class="btn btn-outline-secondary btn-sm btn-menos">-</button>
                            <input type="text" class="form-control form-control-sm text-center cantidad-input" style="width: 50px;" value="${detalle.cantidad}" readonly />
                            <button class="btn btn-outline-secondary btn-sm btn-mas">+</button>
                            <button class="btn btn-outline-danger btn-sm ms-2 btn-eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

                // Guardar info adicional en dataset para luego usarla
                card.dataset.idDetalle = detalle.id;
                card.dataset.idLibro = detalle.idLibro;
                card.dataset.idUsuario = detalle.idUsuario;
                card.dataset.precioUnitario = detalle.precioUnitario;

                // Añadir al DOM
                contenedorItems.appendChild(card);

                // Botones
                const btnMenos = card.querySelector(".btn-menos");
                const btnMas = card.querySelector(".btn-mas");
                const btnEliminar = card.querySelector(".btn-eliminar");
                const inputCantidad = card.querySelector(".cantidad-input");

                // FUNCIONES
                const actualizarCantidad = (nuevaCantidad) => {
                    if (nuevaCantidad < 1) return;

                    const idDetalle = card.dataset.idDetalle;
                    const body = {
                        id: parseInt(idDetalle),
                        idOrden: null,
                        idLibro: parseInt(card.dataset.idLibro),
                        idUsuario: parseInt(card.dataset.idUsuario),
                        cantidad: nuevaCantidad,
                        precioUnitario: parseFloat(card.dataset.precioUnitario),
                        precioTotal: parseFloat(card.dataset.precioUnitario) * nuevaCantidad
                    };

                    fetch(`https://localhost:7070/api/DetallesOrdenes/${idDetalle}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    })
                    .then(res => {
                        if (res.ok) location.reload();
                        else alert("Error al actualizar cantidad");
                    });
                };

                const eliminarDetalle = () => {
                    const idDetalle = card.dataset.idDetalle;
                    fetch(`https://localhost:7070/api/DetallesOrdenes/${idDetalle}`, {
                        method: "DELETE"
                    })
                    .then(res => {
                        if (res.ok) location.reload();
                        else alert("Error al eliminar libro del carrito");
                    });
                };

                // EVENTOS
                btnMas.addEventListener("click", () => {
                    const cantidadActual = parseInt(inputCantidad.value);
                    actualizarCantidad(cantidadActual + 1);
                });

                btnMenos.addEventListener("click", () => {
                    const cantidadActual = parseInt(inputCantidad.value);
                    if (cantidadActual > 1) {
                        actualizarCantidad(cantidadActual - 1);
                    }
                });

                btnEliminar.addEventListener("click", eliminarDetalle);
            });

            // Actualizar resumen
            resumenTotal.textContent = `$${total.toFixed(2)}`;
            totalItems.textContent = `Items (${cantidadLibros})`;
        })
        .catch(err => {
            contenedorItems.innerHTML += `<p class="text-danger">Error al cargar el carrito: ${err}</p>`;
        });
});
