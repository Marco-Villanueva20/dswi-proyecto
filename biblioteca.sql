create database biblioteca;
use biblioteca;


CREATE TABLE orden (
  id INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(20) NOT NULL, -- Por ejemplo: '#ORD001'
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  cantidad_total INT NOT NULL,
  precio_total REAL NOT NULL
);

CREATE TABLE libros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  precio REAL NOT NULL,
  imagen TEXT
);

CREATE TABLE detalle_orden (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_orden INT NOT NULL,
  id_libro INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario REAL NOT NULL,
  FOREIGN KEY (id_orden) REFERENCES orden(id),
  FOREIGN KEY (id_libro) REFERENCES libros(id)
);

