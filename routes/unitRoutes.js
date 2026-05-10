const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Semua route unit usaha memerlukan login + role admin/operator
router.use(isLoggedIn, authorize('admin', 'operator'));

// GET /unit-usaha
router.get('/', unitController.index);

// GET /unit-usaha/tambah
router.get('/tambah', unitController.createForm);

// POST /unit-usaha
router.post('/', unitController.create);

// GET /unit-usaha/edit/:id
router.get('/edit/:id', unitController.editForm);

// POST /unit-usaha/edit/:id
router.post('/edit/:id', unitController.update);

// POST /unit-usaha/delete/:id
router.post('/delete/:id', unitController.delete);

module.exports = router;
