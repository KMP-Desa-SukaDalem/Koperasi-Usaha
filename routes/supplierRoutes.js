const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Route Index (READ): Dibuka untuk semua 4 Role
router.get('/', isLoggedIn, authorize('admin', 'pengurus', 'operator', 'auditor'), supplierController.index);

// Route Form & CRUD (WRITE): DIBATASI KHUSUS Admin dan Pengurus saja
router.use(isLoggedIn, authorize('admin', 'pengurus'));

router.get('/tambah', supplierController.createForm);
router.post('/', supplierController.create);
router.get('/detail/:id', supplierController.show);
router.get('/export-excel', supplierController.exportExcel);
router.get('/export-pdf', supplierController.exportPdf);
router.get('/edit/:id', supplierController.editForm);
router.post('/edit/:id', supplierController.update);
router.post('/delete/:id', supplierController.delete);

module.exports = router;
