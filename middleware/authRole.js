/**
 * Middleware: Role-Based Access Control (RBAC)
 * Membatasi akses berdasarkan role user
 * 
 * Penggunaan:
 *   router.get('/users', authorize('admin', 'pengurus'), controller.index);
 * 
 * Mapping Role:
 *   - admin    : Akses penuh ke seluruh sistem
 *   - pengurus : Monitoring, laporan, manajemen pengguna
 *   - operator : Input data master (unit/barang) dan transaksi kasir
 *   - auditor  : Melihat dan mengunduh laporan saja
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'Silakan login terlebih dahulu.');
      return res.redirect('/login');
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      req.flash('error', 'Anda tidak memiliki akses ke halaman ini.');
      if (userRole === 'auditor') {
        return res.redirect('/laporan');
      }
      return res.redirect('/dashboard');
    }

    return next();
  };
};

module.exports = { authorize };
