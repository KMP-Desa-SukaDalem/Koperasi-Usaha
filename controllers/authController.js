const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
  // GET /login - Halaman login
  loginPage(req, res) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    res.render('auth/login', { title: 'Login' });
  },

  // POST /login - Proses login
  async loginProcess(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'Username dan password harus diisi.');
      return res.redirect('/login');
    }

    const user = await User.findByUsername(username);

    if (!user) {
      req.flash('error', 'Username atau password salah.');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash('error', 'Username atau password salah.');
      return res.redirect('/login');
    }

    // Simpan data user di session (tanpa password)
    req.session.user = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      role: user.role
    };

    req.flash('success', `Selamat datang, ${user.nama_lengkap} di sistem pengelolan koperasi desa sukadalem!`);
    //   if (user.role === 'auditor') {
    //     return res.redirect('/laporan');
    //   }
    //   return res.redirect('/dashboard');
    // },
    if (user.role) {
      return res.redirect('/dashboard');
    }
  },

  // GET /logout - Proses logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error('Error destroying session:', err);
      res.redirect('/login');
    });
  }
};

module.exports = authController;
