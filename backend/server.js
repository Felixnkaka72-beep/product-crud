const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Check and clean the data sent by the client
function validate(body) {
  body = body || {};
  const errors = [];
  const text = (v) => (v === undefined || v === null ? '' : String(v).trim());

  const product_name = text(body.product_name);
  if (!product_name) errors.push('product_name is required');

  const price = body.price === undefined || body.price === '' ? NaN : Number(body.price);
  if (Number.isNaN(price) || price < 0) errors.push('price must be a number, 0 or greater');

  const stock_quantity =
    body.stock_quantity === undefined || body.stock_quantity === '' ? 0 : Number(body.stock_quantity);
  if (!Number.isInteger(stock_quantity) || stock_quantity < 0)
    errors.push('stock_quantity must be a whole number, 0 or greater');

  return {
    errors,
    data: {
      product_name,
      category: text(body.category),
      brand: text(body.brand),
      price,
      stock_quantity,
      description: text(body.description),
    },
  };
}

function getId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/products - list all
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
  res.json(rows);
});

// GET /api/products/:id - get one
app.get('/api/products/:id', (req, res) => {
  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});

// POST /api/products - create
app.post('/api/products', (req, res) => {
  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', errors });

  const result = db
    .prepare(
      `INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(data.product_name, data.category, data.brand, data.price, data.stock_quantity, data.description);

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/products/:id - update
app.put('/api/products/:id', (req, res) => {
  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(id))
    return res.status(404).json({ error: 'Product not found' });

  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', errors });

  db.prepare(
    `UPDATE products
     SET product_name = ?, category = ?, brand = ?, price = ?, stock_quantity = ?,
         description = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(data.product_name, data.category, data.brand, data.price, data.stock_quantity, data.description, id);

  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
});

// DELETE /api/products/:id - delete
app.delete('/api/products/:id', (req, res) => {
  const id = getId(req);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted', id });
});

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler (bad JSON, unexpected errors)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));