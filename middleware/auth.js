const db = require('../config/database');

/**
 * Middleware: Authentication Check
 * Memastikan user sudah login dan akunnya masih aktif
 */
const isLoggedIn = async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      // Periksa status terbaru di database
      const [rows] = await db.query('SELECT status FROM users WHERE id = ?', [req.session.user.id]);
      
      if (rows.length > 0 && rows[0].status === 'active') {
        return next();
      } else {
        // Jika akun dinonaktifkan atau dihapus (nonactive)
        req.session.destroy((err) => {
          if (err) console.error('SESSION_DESTROY_ERROR:', err);
        });
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
