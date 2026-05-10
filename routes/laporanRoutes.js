const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// Laporan: admin, pengurus, auditor
router.use(isLoggedIn, authorize('admin', 'pengurus', 'auditor'));

// GET /laporan
router.get('/', laporanController.index);

module.exports = router;
