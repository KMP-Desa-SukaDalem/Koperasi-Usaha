const db = require('../config/database');
const bcrypt = require('bcrypt');

async function testAdd() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const nik = '9999999999';
    const nama_lengkap = 'Test Robot';
    const email = 'robot@test.com';
    const nomor_telepon = '089999999';

    console.log('Inserting anggota...');
    await conn.query(
      'INSERT INTO anggota (nik, nama_lengkap, email, nomor_telepon) VALUES (?, ?, ?, ?)',
      [nik, nama_lengkap, email, nomor_telepon]
    );

    console.log('Inserting user...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    await conn.query(
      'INSERT INTO users (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)',
      ['robot99', hashedPassword, nama_lengkap, 'pengurus']
    );

    await conn.commit();
    console.log('✅ Success!');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Error:', error);
  } finally {
    conn.release();
    process.exit();
  }
}

testAdd();
