const bcrypt = require('bcrypt');
const User = require('../models/User');
const Log = require('../models/Log');

const userController = {
  // GET /users - Daftar pengguna
  async index(req, res) {
    const search = (req.query.search || '').trim();
    const users = await User.findAll(search, 'active');
    res.render('user/index', {
      title: 'Manajemen Pengguna',
      currentPage: 'users',
      users,
      search,
      user: req.session.user
    });
  },
  
  // GET /users/riwayat
  async riwayatAktivitas(req, res) {
    try {
      const logs = await Log.findAll({ targetType: 'USER' }, 200);
      res.render('user/riwayat', {
        title: 'Riwayat Aktivitas Manajemen Pengguna',
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

  // GET /users/tambah - Form tambah
  createForm(req, res) {
    res.render('user/create', {
      title: 'Tambah Pengguna',
      currentPage: 'users'
    });
  },

  // POST /users - Proses tambah
  async create(req, res) {
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
    const { username, nama_lengkap, email, role, password } = req.body;

    if (!username || !nama_lengkap || !role) {
      req.flash('error', 'Username, nama, dan role harus diisi.');
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

    await User.update(req.params.id, { username, nama_lengkap, email, role });

    // Update password jika diisi
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updatePassword(req.params.id, hashedPassword);
    }

    // Log Activity: Update User
    await Log.record(req.session.user.id, 'UPDATE', 'USER', req.params.id, `Memperbarui data pengguna: ${nama_lengkap}.`);

    req.flash('success', 'Pengguna berhasil diperbarui.');
    res.redirect('/users');
  },

  // POST /users/delete/:id - Proses hapus
  async delete(req, res) {
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

    // Log Activity: Delete User
    await Log.record(req.session.user.id, 'DELETE', 'USER', req.params.id, `Menghapus pengguna: ${nama_lengkap}.`);

    req.flash('success', 'Pengguna berhasil dihapus.');
    res.redirect('/users');
  }
};

module.exports = userController;
