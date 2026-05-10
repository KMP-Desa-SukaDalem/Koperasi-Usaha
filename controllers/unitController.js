const UnitUsaha = require('../models/UnitUsaha');

const unitController = {
  // GET /unit-usaha - Daftar unit usaha
  async index(req, res) {
    const units = await UnitUsaha.findAll();
    res.render('unit/index', {
      title: 'Manajemen Unit Usaha',
      currentPage: 'unit-usaha',
      units
    });
  },

  // GET /unit-usaha/tambah - Form tambah
  createForm(req, res) {
    res.render('unit/create', {
      title: 'Tambah Unit Usaha',
      currentPage: 'unit-usaha'
    });
  },

  // POST /unit-usaha - Proses tambah
  async create(req, res) {
    const { nama_unit, deskripsi } = req.body;

    if (!nama_unit) {
      req.flash('error', 'Nama unit usaha harus diisi.');
      return res.redirect('/unit-usaha/tambah');
    }

    await UnitUsaha.create({ nama_unit, deskripsi });
    req.flash('success', 'Unit usaha berhasil ditambahkan.');
    res.redirect('/unit-usaha');
  },

  // GET /unit-usaha/edit/:id - Form edit
  async editForm(req, res) {
    const unit = await UnitUsaha.findById(req.params.id);
    if (!unit) {
      req.flash('error', 'Unit usaha tidak ditemukan.');
      return res.redirect('/unit-usaha');
    }
    res.render('unit/edit', {
      title: 'Edit Unit Usaha',
      currentPage: 'unit-usaha',
      unit
    });
  },

  // POST /unit-usaha/edit/:id - Proses edit
  async update(req, res) {
    const { nama_unit, deskripsi } = req.body;

    if (!nama_unit) {
      req.flash('error', 'Nama unit usaha harus diisi.');
      return res.redirect(`/unit-usaha/edit/${req.params.id}`);
    }

    await UnitUsaha.update(req.params.id, { nama_unit, deskripsi });
    req.flash('success', 'Unit usaha berhasil diperbarui.');
    res.redirect('/unit-usaha');
  },

  // POST /unit-usaha/delete/:id - Proses hapus
  async delete(req, res) {
    await UnitUsaha.delete(req.params.id);
    req.flash('success', 'Unit usaha berhasil dihapus.');
    res.redirect('/unit-usaha');
  }
};

module.exports = unitController;
