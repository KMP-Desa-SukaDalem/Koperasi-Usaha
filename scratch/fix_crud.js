const db = require('../config/database');

async function fixAllCrud() {
  try {
    console.log('🚀 Starting comprehensive CRUD fix...');

    // 1. Fix Status ENUMs to 'active'/'nonactive' (unify with code)
    const tablesToFix = ['users', 'anggota', 'barang', 'unit_usaha'];
    
    for (const table of tablesToFix) {
      console.log(`Fixing status ENUM for ${table}...`);
      
      // Check current enum values
      const [cols] = await db.query(`DESCRIBE ${table}`);
      const statusCol = cols.find(c => c.Field === 'status');
      
      if (statusCol) {
        // Temporarily change to VARCHAR to update data easily
        await db.query(`ALTER TABLE ${table} MODIFY COLUMN status VARCHAR(20)`);
        
        // Map old values to new values
        await db.query(`UPDATE ${table} SET status = 'active' WHERE status IN ('aktif', 'active')`);
        await db.query(`UPDATE ${table} SET status = 'nonactive' WHERE status IN ('nonaktif', 'nonactive', 'inactive')`);
        
        // Change back to ENUM
        await db.query(`ALTER TABLE ${table} MODIFY COLUMN status ENUM('active', 'nonactive') DEFAULT 'active'`);
      } else {
        // If status doesn't exist, add it
        await db.query(`ALTER TABLE ${table} ADD COLUMN status ENUM('active', 'nonactive') DEFAULT 'active'`);
      }
    }

    // 2. Fix `unit_usaha` - make `jenis_usaha` optional or add default
    console.log('Fixing unit_usaha columns...');
    const [unitCols] = await db.query('DESCRIBE unit_usaha');
    const jenisUsahaCol = unitCols.find(c => c.Field === 'jenis_usaha');
    if (jenisUsahaCol && jenisUsahaCol.Null === 'NO' && jenisUsahaCol.Default === null) {
      await db.query("ALTER TABLE unit_usaha MODIFY COLUMN jenis_usaha VARCHAR(50) DEFAULT 'Lainnya'");
    }

    // 3. Fix `detail_transaksi` - ensure consistency
    console.log('Ensuring detail_transaksi table and columns...');
    const [tables] = await db.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);

    if (tableNames.includes('transaksi_detail') && !tableNames.includes('detail_transaksi')) {
      await db.query('RENAME TABLE transaksi_detail TO detail_transaksi');
    }

    if (tableNames.includes('detail_transaksi')) {
      const [detailCols] = await db.query('DESCRIBE detail_transaksi');
      const detailColNames = detailCols.map(c => c.Field);
      if (detailColNames.includes('jumlah') && !detailColNames.includes('qty')) {
        await db.query('ALTER TABLE detail_transaksi CHANGE COLUMN jumlah qty INT NOT NULL');
      }
    }

    // 4. Check for `users` role enum again
    console.log('Ensuring users role enum...');
    await db.query(`
      ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'pengurus', 'operator', 'auditor') DEFAULT 'operator'
    `);

    console.log('✅ Comprehensive CRUD fix completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
    process.exit(1);
  }
}

fixAllCrud();
