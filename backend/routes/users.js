const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email');

module.exports = (pool) => {
  // Signup
  router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });

      const hashed = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');

      await pool.query(
        'INSERT INTO users (name, email, password, verified, verification_token) VALUES ($1, $2, $3, FALSE, $4)',
        [name, email, hashed, verificationToken]
      );

      await sendVerificationEmail(email, name, verificationToken);
      res.status(201).json({ message: 'Check your email to verify your account' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Verify email
  router.get('/verify', async (req, res) => {
    const { token } = req.query;
    try {
      const result = await pool.query(
        'UPDATE users SET verified=TRUE, verification_token=NULL WHERE verification_token=$1 RETURNING id, name, email, avatar',
        [token]
      );

      if (result.rows.length === 0) return res.status(400).send('Invalid or expired verification link');

      const user = result.rows[0];
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`);
    } catch (err) {
      res.status(500).send('Something went wrong');
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
      const user = result.rows[0];

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      if (!user.password) return res.status(401).json({ error: 'Please login with Google' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      if (!user.verified) return res.status(401).json({ error: 'Please verify your email first' });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Recent users for notifications — MUST be before /:id routes
  router.get('/recent', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT id, name, email, avatar, created_at FROM users ORDER BY created_at DESC LIMIT 5'
      );
      res.json(result.rows);
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  });

  // Me
  router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id=$1',
        [decoded.id]
      );
      res.json(result.rows[0]);
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  });

  return router;
};