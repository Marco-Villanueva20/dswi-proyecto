// Espera a que toda la página esté completamente cargada antes de ejecutar cualquier código
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el formulario de inicio de sesión por su ID
    const loginForm = document.getElementById('loginForm');
    
    // Obtiene el contenedor donde se mostrarán mensajes de error o advertencia
    const mensaje = document.getElementById('message');
  
    // Cuando se envía el formulario (el usuario hace clic en "Ingresar")
    loginForm.addEventListener('submit', async (evento) => {
      // Previene que el formulario recargue la página al enviar los datos
      evento.preventDefault();
  
      // Toma el valor que el usuario escribió en el campo "Usuario"
      const usuarioIngresado = document.getElementById('username').value.trim();
  
      // Toma el valor que el usuario escribió en el campo "Contraseña"
      const claveIngresada = document.getElementById('password').value.trim();
  
      // Limpia cualquier mensaje anterior que se haya mostrado
      mensaje.textContent = '';
  
      try {
        // Realiza una solicitud POST al backend para verificar las credenciales
        const respuesta = await fetch(`https://localhost:7070/api/usuarios/login/${usuarioIngresado},${claveIngresada}`, {
          method: 'GET', // Se usa POST porque estamos enviando datos (usuario y contraseña)
          headers: {
            'Content-Type': 'application/json' // Indicamos que el cuerpo será JSON
          }
        });
  
        // Si la respuesta no es exitosa (por ejemplo, 404 o 500), lanza error
        if (!respuesta.ok) {
          throw new Error('Error en el servidor');
        }
  
        // Convierte la respuesta de texto plano a objeto JSON
        const datos = await respuesta.json();
  
        // Para depurar: puedes ver la respuesta completa del servidor
        console.log(datos);
  
        // Si el backend devuelve éxito (por ejemplo: { success: true, token: "...", usuario: { ... } })
        if (datos.success) {
          // Guarda el token en localStorage para usarlo luego (por ejemplo, para acceder a rutas protegidas)
          localStorage.setItem('token', datos.token);
  
          // Redirige al usuario al dashboard o página principal después del login exitoso
          window.location.href = '../index.html'; 
        } else {
          // Si el login falló, muestra un mensaje en pantalla
          mensaje.textContent = datos.message || 'Credenciales incorrectas';
        }
      } catch (error) {
        // Si ocurre algún error en la solicitud, muestra un mensaje en pantalla y también en la consola
        console.error(error);
        mensaje.textContent = 'Ocurrió un error al iniciar sesión';
      }
    });
  });
  