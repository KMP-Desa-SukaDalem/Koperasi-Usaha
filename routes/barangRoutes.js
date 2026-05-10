const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Semua route barang memerlukan login + role admin/operator
router.use(isLoggedIn, authorize('admin', 'operator'));

// GET /barang
router.get('/', barangController.index);

// GET /barang/tambah
router.get('/tambah', barangController.createForm);

// POST /barang
router.post('/', barangController.create);

// GET /barang/edit/:id
router.get('/edit/:id', barangController.editForm);

// POST /barang/edit/:id
router.post('/edit/:id', barangController.update);

// POST /barang/delete/:id
router.post('/delete/:id', barangController.delete);

// API: Barang berdasarkan unit (untuk POS)
router.get('/api/by-unit/:unitId', barangController.getByUnit);

module.exports = router;
