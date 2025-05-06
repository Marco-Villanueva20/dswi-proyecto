-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombres VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  rol ENUM('ADMINISTRADOR', 'USUARIO') NOT NULL
);
-- select * from libros;

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombres, username, password, rol) VALUES
('Marco Vargas', 'marcovs', '123', 'ADMINISTRADOR'),
('Lucía Pérez', 'luciapz', '456', 'USUARIO'),
('Carlos Díaz', 'cdiaz', '789', 'USUARIO');

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  precio REAL NOT NULL,
  imagen TEXT,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Insertar libros de ejemplo
INSERT INTO libros (titulo, autor, precio, imagen, id_usuario) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 50.00, 'img/soledad.jpg', 1),
('El Principito', 'Antoine de Saint-Exupéry', 30.00, 'img/principito.jpg', 1),
('1984', 'George Orwell', 45.00, 'img/1984.jpg', 2);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(20) NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  cantidad_total INT NOT NULL,
  precio_total REAL NOT NULL
);


-- Tabla de detalles de órdenes
CREATE TABLE IF NOT EXISTS detalles_ordenes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_orden INT NULL,
  id_libro INT NOT NULL,
  id_usuario INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario REAL NOT NULL,
  precio_total REAL NOT NULL,
  FOREIGN KEY (id_orden) REFERENCES ordenes(id) ON DELETE CASCADE,
  FOREIGN KEY (id_libro) REFERENCES libros(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
SELECT * FROM Libros WHERE Id = 1;

SELECT * FROM DETALLES_ORDENES;
SELECT * FROM Detalles_Ordenes WHERE Id_Usuario = 1 AND Id_Orden IS NULL;

select * from libros;
INSERT INTO detalles_ordenes (
    id_orden,
    id_libro,
    id_usuario,
    cantidad,
    precio_unitario,
    precio_total
)
VALUES (
    NULL,    -- idOrden es null
    1,       -- idLibro
    1,       -- idUsuario
    1,       -- cantidad
    50,      -- precioUnitario
    50       -- precioTotal
);
