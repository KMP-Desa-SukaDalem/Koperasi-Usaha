const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan
  message: 'Terlalu banyak percobaan login, silakan coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
