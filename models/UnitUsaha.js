const db = require('../config/database');

const UnitUsaha = {
  // Ambil semua unit usaha
  async findAll() {
    const [rows] = await db.query('SELECT * FROM unit_usaha ORDER BY id ASC');
    return rows;
  },

  // Cari berdasarkan ID
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM unit_usaha WHERE id = ?', [id]);
    return rows[0];
  },

  // Buat unit usaha baru
  async create(data) {
    const { nama_unit, deskripsi } = data;
    const [result] = await db.query(
      'INSERT INTO unit_usaha (nama_unit, deskripsi) VALUES (?, ?)',
      [nama_unit, deskripsi]
    );
    return result;
  },

  // Update unit usaha
  async update(id, data) {
    const { nama_unit, deskripsi } = data;
    const [result] = await db.query(
      'UPDATE unit_usaha SET nama_unit = ?, deskripsi = ? WHERE id = ?',
      [nama_unit, deskripsi, id]
    );
    return result;
  },

  // Hapus unit usaha
  async delete(id) {
    const [result] = await db.query('DELETE FROM unit_usaha WHERE id = ?', [id]);
    return result;
  },

  // Hitung jumlah unit usaha
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM unit_usaha');
    return rows[0].total;
  }
};

module.exports = UnitUsaha;
