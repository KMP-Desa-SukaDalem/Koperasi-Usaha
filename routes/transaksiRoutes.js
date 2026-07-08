const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Semua route transaksi memerlukan login
router.use(isLoggedIn);

// Halaman POS & Pemrosesan Transaksi: KHUSUS Admin dan Pengurus
router.get('/', authorize('admin', 'pengurus'), transaksiController.index);
router.post('/', authorize('admin', 'pengurus'), transaksiController.create);

// Riwayat & Detail Transaksi: Dapat diakses oleh Admin, Pengurus & Auditor (untuk Audit)
router.get('/riwayat', authorize('admin', 'pengurus', 'auditor'), transaksiController.riwayat);
router.get('/riwayat/download', authorize('admin', 'pengurus', 'auditor'), transaksiController.downloadRiwayat);
router.get('/detail/:id', authorize('admin', 'pengurus', 'auditor'), transaksiController.detail);
router.get('/struk/:id', authorize('admin', 'pengurus', 'auditor'), transaksiController.cetakStruk);

module.exports = router;
