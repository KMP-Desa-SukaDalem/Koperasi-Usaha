const bcrypt = require('bcrypt');
const User = require('../models/User');
const Log = require('../models/Log');

const userController = {
  // GET /users - Daftar pengguna
  async index(req, res) {
    try {
      const search = (req.query.search || '').trim();
      const users = await User.findAll(search, null);
      res.render('user/index', {
        title: 'Manajemen Pengguna',
        currentPage: 'users',
        users,
        search,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat daftar pengguna.');
      res.redirect('/dashboard');
    }
  },
  
  // GET /users/riwayat
  async riwayatAktivitas(req, res) {
    try {
      const logs = await Log.findAll({}, 200);
      res.render('user/riwayat', {
        title: 'Riwayat Aktivitas Pengguna',
        currentPage: 'users',
        logs,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat riwayat aktivitas.');
      res.redirect('/users');
    }
  },

  // GET /users/riwayat/api - Endpoint JSON untuk AJAX Polling
  async riwayatAktivitasAPI(req, res) {
    try {
      const logs = await Log.findAll({}, 200);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal memuat riwayat aktivitas.' });
    }
  },

  // GET /users/tambah - Form tambah
  createForm(req, res) {
    res.render('user/create', {
      title: 'Tambah Pengguna',
      currentPage: 'users'
    });
  },

  // POST /users - Proses tambah
  async create(req, res) {
    try {
      const { username, password, nama_lengkap, email, role } = req.body;

      if (!username || !password || !nama_lengkap || !role) {
        req.flash('error', 'Semua field (kecuali email) wajib diisi.');
        return res.redirect('/users/tambah');
      }

      if (role === 'admin' && req.session.user.role !== 'admin') {
        req.flash('error', '403 Forbidden: Hanya Admin yang dapat membuat akun Admin baru.');
        return res.status(403).redirect('/users/tambah');
      }

      // Validasi format email jika diisi
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error', 'Format email tidak valid.');
        return res.redirect('/users/tambah');
      }

      // Cek username unik
      const existing = await User.findByUsername(username);
      if (existing) {
        req.flash('error', 'Username sudah digunakan.');
        return res.redirect('/users/tambah');
      }

      // Cek email unik jika diisi
      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
          req.flash('error', 'Email sudah digunakan.');
          return res.redirect('/users/tambah');
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create({ username, password: hashedPassword, nama_lengkap, email, role });

      // Log Activity: Create User
      await Log.record(req.session.user.id, 'CREATE', 'USER', result.insertId, `Menambah pengguna baru: ${nama_lengkap} (Role: ${role}).`);

      req.flash('success', 'Pengguna berhasil ditambahkan.');
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat menambahkan pengguna.');
      res.redirect('/users/tambah');
    }
  },

  // GET /users/edit/:id - Form edit
  async editForm(req, res) {
    const editUser = await User.findById(req.params.id);
    if (!editUser) {
      req.flash('error', 'Pengguna tidak ditemukan.');
      return res.redirect('/users');
    }

    if (req.session.user.role === 'pengurus' && editUser.role === 'admin') {
      req.flash('error', '403 Forbidden: Anda dilarang mengakses form edit akun Admin!');
      return res.status(403).redirect('/users');
    }
    res.render('user/edit', {
      title: 'Edit Pengguna',
      currentPage: 'users',
      editUser
    });
  },

  // POST /users/edit/:id - Proses edit
  async update(req, res) {
    try {
      const { username, nama_lengkap, email, role, password, status } = req.body;

      if (!username || !nama_lengkap || !role || !status) {
        req.flash('error', 'Username, nama, role, dan status harus diisi.');
        return res.redirect(`/users/edit/${req.params.id}`);
      }

      if (role === 'admin' && req.session.user.role !== 'admin') {
        req.flash('error', '403 Forbidden: Anda tidak dapat mengubah pengguna menjadi Admin.');
        return res.status(403).redirect(`/users/edit/${req.params.id}`);
      }

      const targetUser = await User.findById(req.params.id);
      if (targetUser && req.session.user.role === 'pengurus' && targetUser.role === 'admin') {
        req.flash('error', '403 Forbidden: Anda dilarang mengedit akun Admin!');
        return res.status(403).redirect('/users');
      }

      // Validasi format email jika diisi
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error', 'Format email tidak valid.');
        return res.redirect(`/users/edit/${req.params.id}`);
      }

      // Cek username unik (jika berubah)
      if (username !== targetUser.username) {
        const existing = await User.findByUsername(username);
        if (existing) {
          req.flash('error', 'Username sudah digunakan.');
          return res.redirect(`/users/edit/${req.params.id}`);
        }
      }

      // Cek email unik (jika berubah)
      if (email && email !== targetUser.email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
          req.flash('error', 'Email sudah digunakan.');
          return res.redirect(`/users/edit/${req.params.id}`);
        }
      }

      await User.update(req.params.id, { username, nama_lengkap, email, role, status });

      // Update password jika diisi
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updatePassword(req.params.id, hashedPassword);
      }

      // Log Activity: Update User
      await Log.record(req.session.user.id, 'UPDATE', 'USER', req.params.id, `Memperbarui data pengguna: ${nama_lengkap}.`);

      req.flash('success', 'Pengguna berhasil diperbarui.');
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat memperbarui pengguna.');
      res.redirect(`/users/edit/${req.params.id}`);
    }
  },

  // POST /users/delete/:id - Proses hapus
  async delete(req, res) {
    try {
      // Cegah hapus diri sendiri
      if (parseInt(req.params.id) === req.session.user.id) {
        req.flash('error', 'Tidak dapat menghapus akun Anda sendiri.');
        return res.redirect('/users');
      }

      const targetUser = await User.findById(req.params.id);
      if (targetUser && req.session.user.role === 'pengurus' && targetUser.role === 'admin') {
        req.flash('error', '403 Forbidden: Anda dilarang menghapus akun Admin!');
        return res.status(403).redirect('/users');
      }

      const nama_lengkap = targetUser ? targetUser.nama_lengkap : 'Unknown';
      await User.delete(req.params.id);

      req.flash('success', 'Akun pengguna berhasil dinonaktifkan.');
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menonaktifkan pengguna.');
      res.redirect('/users');
    }
  },

  // POST /users/toggle-status/:id - Toggle status aktif/nonaktif
  async toggleStatus(req, res) {
    try {
      // Cegah deaktifkan diri sendiri
      if (parseInt(req.params.id) === req.session.user.id) {
        req.flash('error', 'Tidak dapat menonaktifkan akun Anda sendiri.');
        return res.redirect('/users');
      }

      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        req.flash('error', 'Pengguna tidak ditemukan.');
        return res.redirect('/users');
      }

      const newStatus = targetUser.status === 'active' ? 'nonactive' : 'active';
      await User.updateStatus(req.params.id, newStatus);

      // Log Activity
      await Log.record(req.session.user.id, 'UPDATE', 'USER', req.params.id, `Mengubah status pengguna ${targetUser.nama_lengkap} menjadi ${newStatus}.`);

      req.flash('success', `Status akses ${targetUser.nama_lengkap} berhasil diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Nonaktif'}.`);
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal mengubah status pengguna.');
      res.redirect('/users');
    }
  }
};

module.exports = userController;
