document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const titulo = document.getElementById('titulo-seccion');
    const thead = document.getElementById('thead');
    const tbody = document.getElementById('tbody');
  
    sidebarLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
  
        const section = link.dataset.section;
        titulo.textContent = capitalize(section);
  
        loadSection(section);
      });
    });
  
    function loadSection(section) {
      let columns = [];
      let rows = [];
  
      switch (section) {
        case 'usuarios':
          columns = ['ID', 'Nombre', 'Email', 'Acciones'];
          rows = [
            { id: 1, nombre: 'Marco', email: 'marco@mail.com' },
            { id: 2, nombre: 'Lucía', email: 'lucia@mail.com' }
          ];
          break;
        case 'libros':
          columns = ['ID', 'Título', 'Autor', 'Acciones'];
          rows = [
            { id: 1, titulo: 'Libro A', autor: 'Autor 1' },
            { id: 2, titulo: 'Libro B', autor: 'Autor 2' }
          ];
          break;
        case 'ordenes':
          columns = ['ID', 'Descripción', 'Fecha', 'Acciones'];
          rows = [
            { id: 1, descripcion: '#ORD123', fecha: '2025-05-06' },
            { id: 2, descripcion: '#ORD124', fecha: '2025-05-07' }
          ];
          break;
        case 'detalles':
          columns = ['ID', 'ID Orden', 'Libro', 'Cantidad', 'Acciones'];
          rows = [
            { id: 1, ordenId: 1, libro: 'Libro A', cantidad: 2 },
            { id: 2, ordenId: 1, libro: 'Libro B', cantidad: 1 }
          ];
          break;
      }
  
      renderTable(columns, rows);
    }
  
    function renderTable(columns, rows) {
      thead.innerHTML = `<tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
      tbody.innerHTML = rows.map(row => {
        const valores = Object.values(row).map(val => `<td>${val}</td>`).join('');
        const acciones = `
          <td>
            <button class="btn btn-sm btn-warning me-2"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
          </td>`;
        return `<tr>${valores}${acciones}</tr>`;
      }).join('');
    }
  
    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  
    // Carga inicial
    loadSection('usuarios');
  });
  