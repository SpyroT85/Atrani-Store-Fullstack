const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const upload = multer({ dest: 'uploads/' });

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

  // Forgot password
  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
      const user = result.rows[0];

      if (!user || !user.password) {
        return res.json({ message: 'If this email exists, a reset link has been sent.' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(
        'UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE id=$3',
        [resetToken, expiresAt, user.id]
      );

      await sendPasswordResetEmail(email, user.name, resetToken);
      res.json({ message: 'If this email exists, a reset link has been sent.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset password
  router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE reset_token=$1 AND reset_token_expires > NOW()',
        [token]
      );
      const user = result.rows[0];
      if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });

      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET password=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2',
        [hashed, user.id]
      );
      res.json({ message: 'Password reset successfully' });
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

  // Get all store customers (for admin panel)
  router.get('/all', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT id, name, email, avatar, verified, created_at FROM users ORDER BY created_at DESC'
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

  // Update profile (name + avatar)
  router.put('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { name, avatar } = req.body;
      const result = await pool.query(
        'UPDATE users SET name=$1, avatar=$2 WHERE id=$3 RETURNING id, name, email, avatar',
        [name, avatar, decoded.id]
      );
      res.json(result.rows[0]);
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  });

  // Change password (logged in user)
  router.put('/me/password', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { currentPassword, newPassword } = req.body;

      const result = await pool.query('SELECT * FROM users WHERE id=$1', [decoded.id]);
      const user = result.rows[0];

      if (!user.password) return res.status(400).json({ error: 'Google accounts cannot change password' });

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, decoded.id]);
      res.json({ message: 'Password updated successfully' });
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  });

  // Upload avatar to Cloudinary
  router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'atrani-avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
      });
      res.json({ url: result.secure_url });
    } catch {
      res.status(403).json({ error: 'Invalid token' });
    }
  });

  return router;
};