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
  async findAll(search = '', status = null) {
    let query = 'SELECT id, username, nama_lengkap, email, role, status, created_at, updated_at FROM users';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(username LIKE ? OR nama_lengkap LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const [rows] = await db.query(query, params);
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
    const { username, nama_lengkap, email, role, status } = data;
    const [result] = await db.query(
      'UPDATE users SET username = ?, nama_lengkap = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [username, nama_lengkap, email, role, status || 'active', id]
    );
    return result;
  },

  // Update password
  async updatePassword(id, password) {
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    return result;
  },

  // Update status (active/nonactive)
  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
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
