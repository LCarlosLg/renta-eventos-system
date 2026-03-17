
CREATE DATABASE IF NOT EXISTS renta_manteleria_cristaleria_db;
USE renta_manteleria_cristaleria_db;

-- Table for roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insert default roles
INSERT INTO roles (nombre) VALUES ('admin'), ('empleado'), ('cliente');

-- Table for users
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    direccion VARCHAR(255) DEFAULT NULL,
    notas TEXT DEFAULT NULL,
    preferencias TEXT DEFAULT NULL,
    estado ENUM('activo', 'inactivo', 'moroso', 'bloqueado') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagen VARCHAR(255) NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Table for cristaleria
CREATE TABLE cristaleria (
    id_cristaleria INT PRIMARY KEY AUTO_INCREMENT,
    codigo_sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    material VARCHAR(50) NOT NULL,
    precio_dia DECIMAL(10,2) NOT NULL,
    cantidad_disponible INT NOT NULL,
    imagen VARCHAR(255) NULL,
    estado ENUM('disponible', 'rentado', 'en_limpieza', 'en_reparacion') DEFAULT 'disponible'
);

-- Table for manteleria
CREATE TABLE manteleria (
    id_manteleria INT PRIMARY KEY AUTO_INCREMENT,
    codigo_sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    medida VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    material VARCHAR(50) NOT NULL,
    tipo_tela VARCHAR(50) NOT NULL,
    precio_dia DECIMAL(10,2) NOT NULL,
    cantidad_total INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    imagen VARCHAR(255) NULL,
    estado ENUM('disponible', 'rentado', 'en_limpieza', 'en_reparacion') DEFAULT 'disponible'
);

-- Table for pedidos
CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Table for pedido detalles (historial de productos por pedido)
CREATE TABLE pedido_detalles (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    categoria ENUM('cristaleria', 'manteleria') NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- Table for carrito
CREATE TABLE carrito (
    id_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    categoria ENUM('cristaleria', 'manteleria') NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- View for productos to match the code's union
CREATE VIEW productos AS
SELECT 
    id_cristaleria AS id,
    nombre,
    precio_dia,
    'cristaleria' AS categoria,
    imagen
FROM cristaleria
WHERE estado = 'disponible'
UNION ALL
SELECT 
    id_manteleria AS id,
    nombre,
    precio_dia,
    'manteleria' AS categoria,
    imagen
FROM manteleria
WHERE estado = 'disponible';

-- Insert some sample data

-- Sample admin user
INSERT INTO usuarios (id_rol, nombre, email, password, telefono) 
VALUES (1, 'Admin', 'admin@example.com', '$2a$10$examplehash', '1234567890');

-- Sample client user
INSERT INTO usuarios (id_rol, nombre, email, password, telefono) 
VALUES (3, 'Cliente', 'cliente@example.com', '$2a$10$examplehash', '0987654321');

-- Sample cristaleria
INSERT INTO cristaleria (codigo_sku, nombre, tipo, material, precio_dia, cantidad_disponible) 
VALUES ('CR001', 'Vaso de cristal', 'vaso', 'cristal', 5.00, 100);

-- Sample manteleria
INSERT INTO manteleria (codigo_sku, nombre, medida, color, material, tipo_tela, precio_dia, cantidad_total, cantidad_disponible) 
VALUES ('MT001', 'Mantel blanco', '2x2m', 'blanco', 'algodon', 'liso', 10.00, 50, 50);