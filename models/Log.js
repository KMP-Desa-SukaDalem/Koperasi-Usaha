const db = require('../config/database');

const Log = {
  // Mencatat aktivitas baru
  async record(userId, action, targetType, targetId, description) {
    try {
      const [result] = await db.query(
        'INSERT INTO logs (user_id, action, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)',
        [userId, action, targetType, targetId, description]
      );
      return result;
    } catch (err) {
      console.error('FAILED_TO_RECORD_LOG:', err);
      // Jangan throw agar tidak menghentikan proses utama jika logging gagal
    }
  },

  // Mengambil log dengan filter optional
  async findAll(filters = {}, limit = 100) {
    let query = `
      SELECT l.*, u.nama_lengkap as actor_name, u.role as actor_role
      FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.targetType) {
      query += ' AND l.target_type = ?';
      params.push(filters.targetType);
    }

    query += ' ORDER BY l.created_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await db.query(query, params);
    return rows;
  }
};

module.exports = Log;
