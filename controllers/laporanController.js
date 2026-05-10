const Transaksi = require('../models/Transaksi');
const UnitUsaha = require('../models/UnitUsaha');

const laporanController = {
  // GET /laporan - Halaman laporan
  async index(req, res) {
    const filters = {
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || '',
      unitId: req.query.unitId || ''
    };

    const units = await UnitUsaha.findAll();
    const laporanUnit = await Transaksi.laporanPerUnit(filters);
    const laporanBarang = await Transaksi.laporanPerBarang(filters);
    const allTransaksi = await Transaksi.findAll(filters);

    // Hitung total keseluruhan
    const totalPendapatan = laporanUnit.reduce((sum, u) => sum + parseFloat(u.total_pendapatan), 0);
    const totalTransaksi = allTransaksi.length;

    res.render('laporan/index', {
      title: 'Laporan Penjualan',
      currentPage: 'laporan',
      units,
      laporanUnit,
      laporanBarang,
      totalPendapatan,
      totalTransaksi,
      filters
    });
  }
};

module.exports = laporanController;
