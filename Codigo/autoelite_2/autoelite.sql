-- ============================================================
-- BASE DE DATOS: AutoElite — Concesionario Premium
-- Universidad Manuela Beltrán - Ingeniería Web 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS autoelite;
USE autoelite;

-- ------------------------------------------------------------
-- TABLA: usuarios
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id         INT          NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(150) NOT NULL,
  correo     VARCHAR(255) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol        ENUM('cliente','administrador') NOT NULL DEFAULT 'cliente',
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- TABLA: vehiculos
-- ------------------------------------------------------------
CREATE TABLE vehiculos (
  id              INT            NOT NULL AUTO_INCREMENT,
  marca           VARCHAR(100)   NOT NULL,
  modelo          VARCHAR(100)   NOT NULL,
  anio            YEAR           NOT NULL,
  precio          DECIMAL(12,2)  NOT NULL,
  estado          ENUM('disponible','vendido','pendiente') NOT NULL DEFAULT 'disponible',
  motor           VARCHAR(100)   NULL,
  transmision     VARCHAR(80)    NULL,
  tipo            VARCHAR(80)    NULL,
  categoria       VARCHAR(80)    NULL,
  imagen_url      TEXT           NULL,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- TABLA: ventas
-- ------------------------------------------------------------
CREATE TABLE ventas (
  id           INT           NOT NULL AUTO_INCREMENT,
  usuario_id   INT           NOT NULL,
  vehiculo_id  INT           NOT NULL UNIQUE,
  precio_venta DECIMAL(12,2) NOT NULL,
  fecha_venta  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
);

-- ------------------------------------------------------------
-- TRIGGER: marcar vehículo como vendido al registrar venta
-- ------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER after_venta_insert
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
  UPDATE vehiculos SET estado = 'vendido' WHERE id = NEW.vehiculo_id;
END$$
DELIMITER ;

-- ------------------------------------------------------------
-- DATOS: usuarios
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
  ('Admin AutoElite', 'admin@autoelite.com', '1234', 'administrador'),
  ('Carlos Pérez',    'carlos@gmail.com',    '1234', 'cliente'),
  ('Laura Gómez',     'laura@gmail.com',     '1234', 'cliente');

-- ------------------------------------------------------------
-- DATOS: vehículos
-- ------------------------------------------------------------
INSERT INTO vehiculos (marca, modelo, anio, precio, estado, motor, transmision, tipo, categoria, imagen_url) VALUES
  ('BMW',          'Serie 5',     2023, 185000000, 'disponible', '3.0L · 374 hp', 'Automático', 'Berlina',    'Sedanes',     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'),
  ('Mercedes-Benz','GLE 450',     2024, 320000000, 'disponible', '3.0L · 362 hp', 'Automático', 'SUV',        'SUV',         'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80'),
  ('Porsche',      '911 Carrera', 2022, 490000000, 'vendido',    '3.0L · 379 hp', 'PDK',        'Coupé',      'Deportivos',  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80'),
  ('Audi',         'Q7',          2023, 275000000, 'disponible', '3.0L · 335 hp', 'Automático', 'SUV 7p',     'SUV',         'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'),
  ('BMW',          'M4',          2024, 420000000, 'disponible', '3.0L · 503 hp', 'Automático', 'Coupé',      'Deportivos',  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'),
  ('Toyota',       'Land Cruiser',2023, 380000000, 'disponible', '3.3L · 309 hp', 'Automático', 'SUV',        'SUV',         'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80');
