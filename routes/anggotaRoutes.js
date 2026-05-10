const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Route Index (READ): Dibuka untuk semua 4 Role
router.get('/', isLoggedIn, authorize('admin', 'pengurus', 'operator', 'auditor'), anggotaController.index);

// Route Export & Riwayat: Dibuka untuk Admin, Pengurus, Auditor
router.get('/export/excel', isLoggedIn, authorize('admin', 'pengurus', 'auditor'), anggotaController.exportExcel);
router.get('/export/pdf', isLoggedIn, authorize('admin', 'pengurus', 'auditor'), anggotaController.exportPDF);
router.get('/riwayat', isLoggedIn, authorize('admin', 'pengurus', 'auditor'), anggotaController.riwayatAktivitas);

// Route Form & CRUD (WRITE): DIBATASI KHUSUS Admin dan Pengurus saja
router.use(isLoggedIn, authorize('admin', 'pengurus'));

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
