const db = require('../config/database');

const Supplier = {
  async findAll(search = '') {
    if (search) {
      const [rows] = await db.query(
        'SELECT * FROM supplier WHERE nama_toko LIKE ? OR nama_penanggung_jawab LIKE ? OR email LIKE ? OR nomor_telepon LIKE ? ORDER BY id DESC',
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );
      return rows;
    }
    const [rows] = await db.query('SELECT * FROM supplier ORDER BY id DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM supplier WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const { nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon } = data;
    const [result] = await db.query(
      'INSERT INTO supplier (nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon) VALUES (?, ?, ?, ?, ?)',
      [nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon]
    );
    return result;
  },

  async update(id, data) {
    const { nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon } = data;
    const [result] = await db.query(
      'UPDATE supplier SET nama_penanggung_jawab = ?, nama_toko = ?, email = ?, alamat = ?, nomor_telepon = ? WHERE id = ?',
      [nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM supplier WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Supplier;
