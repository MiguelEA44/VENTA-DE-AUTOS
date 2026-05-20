# AutoElite — Concesionario Digital

Plataforma web para la gestión y venta de vehículos premium. Desarrollada como proyecto de **Ingeniería Web — Universidad Manuela Beltrán 2026**.

---

## Descripción

AutoElite es una aplicación web full stack que permite a los usuarios explorar un catálogo de vehículos, registrarse, iniciar sesión y solicitar la compra de un vehículo. Los administradores pueden gestionar el inventario y registrar ventas.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| Backend | Node.js, Express.js |
| Base de datos | MySQL (XAMPP) |
| Autenticación | express-session |
| Pruebas | Postman |

---

## Estructura del proyecto
autoelite/
├── server.js ← Servidor principal y rutas API
├── db.js ← Conexión a MySQL
├── package.json
├── autoelite.sql ← Script de base de datos
└── public/
├── index.html     ← Página principal y catálogo
├── login.html     ← Inicio de sesión
├── registro.html  ← Registro de usuario
└── style.css      ← Estilos globales

---

## Instalación y ejecución

### Requisitos previos
- [Node.js](https://nodejs.org) v18 o superior
- [XAMPP](https://www.apachefriends.org) con MySQL activo

### Pasos

**1. Clona el repositorio**
git clone https://github.com/MiguelEA44/VENTA-DE-AUTOS.git
cd VENTA-DE-AUTOS
**2. Instala las dependencias**
npm install
**3. Crea la base de datos**
- Abre phpMyAdmin en `http://localhost/phpmyadmin`
- Crea una base de datos llamada `autoelite`
- Importa el archivo `autoelite.sql`

**4. Configura la conexión en `db.js`**
host:     '127.0.0.1',
user:     'root',
password: '',        ← tu contraseña de MySQL
database: 'autoelite'
**5. Inicia el servidor**
node server.js
**6. Abre en el navegador**
http://localhost:3000

---

## Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@autoelite.com | 1234 | Administrador |
| carlos@gmail.com | 1234 | Cliente |
| laura@gmail.com | 1234 | Cliente |

---

## Endpoints de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/auth/register | Registrar usuario | No |
| POST | /api/auth/login | Iniciar sesión | No |
| POST | /api/auth/logout | Cerrar sesión | No |
| GET | /api/auth/me | Sesión activa | No |
| GET | /api/cars | Listar vehículos | No |
| GET | /api/brands | Listar marcas | No |
| POST | /api/cars/:id/request | Solicitar vehículo | ✅ Sí |

---

## Arquitectura del sistema
[ Navegador ]
index.html · login.html · registro.html
↕ HTTP / JSON
[ Servidor — Node.js + Express ]
server.js → rutas auth y cars
db.js     → pool de conexiones
↕ SQL
[ Base de datos — MySQL ]
usuarios · vehiculos · ventas

---

## Pruebas realizadas

| # | Caso | Resultado |
|---|------|-----------|
| 1 | Registro de usuario nuevo | ✅ |
| 2 | Login con credenciales correctas | ✅ |
| 3 | Login con credenciales incorrectas | ✅ |
| 4 | Ver catálogo completo | ✅ |
| 5 | Filtrar vehículos por marca | ✅ |
| 6 | Solicitar vehículo con sesión activa | ✅ |
| 7 | Solicitar vehículo sin sesión | ✅ |
| 8 | Cerrar sesión | ✅ |

---

## 👥 Autores

Desarrollado por el equipo de Ingeniería Web — Universidad Manuela Beltrán 2026.
