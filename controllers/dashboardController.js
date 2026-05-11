const UnitUsaha = require('../models/UnitUsaha');
const Barang = require('../models/Barang');
const Transaksi = require('../models/Transaksi');

const dashboardController = {
  // GET /dashboard
  async index(req, res) {
    try {
      const totalPendapatan = await Transaksi.totalPendapatanBulanIni();
      const totalUnit = await UnitUsaha.count();
      const totalBarang = await Barang.count();
      const transaksiHariIni = await Transaksi.countToday();
      const recentTransaksi = await Transaksi.recent(5);
      const lowStockItems = await Barang.lowStock(10);

      res.render('dashboard/index', {
        title: 'Dashboard',
        currentPage: 'dashboard',
        totalPendapatan,
        totalUnit,
        totalBarang,
        transaksiHariIni,
        recentTransaksi,
        lowStockItems
      });
    } catch (error) {
      console.error(error);
      // Jika dashboard gagal total, lempar ke halaman login atau tunjukkan pesan error minimal
      res.render('dashboard/index', {
        title: 'Dashboard',
        currentPage: 'dashboard',
        totalPendapatan: 0,
        totalUnit: 0,
        totalBarang: 0,
        transaksiHariIni: 0,
        recentTransaksi: [],
        lowStockItems: [],
        error: 'Beberapa data gagal dimuat.'
      });
    }
  }
};

module.exports = dashboardController;
