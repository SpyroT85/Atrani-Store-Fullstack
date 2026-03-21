const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/auth');

const requireAdmin = (req, res, next) => {
  if (req.admin?.role !== 'admin' && req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Demo mode — read only access' });
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

module.exports = (pool) => {
  // Get all products
  router.get('/', async (req, res) => {
    const { category } = req.query;
    try {
      const result = category
        ? await pool.query('SELECT * FROM products WHERE category=$1 ORDER BY created_at DESC', [category])
        : await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get single product by slug
  router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
      const result = await pool.query('SELECT * FROM products WHERE slug=$1', [slug]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Upload image
  router.post('/upload', authMiddleware, requireAdmin, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'atrani-store' });
      res.json({ url: result.secure_url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add product
  router.post('/', authMiddleware, requireAdmin, async (req, res) => {
    const { name, category, price, image_url, description, code, slug, material, water_resistance, movement, battery, waterproof } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO products (name, category, price, image_url, description, code, slug, material, water_resistance, movement, battery, waterproof) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [name, category, parseFloat(price) || 0, image_url, description, code || null, slug || null, material || null, water_resistance || null, movement || null, battery || null, waterproof || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Edit product
  router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, category, price, image_url, description, code, slug, material, water_resistance, movement, battery, waterproof } = req.body;
    try {
      const result = await pool.query(
        'UPDATE products SET name=$1, category=$2, price=$3, image_url=$4, description=$5, code=$6, slug=$7, material=$8, water_resistance=$9, movement=$10, battery=$11, waterproof=$12 WHERE id=$13 RETURNING *',
        [name, category, parseFloat(price) || 0, image_url, description, code || null, slug || null, material || null, water_resistance || null, movement || null, battery || null, waterproof || null, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete product
  router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM products WHERE id=$1', [id]);
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};