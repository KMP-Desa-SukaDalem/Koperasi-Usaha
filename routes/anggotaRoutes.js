const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Route Index (READ): Dibuka untuk Admin dan Operator
router.get('/', isLoggedIn, authorize('admin', 'operator'), anggotaController.index);

// Route Export & Riwayat: Dibuka untuk Admin dan Operator
router.get('/export/excel', isLoggedIn, authorize('admin', 'operator'), anggotaController.exportExcel);
router.get('/export/pdf', isLoggedIn, authorize('admin', 'operator'), anggotaController.exportPDF);
router.get('/riwayat', isLoggedIn, authorize('admin', 'operator'), anggotaController.riwayatAktivitas);

// Route Form & CRUD (WRITE): DIBATASI KHUSUS Admin dan Operator saja
router.use(isLoggedIn, authorize('admin', 'operator'));

router.get('/tambah', anggotaController.createForm);
router.post('/', anggotaController.create);
router.get('/detail/:id', anggotaController.show);
router.get('/edit/:id', anggotaController.editForm);
router.post('/edit/:id', anggotaController.update);
router.post('/delete/:id', anggotaController.delete);

// Route Arsip & Restore (DIBATASI KHUSUS Admin dan Pengurus)
router.get('/arsip', anggotaController.arsipIndex);
router.post('/restore/:id', anggotaController.restoreData);

module.exports = router;
