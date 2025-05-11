const apiUrl = "https://localhost:7070/api/usuarios"; // Ajusta si es necesario

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("listar.html")) {
    cargarUsuarios();
  } else if (path.includes("editar.html")) {
    cargarUsuarioParaEditar();
  } else if (path.includes("insertar.html")) {
    prepararInsertarUsuario();
  } else if (path.includes("eliminar.html")) {
    cargarUsuarioParaEliminar();
  }
});

// ========== LISTAR ==========
function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  if (!tabla) return; // Seguridad por si algo sale mal

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      tabla.innerHTML = "";

      data.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${usuario.nombres}</td>
          <td>${usuario.username}</td>
          <td>${usuario.rol}</td>
          <td>
            <a href="editar.html?clave=${usuario.password}">Editar</a> |
            <a href="eliminar.html?clave=${usuario.password}">Eliminar</a>
          </td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(error => console.error("Error al cargar usuarios:", error));
}

// ========== EDITAR ==========
let idUsuarioEditando = null;

function cargarUsuarioParaEditar() {
  const clave = new URLSearchParams(window.location.search).get("clave");
  if (!clave) return;

  fetch(`${apiUrl}/por-clave/${clave}`)
    .then(response => response.json())
    .then(usuario => {
      idUsuarioEditando = usuario.id; // Guardar el id
      document.getElementById("nombres").value = usuario.nombres;
      document.getElementById("username").value = usuario.username;
      document.getElementById("password").value = usuario.password;
      document.getElementById("rol").value = usuario.rol;

      document.getElementById("formEditar").addEventListener("submit", function (e) {
        e.preventDefault();

        const usuarioEditado = {
          id: idUsuarioEditando,
          nombres: document.getElementById("nombres").value,
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
          rol: document.getElementById("rol").value,
        };

        fetch(`${apiUrl}/${idUsuarioEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioEditado),
        })
          .then(response => {
            if (response.ok) {
              alert("Usuario actualizado con éxito");
              window.location.href = "listar.html";
            } else {
              throw new Error("Error al actualizar usuario");
            }
          })
          .catch(error => console.error(error));
      });
    })
    .catch(error => console.error("Error al cargar usuario:", error));
}


// ========== INSERTAR ==========
function prepararInsertarUsuario() {
  document.getElementById("formInsertar").addEventListener("submit", e => {
    e.preventDefault();

    const usuario = {
      nombres: document.getElementById("nombres").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      rol: document.getElementById("rol").value,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    })
      .then(response => {
        if (response.ok) {
          window.location.href = "listar.html";
        } else {
          throw new Error("Error al insertar usuario");
        }
      })
      .catch(error => console.error(error));
  });
}

// ========== ELIMINAR ==========
function cargarUsuarioParaEliminar() {
  const clave = new URLSearchParams(window.location.search).get("clave");
  if (!clave) return;

  fetch(`${apiUrl}/por-clave/${clave}`)
    .then(response => response.json())
    .then(usuario => {
      document.getElementById("nombreEliminar").innerText = usuario.nombres;

      document.getElementById("btnEliminar").addEventListener("click", () => {
        fetch(`${apiUrl}/${usuario.id}`, {
          method: "DELETE",
        })
          .then(response => {
            if (response.ok) {
              alert("Usuario eliminado correctamente");
              window.location.href = "listar.html";
            } else {
              throw new Error("Error al eliminar");
            }
          })
          .catch(error => console.error("Error al eliminar usuario:", error));
      });
    })
    .catch(error => console.error("Error al cargar usuario:", error));
}
