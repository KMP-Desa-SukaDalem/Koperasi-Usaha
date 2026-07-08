const UnitUsaha = require('../models/UnitUsaha');
const Log = require('../models/Log');

const unitController = {
  // GET /unit-usaha - Daftar unit usaha
  async index(req, res) {
    try {
      const units = await UnitUsaha.findAll();
      res.render('unit/index', {
        title: 'Manajemen Unit Usaha',
        currentPage: 'unit-usaha',
        units
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat data unit usaha.');
      res.redirect('/dashboard');
    }
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
    try {
      const { nama_unit, deskripsi } = req.body;

      if (!nama_unit) {
        req.flash('error', 'Nama unit usaha harus diisi.');
        return res.redirect('/unit-usaha/tambah');
      }

      const result = await UnitUsaha.create({ nama_unit, deskripsi });

      // Log Activity: Create Unit Usaha
      await Log.record(req.session.user.id, 'CREATE', 'UNIT_USAHA', result.insertId, `Menambah unit usaha baru: ${nama_unit}.`);

      req.flash('success', 'Unit usaha berhasil ditambahkan.');
      res.redirect('/unit-usaha');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menambahkan unit usaha.');
      res.redirect('/unit-usaha/tambah');
    }
  },

  // GET /unit-usaha/edit/:id - Form edit
  async editForm(req, res) {
    try {
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
    } catch (error) {
      console.error(error);
      res.redirect('/unit-usaha');
    }
  },

  // POST /unit-usaha/edit/:id - Proses edit
  async update(req, res) {
    try {
      const { nama_unit, deskripsi } = req.body;

      if (!nama_unit) {
        req.flash('error', 'Nama unit usaha harus diisi.');
        return res.redirect(`/unit-usaha/edit/${req.params.id}`);
      }

      await UnitUsaha.update(req.params.id, { nama_unit, deskripsi });

      // Log Activity: Update Unit Usaha
      await Log.record(req.session.user.id, 'UPDATE', 'UNIT_USAHA', req.params.id, `Memperbarui data unit usaha: ${nama_unit}.`);

      req.flash('success', 'Unit usaha berhasil diperbarui.');
      res.redirect('/unit-usaha');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memperbarui unit usaha.');
      res.redirect(`/unit-usaha/edit/${req.params.id}`);
    }
  },

  // POST /unit-usaha/delete/:id - Proses hapus
  async delete(req, res) {
    try {
      const unit = await UnitUsaha.findById(req.params.id);
      const nama_unit = unit ? unit.nama_unit : 'Unknown';

      await UnitUsaha.delete(req.params.id);

      // Log Activity: Delete Unit Usaha
      await Log.record(req.session.user.id, 'DELETE', 'UNIT_USAHA', req.params.id, `Menonaktifkan (arsip) unit usaha: ${nama_unit}.`);

      req.flash('success', 'Unit usaha berhasil dinonaktifkan (diarsipkan).');
      res.redirect('/unit-usaha');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menonaktifkan unit usaha.');
      res.redirect('/unit-usaha');
    }
  }
};

module.exports = unitController;
