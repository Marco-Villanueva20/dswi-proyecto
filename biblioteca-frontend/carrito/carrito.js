document.addEventListener("DOMContentLoaded", () => {
    const contenedorItems = document.getElementById("contenedor-libros");
    const resumenTotal = document.querySelector(".fs-5 span:last-child");
    const totalItems = document.querySelector("p span:first-child");
    const idUsuario = localStorage.getItem("usuarioId");
    let total = 0;
    let cantidadLibros = 0;
    let carritoVacio =  `
                <div class="d-flex justify-content-center">
                    <p class="text-secondary fw-semibold mt-4">Tu carrito está vacío.</p>
                </div>
            `;


    fetch("https://localhost:7070/api/DetallesOrdenes/CarritoUsuario/" + idUsuario) // ID del usuario
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    if (error.mensaje === "Vacio") {
                        carritoVacio;
                    } else {
                        // Forzamos que el flujo pare aquí lanzando error
                        throw new Error("Carrito vacío o error en el servidor");
                    }
                });
            }
            return response.json();
        })
        .then(detalles => {
            if (!detalles || detalles.length === 0) {
                contenedorItems.innerHTML = carritoVacio;
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
                    console.log("Actualizando ID:", idDetalle.idUsuario); // Esto debería mostrar solo un número

                    const body = {

                        id: parseInt(card.dataset.idDetalle),
                        idLibro: parseInt(card.dataset.idLibro),
                        idUsuario: parseInt(card.dataset.idUsuario), // Asegúrate de que sea número
                        cantidad: nuevaCantidad,
                        precioUnitario: parseFloat(card.dataset.precioUnitario),
                        precioTotal: parseFloat(card.dataset.precioUnitario) * nuevaCantidad

                    };
                    console.log("Actualizando ID:", body);


                    fetch(`https://localhost:7070/api/DetallesOrdenes/${body.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                        .then(res => {
                            if (!res.ok) {
                                return res.json().then(error => {
                                    console.error("Error del backend:", error);
                                    alert("Error al actualizar cantidad: " + JSON.stringify(error));
                                });
                            }

                            // Actualizar cantidad en el input
                            inputCantidad.value = nuevaCantidad;

                            // Actualizar el total individual (en tu backend lo recalculas, pero aquí también puedes actualizarlo)
                            const precioUnitario = parseFloat(card.dataset.precioUnitario);
                            const nuevoTotalItem = precioUnitario * nuevaCantidad;

                            // Actualizar variables globales y resumen
                            cantidadLibros += nuevaCantidad - parseInt(detalle.cantidad); // detalle.cantidad es del bucle original, no está actualizado
                            total += nuevoTotalItem - (precioUnitario * parseInt(detalle.cantidad));

                            // Actualizar resumen en la vista
                            resumenTotal.textContent = `$${total.toFixed(2)}`;
                            totalItems.textContent = `Items (${cantidadLibros})`;
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

                btnEliminar.addEventListener("click", () => {
                    const idDetalle = card.dataset.idDetalle;
                    fetch(`https://localhost:7070/api/DetallesOrdenes/${idDetalle}`, {
                        method: "DELETE"
                    })
                        .then(res => {
                            if (res.ok) {
                                // Quitar visualmente el item
                                card.remove();

                                // Actualizar totales
                                const cantidadEliminada = parseInt(inputCantidad.value);
                                const precioEliminado = cantidadEliminada * parseFloat(card.dataset.precioUnitario);
                                cantidadLibros -= cantidadEliminada;
                                total -= precioEliminado;

                                // Actualizar resumen en la vista
                                resumenTotal.textContent = `$${total.toFixed(2)}`;
                                totalItems.textContent = `Items (${cantidadLibros})`;

                                // Si ya no hay libros, mostrar mensaje
                                if (cantidadLibros === 0) {
                                    contenedorItems.innerHTML = carritoVacio
                                }
                            } else {
                                alert("Error al eliminar libro del carrito");
                            }
                        });
                });

            });

            // Actualizar resumen
            resumenTotal.textContent = `$${total.toFixed(2)}`;
            totalItems.textContent = `Items (${cantidadLibros})`;
        })
        .catch(err => {
            contenedorItems.innerHTML += `<p class="text-danger">Error al cargar el carrito: ${err}</p>`;
        });

    document.querySelector(".limp").addEventListener("click", () => {
        const idUsuario = 1; // ID real del usuario
        if (confirm("¿Seguro que deseas vaciar el carrito?")) {
            limpiarCarrito(idUsuario);
        }
    });

    function limpiarCarrito(idUsuario) {
        fetch(`https://localhost:7070/api/DetallesOrdenes/LimpiarCarrito/${idUsuario}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al limpiar el carrito");
                return response.text();
            })
            .then(data => {
                alert(data);
                contenedorItems.innerHTML = carritoVacio;
                resumenTotal.textContent = "$0.00";
                totalItems.textContent = "Items (0)";
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error al limpiar el carrito");
            });
    }

    document.getElementById("btn-pagar").addEventListener("click", () => {
        if (cantidadLibros === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        const idUsuario = 1; // Aquí usas el ID real del usuario
        const fechaActual = new Date().toISOString(); // formato ISO estándar

        const orden = {
            idUsuario: idUsuario,
            fechaCreacion: fechaActual,
            descripcion: `#ORD${Math.floor(Math.random() * 1000000)}`,
            cantidadTotal: cantidadLibros,
            precioTotal: total
        };


        fetch("https://localhost:7070/api/Ordenes/CrearConDetalles/1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orden)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => {
                        throw new Error(err.message || "No se pudo crear la orden.");
                    });
                }
                return res.json(); // Devuelve la orden creada
            })
            .then(data => {
                alert("Orden creada con éxito.");
                // Opcional: redirige a la página de órdenes o reinicia el carrito
                window.location.href = "../ordenes/ordenes.html";
            })
            .catch(error => {
                console.error("Error al crear la orden:", error);
                alert("Ocurrió un error al procesar tu orden.");
            });
    });


});

