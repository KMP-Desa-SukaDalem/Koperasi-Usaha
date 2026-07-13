const db = require('../config/database');

const UnitUsaha = {
  // Ambil semua unit usaha
  async findAll(status = 'active') {
    const [rows] = await db.query('SELECT * FROM unit_usaha WHERE status = ? ORDER BY id ASC', [status]);
    return rows;
  },

  // Cari berdasarkan ID
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM unit_usaha WHERE id = ?', [id]);
    return rows[0];
  },

  // Buat unit usaha baru
  async create(data) {
    const { nama_unit, deskripsi, penanggung_jawab, bidang_usaha, alamat, pic, no_hp_pic } = data;
    const [result] = await db.query(
      'INSERT INTO unit_usaha (nama_unit, deskripsi, penanggung_jawab, bidang_usaha, alamat, pic, no_hp_pic) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama_unit, deskripsi, penanggung_jawab, bidang_usaha, alamat, pic, no_hp_pic]
    );
    return result;
  },

  // Update unit usaha
  async update(id, data) {
    const { nama_unit, deskripsi, penanggung_jawab, bidang_usaha, alamat, pic, no_hp_pic } = data;
    const [result] = await db.query(
      'UPDATE unit_usaha SET nama_unit = ?, deskripsi = ?, penanggung_jawab = ?, bidang_usaha = ?, alamat = ?, pic = ?, no_hp_pic = ? WHERE id = ?',
      [nama_unit, deskripsi, penanggung_jawab, bidang_usaha, alamat, pic, no_hp_pic, id]
    );
    return result;
  },

  // Hapus unit usaha
  async delete(id) {
    const [result] = await db.query('UPDATE unit_usaha SET status = ? WHERE id = ?', ['nonactive', id]);
    return result;
  },

  // Hitung jumlah unit usaha
  async count(status = 'active') {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM unit_usaha WHERE status = ?', [status]);
    return rows[0].total;
  }
};

module.exports = UnitUsaha;
