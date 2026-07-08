const Transaksi = require('../models/Transaksi');
const Barang = require('../models/Barang');
const UnitUsaha = require('../models/UnitUsaha');
const Log = require('../models/Log');

const transaksiController = {
  // GET /transaksi - Halaman POS Kasir
  async index(req, res) {
    try {
      const units = await UnitUsaha.findAll();
      const barang = await Barang.findAll();
      res.render('transaksi/index', {
        title: 'Transaksi Penjualan',
        currentPage: 'transaksi',
        units,
        barang
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat halaman transaksi.');
      res.redirect('/dashboard');
    }
  },

  // POST /transaksi - Proses transaksi
  async create(req, res) {
    try {
      const { items, metode_pembayaran, nominal_bayar } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Tidak ada barang dalam transaksi.' });
      }

      // Validasi dan ambil data harga dari DB
      const validatedItems = [];
      for (const item of items) {
        const barang = await Barang.findById(item.barang_id);
        if (!barang) {
          return res.status(400).json({ success: false, message: `Barang ID ${item.barang_id} tidak ditemukan.` });
        }
        if (barang.stok < item.qty) {
          return res.status(400).json({ success: false, message: `Stok ${barang.nama_barang} tidak mencukupi. Tersedia: ${barang.stok}` });
        }
        validatedItems.push({
          barang_id: item.barang_id,
          qty: parseInt(item.qty),
          harga_jual: parseFloat(barang.harga_jual)
        });
      }

      // Hitung total harga transaksi
      let totalHargaTrans = 0;
      validatedItems.forEach(item => {
        totalHargaTrans += item.harga_jual * item.qty;
      });

      let kembalian = 0;
      if (metode_pembayaran === 'Cash') {
        const nominal = parseFloat(nominal_bayar) || 0;
        if (nominal < totalHargaTrans) {
          return res.status(400).json({ success: false, message: 'Nominal bayar tidak mencukupi.' });
        }
        kembalian = nominal - totalHargaTrans;
      }

      const result = await Transaksi.create(req.session.user.id, validatedItems, {
        metode_pembayaran,
        nominal_bayar: metode_pembayaran === 'Cash' ? parseFloat(nominal_bayar) : totalHargaTrans,
        kembalian
      });

      // Log Activity: Create Transaction
      await Log.record(req.session.user.id, 'CREATE', 'TRANSAKSI', result.transaksiId, `Membuat transaksi kasir baru #${result.transaksiId} senilai Rp ${Number(result.totalHarga).toLocaleString('id-ID')} (${metode_pembayaran}).`);

      res.json({
        success: true,
        message: 'Transaksi berhasil!',
        transaksiId: result.transaksiId,
        totalHarga: result.totalHarga
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal memproses transaksi. Terjadi kesalahan pada server.' });
    }
  },

  // GET /transaksi/riwayat - Riwayat transaksi
  async riwayat(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate || '',
        endDate: req.query.endDate || ''
      };
      const transaksi = await Transaksi.findAll(filters);
      res.render('transaksi/riwayat', {
        title: 'Riwayat Transaksi',
        currentPage: 'transaksi',
        transaksi,
        filters
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat riwayat transaksi.');
      res.redirect('/dashboard');
    }
  },

  // GET /transaksi/detail/:id - Detail transaksi
  async detail(req, res) {
    try {
      const transaksi = await Transaksi.findById(req.params.id);
      if (!transaksi) {
        req.flash('error', 'Transaksi tidak ditemukan.');
        return res.redirect('/transaksi/riwayat');
      }
      res.render('transaksi/detail', {
        title: `Detail Transaksi #${transaksi.id}`,
        currentPage: 'transaksi',
        transaksi
      });
    } catch (error) {
      console.error(error);
      res.redirect('/transaksi/riwayat');
    }
  },

  // GET /transaksi/struk/:id - Cetak struk transaksi
  async cetakStruk(req, res) {
    const transaksi = await Transaksi.findById(req.params.id);
    if (!transaksi) {
      req.flash('error', 'Transaksi tidak ditemukan.');
      return res.redirect('/transaksi/riwayat');
    }
    res.render('transaksi/struk', {
      title: `Struk Transaksi #${transaksi.id}`,
      layout: false, // jangan gunakan layout bawaan untuk struk print
      transaksi
    });
  },

  // GET /transaksi/riwayat/download - Download CSV Riwayat Transaksi
  async downloadRiwayat(req, res) {
    const filters = {
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || ''
    };
    const transaksi = await Transaksi.findAll(filters);

    // \uFEFF adalah BOM (Byte Order Mark) agar terbaca sebagai UTF-8 di Excel
    let csv = '\uFEFFID Transaksi,Kasir,Tanggal,Total Harga\n';
    
    transaksi.forEach(t => {
      // Format tanggal: DD/MM/YYYY HH:mm
      const dateObj = new Date(t.tanggal_transaksi);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      const kasir = `"${t.kasir.replace(/"/g, '""')}"`;
      
      csv += `${t.id},${kasir},${formattedDate},${t.total_harga}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('riwayat_transaksi.csv');
    return res.send(csv);
  }
};

module.exports = transaksiController;
