const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = (pool) => {
  // Admin login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
      const admin = result.rows[0];
      if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      res.json({ id: admin.id, email: admin.email, role: admin.role, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Google OAuth
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=true` }),
    (req, res) => {
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  );

  return router;
};