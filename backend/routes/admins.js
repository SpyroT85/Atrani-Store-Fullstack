const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { emailApi } = require('../utils/email');

const requireAdmin = (req, res, next) => {
  if (req.admin?.role !== 'admin' && req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Demo mode — read only access' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Superadmin access required' });
  }
  next();
};

module.exports = (pool) => {
  // Get all admins
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, role, created_at FROM admins ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete admin
  router.delete('/:id', authMiddleware, requireSuperAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      if (parseInt(id) === req.admin.id)
        return res.status(400).json({ error: 'Cannot delete yourself' });
      await pool.query('DELETE FROM admins WHERE id=$1', [id]);
      res.json({ message: 'Admin deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update admin role
  router.put('/:id/role', authMiddleware, requireSuperAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['superadmin', 'admin', 'demo'].includes(role))
      return res.status(400).json({ error: 'Invalid role' });
    try {
      const result = await pool.query(
        'UPDATE admins SET role=$1 WHERE id=$2 RETURNING id, email, role',
        [role, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create admin
  router.post('/create', authMiddleware, requireSuperAdmin, async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!['admin', 'demo', 'superadmin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    try {
      const existing = await pool.query('SELECT id FROM admins WHERE email=$1', [email]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already exists' });
      const hashed = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO admins (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
        [email, hashed, role]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Invite admin
  router.post('/invite', authMiddleware, requireAdmin, async (req, res) => {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    try {
      const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '48h' });
      const inviteUrl = `${process.env.ADMIN_PANEL_URL}/accept-invite?token=${token}`;

      await emailApi.transactionalEmails.sendTransacEmail({
        sender: { name: 'Atrani Admin', email: process.env.FROM_EMAIL },
        to: [{ email }],
        subject: 'You have been invited to Atrani Admin Panel',
        htmlContent: `
          <div style="font-family: Manrope, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
            <div style="background: #1a1a1a; padding: 32px 40px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a37a41;">ATRANI</h1>
              <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #666;">Watches & Fine Writing</p>
            </div>
            <div style="padding: 48px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1a1a1a;">You're invited</h2>
              <p style="margin: 0 0 32px; font-size: 15px; color: #555; line-height: 1.6;">You have been invited to join the <strong>Atrani Admin Panel</strong> as <strong>${role}</strong>. Click the button below to set your password and activate your account.</p>
              <div style="text-align: center; margin: 0 0 40px;">
                <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background: #a37a41; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
                  Accept Invite
                </a>
              </div>
              <p style="margin: 0; font-size: 12px; color: #bbb; line-height: 1.6;">If you weren't expecting this invitation, you can safely ignore this email. This link will expire in 48 hours.</p>
            </div>
            <div style="background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">© 2025 Atrani Watches. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      res.json({ message: 'Invite sent successfully' });
    } catch (err) {
      console.error('Email error:', err);
      res.status(500).json({ error: 'Failed to send invite' });
    }
  });

  // Accept invite
  router.post('/accept-invite', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, role } = decoded;

      const existing = await pool.query('SELECT id FROM admins WHERE email=$1', [email]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Account already exists' });

      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO admins (email, password, role) VALUES ($1, $2, $3)',
        [email, hashed, role]
      );

      res.json({ message: 'Account created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Invalid or expired invite link' });
    }
  });

  // Stats
  router.get('/stats', authMiddleware, async (req, res) => {
    try {
      const [products, users, categories, recentUsers] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM products'),
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'),
        pool.query('SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'),
      ]);

      res.json({
        totalProducts: parseInt(products.rows[0].count),
        totalUsers: parseInt(users.rows[0].count),
        categoriesBreakdown: categories.rows,
        recentUsers: recentUsers.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};