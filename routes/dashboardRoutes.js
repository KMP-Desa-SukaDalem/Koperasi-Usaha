const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/auth');
const { authorize } = require('../middleware/authRole');

// GET /dashboard (Hanya Admin, Pengurus, dan Operator)
router.get('/', isLoggedIn, authorize('admin', 'pengurus', 'operator', 'auditor'), dashboardController.index);

module.exports = router;
