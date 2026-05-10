const db = require('../config/database');

const Anggota = {
  async findAll(search = '', status = 'active') {
    if (search) {
      const [rows] = await db.query(
        'SELECT * FROM anggota WHERE (nik LIKE ? OR nama_lengkap LIKE ?) AND status = ? ORDER BY id DESC',
        [`%${search}%`, `%${search}%`, status]
      );
      return rows;
    }
    const [rows] = await db.query('SELECT * FROM anggota WHERE status = ? ORDER BY id DESC', [status]);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM anggota WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const { nik, nama_lengkap, email, nomor_telepon } = data;
    const [result] = await db.query(
      'INSERT INTO anggota (nik, nama_lengkap, email, nomor_telepon) VALUES (?, ?, ?, ?)',
      [nik, nama_lengkap, email, nomor_telepon]
    );
    return result;
  },

  async update(id, data) {
    const { nik, nama_lengkap, email, nomor_telepon } = data;
    const [result] = await db.query(
      'UPDATE anggota SET nik = ?, nama_lengkap = ?, email = ?, nomor_telepon = ? WHERE id = ?',
      [nik, nama_lengkap, email, nomor_telepon, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM anggota WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Anggota;
