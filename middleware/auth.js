const db = require('../config/database');

/**
 * Middleware: Authentication Check
 * Memastikan user sudah login dan akunnya masih aktif
 */
const isLoggedIn = async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      // Ambil data terbaru dari database agar tetap sinkron
      const [rows] = await db.query('SELECT id, username, nama_lengkap, role, status FROM users WHERE id = ?', [req.session.user.id]);
      
      if (rows.length > 0 && rows[0].status === 'active') {
        // Update session dengan data terbaru
        req.session.user = {
          id: rows[0].id,
          username: rows[0].username,
          nama_lengkap: rows[0].nama_lengkap,
          role: rows[0].role
        };
        // Sinkronkan juga ke local variable views untuk request ini
        res.locals.user = req.session.user;
        return next();
      } else {
        // Jika akun dinonaktifkan atau dihapus (nonactive)
        delete req.session.user; // Hanya hapus data user dari session, jangan hancurkan session agar flash/csrf tidak error
        req.flash('error', 'Akun Anda telah dinonaktifkan atau dihapus.');
        return res.redirect('/login');
      }
    } catch (err) {
      console.error('AUTH_DB_CHECK_ERROR:', err);
      // Jika terjadi error database, biarkan sesi tetap berjalan agar aplikasi tidak crash
      return next();
    }
  }
  
  req.flash('error', 'Silakan login terlebih dahulu.');
  return res.redirect('/login');
};

module.exports = { isLoggedIn };
