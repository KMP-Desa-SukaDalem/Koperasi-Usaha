const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

// GET /login
router.get('/login', authController.loginPage);

// POST /login (dengan Rate Limiting)
router.post('/login', loginLimiter, authController.loginProcess);

// GET /logout
router.get('/logout', authController.logout);

module.exports = router;
