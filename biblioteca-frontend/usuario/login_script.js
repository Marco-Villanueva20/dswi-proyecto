document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mensaje = document.getElementById('message');
  
    loginForm.addEventListener('submit', async (evento) => {
      evento.preventDefault();
  
      const usuarioIngresado = document.getElementById('username').value.trim();
      const claveIngresada = document.getElementById('password').value.trim();

      mensaje.textContent = '';
  
      try {
        const respuesta = await fetch(`https://localhost:7070/api/usuarios/login/${usuarioIngresado},${claveIngresada}`, {
          method: 'GET', // Se usa POST porque estamos enviando datos (usuario y contraseña)
          headers: {
            'Content-Type': 'application/json' // Indicamos que el cuerpo será JSON
          }
        });
  
        if (!respuesta.ok) {
          throw new Error('Error en el servidor');
        }
  
        const datos = await respuesta.json();
          
        if (datos.success) {
          localStorage.setItem('usuarioId', datos.usuario.id);
  
          window.location.href = '../index.html'; 
        } else {
          mensaje.textContent = datos.message || 'Credenciales incorrectas';
        }
      } catch (error) {
        console.error(error);
        mensaje.textContent = 'Ocurrió un error al iniciar sesión';
      }
    });
  });
  