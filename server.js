const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Railway's public proxy needs SSL; the internal network does not.
      ssl: process.env.DATABASE_URL.includes('railway.internal') ? false : { rejectUnauthorized: false },
    })
  : null;

async function initDb() {
  if (!pool) {
    console.warn('DATABASE_URL puudub – salvestamine on välja lülitatud.');
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS looks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      config JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  console.log('Andmebaas valmis.');
}

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function requireDb(req, res, next) {
  if (!pool) return res.status(503).json({ error: 'Andmebaas pole ühendatud.' });
  next();
}

app.get('/api/looks', requireDb, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, config, created_at FROM looks ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lookide laadimine ebaõnnestus.' });
  }
});

app.post('/api/looks', requireDb, async (req, res) => {
  const { name, config } = req.body || {};
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return res.status(400).json({ error: 'Vigane look.' });
  }
  const cleanName = String(name || '').trim().slice(0, 40) || 'Nimetu look';
  try {
    const { rows } = await pool.query(
      'INSERT INTO looks (name, config) VALUES ($1, $2) RETURNING id, name, config, created_at',
      [cleanName, config]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Salvestamine ebaõnnestus.' });
  }
});

app.delete('/api/looks/:id', requireDb, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Vigane id.' });
  try {
    await pool.query('DELETE FROM looks WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kustutamine ebaõnnestus.' });
  }
});

initDb()
  .catch((err) => console.error('Andmebaasi seadistamine ebaõnnestus:', err))
  .finally(() => {
    app.listen(PORT, () => console.log(`Server töötab pordil ${PORT}`));
  });
