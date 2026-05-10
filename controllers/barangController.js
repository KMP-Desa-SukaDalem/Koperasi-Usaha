const Barang = require('../models/Barang');
const UnitUsaha = require('../models/UnitUsaha');

const barangController = {
  // GET /barang - Daftar barang
  async index(req, res) {
    const barang = await Barang.findAll();
    const units = await UnitUsaha.findAll();
    res.render('barang/index', {
      title: 'Manajemen Barang',
      currentPage: 'barang',
      barang,
      units,
      filterUnit: req.query.unit || ''
    });
  },

  // GET /barang/tambah - Form tambah
  async createForm(req, res) {
    const units = await UnitUsaha.findAll();
    res.render('barang/create', {
      title: 'Tambah Barang',
      currentPage: 'barang',
      units
    });
  },

  // POST /barang - Proses tambah
  async create(req, res) {
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
  },

  // GET /barang/edit/:id - Form edit
  async editForm(req, res) {
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
  },

  // POST /barang/edit/:id - Proses edit
  async update(req, res) {
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
  },

  // POST /barang/delete/:id - Proses hapus
  async delete(req, res) {
    await Barang.delete(req.params.id);
    req.flash('success', 'Barang berhasil dihapus.');
    res.redirect('/barang');
  },

  // API: GET /barang/api/by-unit/:unitId (untuk POS)
  async getByUnit(req, res) {
    const barang = await Barang.findByUnit(req.params.unitId);
    res.json(barang);
  }
};

module.exports = barangController;
