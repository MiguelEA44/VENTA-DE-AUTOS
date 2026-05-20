const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'root',        // ← tu contraseña de MySQL aquí
  database: 'autoelite',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
