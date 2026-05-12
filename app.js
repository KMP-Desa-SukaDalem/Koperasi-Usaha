const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

// Penting untuk Vercel agar session/cookie bekerja di balik proxy
app.set('trust proxy', 1);

// ============================================================
// Security Middleware
// ============================================================
// 1. Helmet untuk secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Nonaktifkan jika EJS inline script bermasalah, atau sesuaikan
}));

// 2. Cookie Parser (diperlukan untuk csurf)
app.use(cookieParser());

// ============================================================
// View Engine: EJS
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// Middleware
// ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Hardening
app.use(session({
  name: 'session_koperasi', // Nama cookie custom
  secret: process.env.SESSION_SECRET || 'koperasi_sukadalem_secret_random_99',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 hari
    httpOnly: true, // Mencegah akses via JS (XSS)
    secure: process.env.NODE_ENV === 'production', // Set ke true jika menggunakan HTTPS
    sameSite: 'lax'
  }
}));

// Flash Messages (Harus setelah session, sebelum CSRF agar error CSRF bisa pakai flash)
app.use(flash());

// 4. CSRF Protection (setelah session dan flash)
const csrfProtection = csrf();
// Terapkan CSRF secara global, kecuali API jika ada
app.use(csrfProtection);

// Global Variables untuk Views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.csrfToken = req.csrfToken(); // Berikan token ke semua views
  next();
});

// ============================================================
// Routes
// ============================================================

// Root redirect
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

// Mount route modules
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/unit-usaha', require('./routes/unitRoutes'));
app.use('/barang', require('./routes/barangRoutes'));
app.use('/transaksi', require('./routes/transaksiRoutes'));
app.use('/laporan', require('./routes/laporanRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/anggota', require('./routes/anggotaRoutes'));
app.use('/supplier', require('./routes/supplierRoutes'));

// ============================================================
// 404 Handler
// ============================================================
app.use((req, res) => {
  res.status(404).render('errors/404', { 
    title: 'Halaman Tidak Ditemukan',
    csrfToken: typeof req.csrfToken === 'function' ? req.csrfToken() : ''
  });
});

// ============================================================
// Error Handler (Express 5 - Native Promise Support)
// ============================================================
// Handler khusus CSRF Error
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Sesi form kadaluarsa atau tidak valid. Silakan coba lagi.');
    return res.redirect(req.get('Referer') || '/login');
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).render('errors/500', {
    title: 'Terjadi Kesalahan',
    error: process.env.NODE_ENV === 'development' ? err : {},
    csrfToken: typeof req.csrfToken === 'function' ? req.csrfToken() : ''
  });
});

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server Koperasi Desa berjalan di http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
