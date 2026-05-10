const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Semua route transaksi memerlukan login + role admin/operator
router.use(isLoggedIn, authorize('admin', 'operator'));

// GET /transaksi - Halaman POS
router.get('/', transaksiController.index);

// POST /transaksi - Proses transaksi (JSON API)
router.post('/', transaksiController.create);

// GET /transaksi/riwayat - Riwayat transaksi
router.get('/riwayat', transaksiController.riwayat);

// GET /transaksi/riwayat/download - Download CSV Riwayat transaksi
router.get('/riwayat/download', transaksiController.downloadRiwayat);

// GET /transaksi/detail/:id - Detail transaksi
router.get('/detail/:id', transaksiController.detail);

// GET /transaksi/struk/:id - Cetak struk transaksi
router.get('/struk/:id', transaksiController.cetakStruk);

module.exports = router;
