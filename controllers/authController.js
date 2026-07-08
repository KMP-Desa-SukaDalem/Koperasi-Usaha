const bcrypt = require('bcrypt');
const User = require('../models/User');
const Log = require('../models/Log');

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
    try {
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

      if (user.status !== 'active') {
        req.flash('error', 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.');
        return res.redirect('/login');
      }

      // Simpan data user di session (tanpa password)
      req.session.user = {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      };

      // Log Activity: Login
      await Log.record(user.id, 'LOGIN', 'AUTH', user.id, `User ${user.nama_lengkap} (Role: ${user.role}) berhasil masuk ke sistem.`);

      req.flash('success', `Selamat datang kembali, ${user.nama_lengkap}!`);
      return res.redirect('/dashboard');
    } catch (error) {
      console.error('LOGIN_ERROR:', error);
      req.flash('error', 'Terjadi kesalahan pada server saat login. Silakan coba lagi nanti.');
      return res.redirect('/login');
    }
  },

  // GET /quick-login - Akses Cepat Login Otomatis Dosen
  async quickLogin(req, res) {
    try {
      const { username } = req.query;
      if (!username) {
        req.flash('error', 'Username tidak valid.');
        return res.redirect('/login');
      }

      if (username !== 'dosen') {
        req.flash('error', 'Akses ditolak.');
        return res.redirect('/login');
      }

      const user = await User.findByUsername(username);
      if (!user) {
        req.flash('error', 'Akun dosen belum siap. Silakan refresh halaman.');
        return res.redirect('/login');
      }

      if (user.status !== 'active') {
        req.flash('error', 'Akun dosen dinonaktifkan.');
        return res.redirect('/login');
      }

      // --- BATASAN 3 PERANGKAT (DEVICE LIMITATION) ---
      const crypto = require('crypto');
      const db = require('../config/database');

      // Ambil token dari cookie, atau buat baru jika belum ada
      let deviceToken = req.cookies.dosen_device_token;

      if (!deviceToken) {
        deviceToken = crypto.randomBytes(32).toString('hex');
      }

      // Cek apakah token ini sudah terdaftar di database
      const [registered] = await db.query('SELECT * FROM dosen_devices WHERE device_token = ?', [deviceToken]);

      if (registered.length === 0) {
        // Jika belum terdaftar, cek jumlah perangkat yang sudah terdaftar
        const [countRows] = await db.query('SELECT COUNT(*) as total FROM dosen_devices');
        const totalRegistered = countRows[0].total;

        if (totalRegistered >= 3) {
          // Hapus perangkat tertua untuk memberi ruang bagi perangkat baru
          await db.query('DELETE FROM dosen_devices ORDER BY created_at ASC LIMIT 1');
          console.log('🗑️ Menghapus perangkat terlama karena batas maksimal 3 perangkat tercapai.');
        }

        // Daftarkan perangkat baru ini
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        await db.query('INSERT INTO dosen_devices (device_token, user_agent) VALUES (?, ?)', [deviceToken, userAgent]);
        console.log(`📱 Perangkat baru terdaftar untuk login QR Dosen`);
      }

      // Set cookie agar bertahan lama (1 tahun)
      res.cookie('dosen_device_token', deviceToken, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      // ------------------------------------------------

      // Simpan session
      req.session.user = {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      };

      // Log Activity: Quick Login
      await Log.record(user.id, 'LOGIN', 'AUTH', user.id, `Dosen Penguji (${user.nama_lengkap}) berhasil masuk ke sistem menggunakan Quick Login.`);

      req.flash('success', `Selamat datang Dosen Penguji, ${user.nama_lengkap}! (Perangkat Terverifikasi)`);
      return res.redirect('/dashboard');
    } catch (error) {
      console.error('QUICK_LOGIN_ERROR:', error);
      req.flash('error', 'Gagal memproses login cepat.');
      return res.redirect('/login');
    }
  },

  // GET /logout - Proses logout
  async logout(req, res) {
    if (req.session && req.session.user) {
      await Log.record(req.session.user.id, 'LOGOUT', 'AUTH', req.session.user.id, `User ${req.session.user.nama_lengkap} (Role: ${req.session.user.role}) keluar dari sistem.`);
    }
    req.session.destroy((err) => {
      if (err) console.error('Error destroying session:', err);
      res.redirect('/login');
    });
  }
};

module.exports = authController;
