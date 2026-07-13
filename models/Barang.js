const db = require('../config/database');

const Barang = {
  // Ambil semua barang (JOIN dengan unit_usaha)
  async findAll(status = 'active') {
    const [rows] = await db.query(`
      SELECT b.*, u.nama_unit 
      FROM barang b
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      WHERE b.status = ?
      ORDER BY b.id ASC
    `, [status]);
    return rows;
  },

  // Ambil barang berdasarkan unit usaha
  async findByUnit(unitId) {
    const [rows] = await db.query(`
      SELECT b.*, u.nama_unit 
      FROM barang b
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      WHERE b.unit_usaha_id = ?
      ORDER BY b.nama_barang ASC
    `, [unitId]);
    return rows;
  },

  // Cari berdasarkan ID
  async findById(id) {
    const [rows] = await db.query(`
      SELECT b.*, u.nama_unit 
      FROM barang b
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      WHERE b.id = ?
    `, [id]);
    return rows[0];
  },

  // Buat barang baru
  async create(data) {
    const { unit_usaha_id, nama_barang, harga_beli, harga_jual, stok, ukuran, satuan } = data;
    const [result] = await db.query(
      'INSERT INTO barang (unit_usaha_id, nama_barang, harga_beli, harga_jual, stok, ukuran, satuan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [unit_usaha_id, nama_barang, harga_beli, harga_jual, stok, ukuran, satuan]
    );
    return result;
  },

  // Update barang
  async update(id, data) {
    const { unit_usaha_id, nama_barang, harga_beli, harga_jual, stok, ukuran, satuan } = data;
    const [result] = await db.query(
      'UPDATE barang SET unit_usaha_id = ?, nama_barang = ?, harga_beli = ?, harga_jual = ?, stok = ?, ukuran = ?, satuan = ? WHERE id = ?',
      [unit_usaha_id, nama_barang, harga_beli, harga_jual, stok, ukuran, satuan, id]
    );
    return result;
  },

  // Kurangi stok (untuk transaksi)
  async reduceStock(id, qty) {
    const [result] = await db.query(
      'UPDATE barang SET stok = stok - ? WHERE id = ? AND stok >= ?',
      [qty, id, qty]
    );
    return result;
  },

  // Hapus barang
  async delete(id) {
    const [result] = await db.query('UPDATE barang SET status = ? WHERE id = ?', ['nonactive', id]);
    return result;
  },

  // Hitung jumlah barang
  async count(status = 'active') {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM barang WHERE status = ?', [status]);
    return rows[0].total;
  },

  // Barang dengan stok rendah (< 10)
  async lowStock(limit = 10) {
    const [rows] = await db.query(`
      SELECT b.*, u.nama_unit 
      FROM barang b
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      WHERE b.stok < ?
      ORDER BY b.stok ASC
    `, [limit]);
    return rows;
  }
};

module.exports = Barang;
