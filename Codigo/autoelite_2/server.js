const express = require('express');
const session = require('express-session');
const path    = require('path');
const db      = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'autoelite_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const auth = (req, res, next) =>
  req.session.user ? next() : res.status(401).json({ error: 'No autenticado' });

// ── AUTH ──────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ ok: false, error: 'Completa todos los campos' });
  const [exists] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [email]);
  if (exists.length) return res.json({ ok: false, error: 'Ese correo ya existe' });
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
    [name, email, password]
  );
  req.session.user = { id: result.insertId, name, email, rol: 'cliente' };
  res.json({ ok: true, message: 'Cuenta creada' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query(
    'SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND contrasena = ?',
    [email, password]
  );
  if (!rows.length) return res.json({ ok: false, error: 'Correo o contraseña incorrectos' });
  const u = rows[0];
  req.session.user = { id: u.id, name: u.nombre, email: u.correo, rol: u.rol };
  res.json({ ok: true, message: 'Inicio exitoso' });
});

app.get('/api/auth/me',      (req, res) => res.json({ user: req.session.user || null }));
app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));

// ── VEHÍCULOS ─────────────────────────────────────────────

app.get('/api/cars', async (req, res) => {
  const { brand, model, maxPrice, year, category } = req.query;
  let sql = `
    SELECT
      id,
      marca        AS brand,
      modelo       AS model,
      anio         AS year,
      precio       AS price,
      CASE estado
        WHEN 'disponible' THEN 'available'
        WHEN 'vendido'    THEN 'sold'
        WHEN 'pendiente'  THEN 'pending'
      END          AS status,
      motor        AS engine,
      transmision  AS trans,
      tipo         AS type,
      categoria    AS category,
      imagen_url   AS img
    FROM vehiculos
    WHERE 1=1`;
  const vals = [];
  if (brand)    { sql += ' AND marca LIKE ?';    vals.push(`%${brand}%`); }
  if (model)    { sql += ' AND modelo LIKE ?';   vals.push(`%${model}%`); }
  if (maxPrice) { sql += ' AND precio <= ?';     vals.push(Number(maxPrice)); }
  if (year)     { sql += ' AND anio = ?';        vals.push(Number(year)); }
  if (category) { sql += ' AND categoria = ?';   vals.push(category); }
  const [rows] = await db.query(sql, vals);
  res.json(rows);
});

app.get('/api/brands', async (req, res) => {
  const [rows] = await db.query('SELECT DISTINCT marca FROM vehiculos ORDER BY marca');
  res.json(rows.map(r => r.marca));
});

app.post('/api/cars/:id/request', auth, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.query('SELECT * FROM vehiculos WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Vehículo no encontrado' });
  const car = rows[0];
  if (car.estado !== 'disponible') return res.status(400).json({ error: 'No disponible' });
  await db.query("UPDATE vehiculos SET estado = 'pendiente' WHERE id = ?", [id]);
  res.json({ ok: true, message: `Solicitud enviada para ${car.marca} ${car.modelo}` });
});

// ── VENTAS (admin) ────────────────────────────────────────

app.post('/api/ventas', auth, async (req, res) => {
  if (req.session.user.rol !== 'administrador')
    return res.status(403).json({ error: 'Sin permiso' });
  const { vehiculo_id, usuario_id } = req.body;
  const [car] = await db.query('SELECT precio FROM vehiculos WHERE id = ?', [vehiculo_id]);
  if (!car.length) return res.status(404).json({ error: 'Vehículo no encontrado' });
  await db.query(
    'INSERT INTO ventas (usuario_id, vehiculo_id, precio_venta) VALUES (?, ?, ?)',
    [usuario_id, vehiculo_id, car[0].precio]
  );
  res.json({ ok: true, message: 'Venta registrada' });
});

app.get('/api/ventas', auth, async (req, res) => {
  const [rows] = await db.query(`
    SELECT v.id, v.fecha_venta, v.precio_venta,
           u.nombre AS cliente, u.correo,
           vh.marca, vh.modelo, vh.anio
    FROM ventas v
    JOIN usuarios  u  ON u.id  = v.usuario_id
    JOIN vehiculos vh ON vh.id = v.vehiculo_id
    ORDER BY v.fecha_venta DESC
  `);
  res.json(rows);
});

app.listen(3000, () => console.log('AutoElite → http://localhost:3000'));
