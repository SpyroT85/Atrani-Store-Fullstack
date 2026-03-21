
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authMiddleware = require('./middleware/auth');
const { BrevoClient } = require('@getbrevo/brevo');
const emailApi = new BrevoClient({
  apiKey: process.env.BREVO_SMTP_KEY,
});


function requireAdmin(req, res, next) {
  if (req.admin?.role !== 'admin' && req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Demo mode — read only access' });
  }
  next();
}

function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Superadmin access required' });
  }
  next();
}



async function sendVerificationEmail(email, name, token) {
  console.log('📧 Sending email to:', email);
  const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify?token=${token}`;

  try {
    await emailApi.transactionalEmails.sendTransacEmail({
      sender: { name: 'Atrani Watches', email: process.env.FROM_EMAIL },
      to: [{ email, name }],
      subject: 'Verify your Atrani account',
      htmlContent: `
        <div style="font-family: Manrope, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          <div style="background: #1a1a1a; padding: 32px 40px;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a37a41;">ATRANI</h1>
            <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #666;">Watches & Fine Writing</p>
          </div>
          <div style="padding: 48px 40px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Verify your email address</h2>
            <p style="margin: 0 0 12px; font-size: 15px; color: #555; line-height: 1.6;">Hi ${name},</p>
            <p style="margin: 0 0 32px; font-size: 15px; color: #555; line-height: 1.6;">Thank you for creating an account with Atrani. Please verify your email address to activate your account.</p>
            <div style="text-align: center; margin: 0 0 40px;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 16px 40px; background: #a37a41; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
                Verify Email Address
              </a>
            </div>
            <p style="margin: 0; font-size: 12px; color: #bbb; line-height: 1.6;">If you didn't create an account with Atrani, you can safely ignore this email. This link will expire in 24 hours.</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">© 2025 Atrani Watches. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log('✅ Email sent to:', email);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
}

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// App 
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
}));
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const avatar = profile.photos[0].value;
    const google_id = profile.id;

    let result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO users (name, email, google_id, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, google_id, avatar]
      );
    }

    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
// Admin accounts management
app.get('/api/admins', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM admins ORDER BY created_at DESC'
    );
    res.json(result.rows.map(a => ({ id: a.id, email: a.email, role: a.role, created_at: a.created_at })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admins/:id', authMiddleware, requireSuperAdmin, async (req, res) => {
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

app.put('/api/admins/:id/role', authMiddleware, requireSuperAdmin, async (req, res) => {
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

// Statistics

// Create admin account
app.post('/api/admins/create', authMiddleware, requireSuperAdmin, async (req, res) => {
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


// Admin invite route (after admin routes)
app.post('/api/admins/invite', authMiddleware, requireAdmin, async (req, res) => {
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

// Accept Admin Invite
app.post('/api/admins/accept-invite', async (req, res) => {
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
app.get('/api/stats', authMiddleware, async (req, res) => {
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
app.get('/', (req, res) => res.send('Atrani Store API is running!'));

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Auth
app.post('/api/auth/login', async (req, res) => {
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

// User Auth
app.post('/api/users/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      'INSERT INTO users (name, email, password, verified, verification_token) VALUES ($1, $2, $3, FALSE, $4) RETURNING id, name, email',
      [name, email, hashed, verificationToken]
    );

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({ message: 'Check your email to verify your account' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/verify', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
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

app.get('/api/users/me', async (req, res) => {
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

// Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
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

// Products
app.get('/api/products', async (req, res) => {
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

app.post('/upload', authMiddleware, requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'atrani-store' });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE slug=$1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authMiddleware, requireAdmin, async (req, res) => {
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

app.put('/api/products/:id', authMiddleware, requireAdmin, async (req, res) => {
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

app.delete('/api/products/:id', authMiddleware, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));