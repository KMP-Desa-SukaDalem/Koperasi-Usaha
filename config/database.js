const mysql = require('mysql2/promise');

// Validasi variabel lingkungan wajib
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'DB_PORT'];
requiredEnvVars.forEach((varName) => {
  if (process.env[varName] === undefined) {
    console.warn(`⚠️ Warning: Environment variable ${varName} is missing!`);
  }
});
if (process.env.DB_PASSWORD === undefined) {
  console.warn(`⚠️ Warning: Environment variable DB_PASSWORD is missing!`);
}

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Aktifkan SSL hanya jika host bukan localhost atau 127.0.0.1 (misalnya untuk database production cloud)
if (process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'db' && process.env.DB_HOST !== 'mysql') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
