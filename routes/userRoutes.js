const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Manajemen pengguna: admin dan pengurus
router.use(isLoggedIn, authorize('admin', 'pengurus'));

// GET /users
router.get('/', userController.index);

// GET /users/riwayat
router.get('/riwayat', userController.riwayatAktivitas);

// GET /users/tambah
router.get('/tambah', userController.createForm);

// POST /users
router.post('/', userController.create);

// GET /users/edit/:id
router.get('/edit/:id', userController.editForm);

// POST /users/edit/:id
router.post('/edit/:id', userController.update);

// POST /users/delete/:id
router.post('/delete/:id', userController.delete);

module.exports = router;
