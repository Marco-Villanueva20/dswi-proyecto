namespace BibliotecaApi.Models
{
        public class OrdenItem
        {
            public int Id { get; set; }

            public int OrdenId { get; set; }
            public Orden Orden { get; set; }

            public int LibroId { get; set; }
            public Libro Libro { get; set; }

            public int Cantidad { get; set; }
        }

  
}
