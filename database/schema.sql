-- ============================================================
-- Sistem Manajemen Koperasi Desa Sukadalem
-- DDL (Data Definition Language) + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS koperasi_desa_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE koperasi_desa_db;

-- ============================================================
-- 1. Tabel Users (Multi-Role RBAC)
-- Role: admin, pengurus, operator, auditor
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin', 'pengurus', 'operator', 'auditor') NOT NULL DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. Tabel Unit Usaha
-- ============================================================
CREATE TABLE IF NOT EXISTS unit_usaha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_unit VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. Tabel Barang
-- ============================================================
CREATE TABLE IF NOT EXISTS barang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_usaha_id INT NOT NULL,
    nama_barang VARCHAR(100) NOT NULL,
    harga_beli DECIMAL(12,2) NOT NULL DEFAULT 0,
    harga_jual DECIMAL(12,2) NOT NULL DEFAULT 0,
    stok INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_usaha_id) REFERENCES unit_usaha(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. Tabel Transaksi (Header)
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_harga DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- 5. Tabel Detail Transaksi (Line Items)
-- ============================================================
CREATE TABLE IF NOT EXISTS detail_transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksi_id INT NOT NULL,
    barang_id INT NOT NULL,
    qty INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

-- User Awal
-- Password untuk semua user: admin123
-- Bcrypt hash dari 'admin123' (10 rounds)
INSERT INTO users (username, password, nama_lengkap, role) VALUES
('admin', '$2b$10$GLGHNKV8G6sDvLt5aomS4uYV5mZhNtFMHCG39fzDSVLx.gmQ.zYwy', 'Administrator Koperasi', 'admin'),
('pengurus', '$2b$10$GLGHNKV8G6sDvLt5aomS4uYV5mZhNtFMHCG39fzDSVLx.gmQ.zYwy', 'Pengurus Koperasi Sukadalem', 'pengurus'),
('operator', '$2b$10$GLGHNKV8G6sDvLt5aomS4uYV5mZhNtFMHCG39fzDSVLx.gmQ.zYwy', 'Operator Kasir', 'operator'),
('auditor', '$2b$10$GLGHNKV8G6sDvLt5aomS4uYV5mZhNtFMHCG39fzDSVLx.gmQ.zYwy', 'Auditor Koperasi', 'auditor');

-- Unit Usaha Contoh
INSERT INTO unit_usaha (nama_unit, deskripsi) VALUES
('Toko Tani Lestari', 'Unit usaha penjualan kebutuhan pertanian dan pupuk'),
('Minimarket Warga', 'Unit usaha penjualan kebutuhan sehari-hari warga desa'),
('Kedai Kopi Desa', 'Unit usaha warung kopi dan minuman'),
('Bengkel Bersama', 'Unit usaha bengkel dan perbengkelan desa');

-- Barang Contoh
INSERT INTO barang (unit_usaha_id, nama_barang, harga_beli, harga_jual, stok) VALUES
(1, 'Pupuk Urea 50kg', 150000, 175000, 50),
(1, 'Bibit Padi Ciherang', 80000, 95000, 100),
(1, 'Pestisida Organik 1L', 45000, 58000, 75),
(2, 'Beras Premium 5kg', 65000, 75000, 200),
(2, 'Minyak Goreng 1L', 18000, 22000, 150),
(2, 'Gula Pasir 1kg', 14000, 17000, 120),
(2, 'Kopi Bubuk 250g', 12000, 16000, 90),
(3, 'Kopi Robusta 250g', 25000, 35000, 80),
(3, 'Gula Aren 500g', 20000, 28000, 60),
(3, 'Teh Celup (isi 25)', 8000, 12000, 100),
(4, 'Oli Motor 1L', 35000, 45000, 40),
(4, 'Ban Dalam Motor', 30000, 42000, 25),
(4, 'Busi Motor', 15000, 22000, 60);
