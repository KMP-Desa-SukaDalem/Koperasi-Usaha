const db = require('./config/database');

async function createTables() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS anggota (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nik VARCHAR(20) NOT NULL UNIQUE,
        nama_lengkap VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        nomor_telepon VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table anggota created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS supplier (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_penanggung_jawab VARCHAR(100) NOT NULL,
        nama_toko VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        alamat TEXT NOT NULL,
        nomor_telepon VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table supplier created');

    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

createTables();
