/**
 * Middleware: Authentication Check
 * Memastikan user sudah login sebelum mengakses halaman terproteksi
 */
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Silakan login terlebih dahulu.');
  return res.redirect('/login');
};

module.exports = { isLoggedIn };
