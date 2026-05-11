const db = require('../config/database');

async function finalDbFix() {
  try {
    console.log('🚀 Starting final database fixes...');

    // 1. users table: allow email to be NULL
    console.log('Making users.email nullable...');
    await db.query('ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NULL');

    // 2. transaksi table: defaults and constraints
    console.log('Fixing transaksi table constraints...');
    await db.query('ALTER TABLE transaksi MODIFY COLUMN tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP');
    
    // Check if kode_transaksi should be nullable or have a default if the model doesn't provide it yet
    // But it's better if the model provides it. For safety, let's make it NULLable for now if it's causing 500s.
    await db.query('ALTER TABLE transaksi MODIFY COLUMN kode_transaksi VARCHAR(50) NULL');

    // 3. unit_usaha table: fix jenis_usaha
    console.log('Fixing unit_usaha.jenis_usaha...');
    await db.query("ALTER TABLE unit_usaha MODIFY COLUMN jenis_usaha VARCHAR(50) DEFAULT 'Retail'");

    // 4. Ensure all status are active/nonactive
    const tables = ['users', 'anggota', 'barang', 'unit_usaha'];
    for (const table of tables) {
      console.log(`Verifying status for ${table}...`);
      await db.query(`UPDATE ${table} SET status = 'active' WHERE status NOT IN ('active', 'nonactive') OR status IS NULL`);
    }

    console.log('✅ Final database fixes completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
    process.exit(1);
  }
}

finalDbFix();
