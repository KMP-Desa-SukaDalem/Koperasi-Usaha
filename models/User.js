const db = require('../config/database');

const User = {
  // Cari user berdasarkan username (untuk login)
  async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },

  // Cari user berdasarkan Email
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Cari user berdasarkan ID
  async findById(id) {
    const [rows] = await db.query('SELECT id, username, nama_lengkap, email, role, status, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Ambil semua user (dengan fitur pencarian)
  async findAll(search = '', status = 'active') {
    if (search) {
      const [rows] = await db.query(
        'SELECT id, username, nama_lengkap, email, role, status, created_at, updated_at FROM users WHERE (username LIKE ? OR nama_lengkap LIKE ? OR email LIKE ?) AND status = ? ORDER BY id ASC',
        [`%${search}%`, `%${search}%`, `%${search}%`, status]
      );
      return rows;
    }
    const [rows] = await db.query(
      'SELECT id, username, nama_lengkap, email, role, status, created_at, updated_at FROM users WHERE status = ? ORDER BY id ASC',
      [status]
    );
    return rows;
  },

  // Buat user baru
  async create(data) {
    const { username, password, nama_lengkap, email, role } = data;
    const [result] = await db.query(
      'INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
      [username, password, nama_lengkap, email, role]
    );
    return result;
  },

  // Update user
  async update(id, data) {
    const { username, nama_lengkap, email, role } = data;
    const [result] = await db.query(
      'UPDATE users SET username = ?, nama_lengkap = ?, email = ?, role = ? WHERE id = ?',
      [username, nama_lengkap, email, role, id]
    );
    return result;
  },

  // Update password
  async updatePassword(id, password) {
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    return result;
  },

  // Hapus user
  async delete(id) {
    const [result] = await db.query('UPDATE users SET status = ? WHERE id = ?', ['nonactive', id]);
    return result;
  },

  // Hitung jumlah user
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  }
};

module.exports = User;
