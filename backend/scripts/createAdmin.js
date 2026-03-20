const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
  const email = 'demo@atrani-adminpanel.com';
  const password = 'admin123';
  const role = 'admin';

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO admins (email, password, role) VALUES ($1, $2, $3)',
    [email, hashed, role]
  );

  console.log('✅ Admin created:', email);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});