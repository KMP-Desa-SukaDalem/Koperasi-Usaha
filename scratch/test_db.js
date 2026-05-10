const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'koperasi_desa_db'
    });
    console.log('✅ Connection successful!');
    const [rows] = await connection.query('SELECT DATABASE() as db');
    console.log('Current DB:', rows[0].db);
    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();
