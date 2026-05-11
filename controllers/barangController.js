const Barang = require('../models/Barang');
const UnitUsaha = require('../models/UnitUsaha');

const barangController = {
  // GET /barang - Daftar barang
  async index(req, res) {
    try {
      const barang = await Barang.findAll();
      const units = await UnitUsaha.findAll();
      res.render('barang/index', {
        title: 'Manajemen Barang',
        currentPage: 'barang',
        barang,
        units,
        filterUnit: req.query.unit || ''
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat data barang.');
      res.redirect('/dashboard');
    }
  },

  // GET /barang/tambah - Form tambah
  async createForm(req, res) {
    try {
      const units = await UnitUsaha.findAll();
      res.render('barang/create', {
        title: 'Tambah Barang',
        currentPage: 'barang',
        units
      });
    } catch (error) {
      console.error(error);
      res.redirect('/barang');
    }
  },

  // POST /barang - Proses tambah
  async create(req, res) {
    try {
      const { unit_usaha_id, nama_barang, harga_beli, harga_jual, stok } = req.body;

      if (!nama_barang || !unit_usaha_id) {
        req.flash('error', 'Nama barang dan unit usaha harus diisi.');
        return res.redirect('/barang/tambah');
      }

      await Barang.create({
        unit_usaha_id,
        nama_barang,
        harga_beli: harga_beli || 0,
        harga_jual: harga_jual || 0,
        stok: stok || 0
      });

      req.flash('success', 'Barang berhasil ditambahkan.');
      res.redirect('/barang');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menambahkan barang. Pastikan data valid.');
      res.redirect('/barang/tambah');
    }
  },

  // GET /barang/edit/:id - Form edit
  async editForm(req, res) {
    try {
      const item = await Barang.findById(req.params.id);
      const units = await UnitUsaha.findAll();

      if (!item) {
        req.flash('error', 'Barang tidak ditemukan.');
        return res.redirect('/barang');
      }

      res.render('barang/edit', {
        title: 'Edit Barang',
        currentPage: 'barang',
        item,
        units
      });
    } catch (error) {
      console.error(error);
      res.redirect('/barang');
    }
  },

  // POST /barang/edit/:id - Proses edit
  async update(req, res) {
    try {
      const { unit_usaha_id, nama_barang, harga_beli, harga_jual, stok } = req.body;

      if (!nama_barang || !unit_usaha_id) {
        req.flash('error', 'Nama barang dan unit usaha harus diisi.');
        return res.redirect(`/barang/edit/${req.params.id}`);
      }

      await Barang.update(req.params.id, {
        unit_usaha_id,
        nama_barang,
        harga_beli: harga_beli || 0,
        harga_jual: harga_jual || 0,
        stok: stok || 0
      });

      req.flash('success', 'Barang berhasil diperbarui.');
      res.redirect('/barang');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memperbarui barang.');
      res.redirect(`/barang/edit/${req.params.id}`);
    }
  },

  // POST /barang/delete/:id - Proses hapus
  async delete(req, res) {
    try {
      await Barang.delete(req.params.id);
      req.flash('success', 'Barang berhasil dinonaktifkan (diarsipkan).');
      res.redirect('/barang');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menonaktifkan barang.');
      res.redirect('/barang');
    }
  },

  // API: GET /barang/api/by-unit/:unitId (untuk POS)
  async getByUnit(req, res) {
    const barang = await Barang.findByUnit(req.params.unitId);
    res.json(barang);
  }
};

module.exports = barangController;
