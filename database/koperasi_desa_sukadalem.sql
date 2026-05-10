-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 02, 2026 at 01:22 AM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `koperasi_desa_sukadalem`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `harga` decimal(15,2) NOT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `satuan` varchar(20) DEFAULT 'pcs',
  `deskripsi` text,
  `unit_usaha_id` int NOT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id`, `nama_barang`, `harga`, `stok`, `satuan`, `deskripsi`, `unit_usaha_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Beras Premium 5kg', 60000.00, 47, 'karung', 'Beras kualitas premium kemasan 5kg', 1, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(2, 'Minyak Goreng 1L', 17000.00, 29, 'botol', 'Minyak goreng kemasan 1 liter', 1, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(3, 'Gula Pasir 1kg', 14000.00, 24, 'kg', 'Gula pasir putih kemasan 1kg', 1, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(4, 'Telur Ayam', 28000.00, 19, 'kg', 'Telur ayam kampung segar', 1, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(5, 'Susu UHT 1L', 20000.00, 39, 'kotak', 'Susu UHT full cream 1 liter', 1, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(6, 'Indomie Goreng', 3000.00, 95, 'bungkus', 'Mie instan rasa ayam goreng', 2, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(7, 'Aqua 600ml', 3000.00, 78, 'botol', 'Air mineral kemasan 600ml', 2, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(8, 'Kerupuk Udang', 10000.00, 25, 'bungkus', 'Kerupuk udang mentah siap goreng', 2, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(9, 'Biskuit Marie', 7000.00, 39, 'bungkus', 'Biskuit marie kemasan keluarga', 2, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(10, 'Sampo Sachet', 1500.00, 200, 'sachet', 'Sampo kemasan sachet 12ml', 2, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(11, 'Air Galon 19L', 5000.00, 94, 'galon', 'Air minum isi ulang galon 19 liter', 3, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(12, 'Galon Kosong', 35000.00, 20, 'unit', 'Galon air kosong baru', 3, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(13, 'Air Botol 1.5L', 3000.00, 60, 'botol', 'Air mineral kemasan botol 1.5L', 3, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(14, 'Pompa Galon Manual', 20000.00, 10, 'unit', 'Pompa galon manual', 3, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(15, 'Nasi Gudeg', 15000.00, 50, 'porsi', 'Nasi gudeg komplit dengan lauk', 4, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(16, 'Soto Ayam', 12000.00, 30, 'porsi', 'Soto ayam dengan nasi', 4, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(17, 'Es Teh Manis', 3000.00, 100, 'gelas', 'Es teh manis segar', 4, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(18, 'Pecel Lele', 10000.00, 39, 'porsi', 'Pecel lele dengan nasi dan lalapan', 4, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(19, 'Pupuk NPK 50kg', 200000.00, 19, 'karung', 'Pupuk NPK phonska kemasan 50kg', 5, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:30:03'),
(20, 'Cangkul', 55000.00, 10, 'unit', 'Cangkul pertanian gagang kayu', 5, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(21, 'Sabit', 30000.00, 15, 'unit', 'Sabit pemanen padi', 5, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50'),
(22, 'Bibit Padi IR64', 50000.00, 30, 'kg', 'Benih padi varietas IR64', 5, 'aktif', '2026-03-24 14:29:50', '2026-03-24 14:29:50');

-- --------------------------------------------------------

--
-- Stand-in structure for view `laporan_bulanan`
-- (See below for the actual view)
--
CREATE TABLE `laporan_bulanan` (
`tahun` int
,`bulan` int
,`total_transaksi` bigint
,`total_pendapatan` decimal(37,2)
,`nama_usaha` varchar(100)
,`unit_usaha_id` int
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `laporan_harian`
-- (See below for the actual view)
--
CREATE TABLE `laporan_harian` (
`tanggal` date
,`total_transaksi` bigint
,`total_pendapatan` decimal(37,2)
,`nama_usaha` varchar(100)
,`unit_usaha_id` int
);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int NOT NULL,
  `kode_transaksi` varchar(20) NOT NULL,
  `tanggal_transaksi` datetime NOT NULL,
  `nama_pembeli` varchar(100) DEFAULT NULL,
  `total_harga` decimal(15,2) NOT NULL DEFAULT '0.00',
  `user_id` int NOT NULL,
  `catatan` text,
  `status` enum('selesai','dibatalkan') DEFAULT 'selesai',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `kode_transaksi`, `tanggal_transaksi`, `nama_pembeli`, `total_harga`, `user_id`, `catatan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TRX-20260323-001', '2026-03-23 08:30:00', 'Bu Sari', 151000.00, 2, NULL, 'selesai', '2026-03-24 14:30:03', '2026-03-24 14:30:03'),
(2, 'TRX-20260323-002', '2026-03-23 10:15:00', 'Pak Budi', 255000.00, 2, NULL, 'selesai', '2026-03-24 14:30:03', '2026-03-24 14:30:03'),
(3, 'TRX-20260323-003', '2026-03-23 14:20:00', 'Ani', 28000.00, 3, NULL, 'selesai', '2026-03-24 14:30:03', '2026-03-24 14:30:03'),
(4, 'TRX-20260324-001', '2026-03-24 09:00:00', 'Bu Wati', 108000.00, 2, NULL, 'selesai', '2026-03-24 14:30:03', '2026-03-24 14:30:03'),
(5, 'TRX-20260324-002', '2026-03-24 11:30:00', 'Pak Heri', 30000.00, 3, NULL, 'selesai', '2026-03-24 14:30:03', '2026-03-24 14:30:03');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_detail`
--

CREATE TABLE `transaksi_detail` (
  `id` int NOT NULL,
  `transaksi_id` int NOT NULL,
  `barang_id` int NOT NULL,
  `jumlah` int NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `transaksi_detail`
--

INSERT INTO `transaksi_detail` (`id`, `transaksi_id`, `barang_id`, `jumlah`, `harga_satuan`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 2, 60000.00, 120000.00, '2026-03-24 14:30:03'),
(2, 1, 2, 1, 17000.00, 17000.00, '2026-03-24 14:30:03'),
(3, 1, 3, 1, 14000.00, 14000.00, '2026-03-24 14:30:03'),
(4, 2, 18, 1, 200000.00, 200000.00, '2026-03-24 14:30:03'),
(5, 2, 19, 1, 55000.00, 55000.00, '2026-03-24 14:30:03'),
(6, 3, 6, 5, 3000.00, 15000.00, '2026-03-24 14:30:03'),
(7, 3, 7, 2, 3000.00, 6000.00, '2026-03-24 14:30:03'),
(8, 3, 9, 1, 7000.00, 7000.00, '2026-03-24 14:30:03'),
(9, 4, 1, 1, 60000.00, 60000.00, '2026-03-24 14:30:03'),
(10, 4, 4, 1, 28000.00, 28000.00, '2026-03-24 14:30:03'),
(11, 4, 5, 1, 20000.00, 20000.00, '2026-03-24 14:30:03'),
(12, 5, 11, 6, 5000.00, 30000.00, '2026-03-24 14:30:03');

--
-- Triggers `transaksi_detail`
--
DELIMITER $$
CREATE TRIGGER `tr_update_stok_insert` AFTER INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE barang 
    SET stok = stok - NEW.jumlah 
    WHERE id = NEW.barang_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_update_subtotal_insert` BEFORE INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    SET NEW.subtotal = NEW.jumlah * NEW.harga_satuan;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_update_subtotal_update` BEFORE UPDATE ON `transaksi_detail` FOR EACH ROW BEGIN
    SET NEW.subtotal = NEW.jumlah * NEW.harga_satuan;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_update_total_transaksi_delete` AFTER DELETE ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM transaksi_detail 
        WHERE transaksi_id = OLD.transaksi_id
    )
    WHERE id = OLD.transaksi_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_update_total_transaksi_insert` AFTER INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT SUM(subtotal) 
        FROM transaksi_detail 
        WHERE transaksi_id = NEW.transaksi_id
    )
    WHERE id = NEW.transaksi_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_update_total_transaksi_update` AFTER UPDATE ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT SUM(subtotal) 
        FROM transaksi_detail 
        WHERE transaksi_id = NEW.transaksi_id
    )
    WHERE id = NEW.transaksi_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `unit_usaha`
--

CREATE TABLE `unit_usaha` (
  `id` int NOT NULL,
  `nama_usaha` varchar(100) NOT NULL,
  `jenis_usaha` varchar(50) NOT NULL,
  `deskripsi` text,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `unit_usaha`
--

INSERT INTO `unit_usaha` (`id`, `nama_usaha`, `jenis_usaha`, `deskripsi`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Warung Sembako', 'Retail', 'Usaha penjualan kebutuhan pokok sehari-hari seperti beras, minyak, gula, dll', 'aktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27'),
(2, 'Toko Kelontong', 'Retail', 'Penjualan barang-barang keperluan rumah tangga dan makanan ringan', 'aktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27'),
(3, 'Depot Air Minum', 'Jasa', 'Usaha penjualan air minum isi ulang untuk warga desa', 'aktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27'),
(4, 'Warung Makan', 'Kuliner', 'Usaha warung makan dengan menu makanan tradisional', 'aktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27'),
(5, 'Toko Alat Pertanian', 'Retail', 'Penjualan alat-alat pertanian dan pupuk untuk petani desa', 'aktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27'),
(6, 'Barbershop Sukadalem', 'Layanan', 'Layanan potong rambut dan perawatan pria', 'nonaktif', '2026-03-24 14:29:27', '2026-03-24 14:29:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `role` enum('admin','pengurus') DEFAULT 'pengurus',
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `nama_lengkap`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'bendahara', 'bendahara@sukadalem.id', '$2b$10$rOKvL.xXhJvN5XxW1Z5Z9OeR.8VpFP.HQpZmJKjhL7X8.5q7CcJ9O', 'Siti Aminah', 'pengurus', 'aktif', '2026-03-24 14:20:06', '2026-03-24 14:20:06'),
(2, 'sekretaris', 'sekretaris@sukadalem.id', '$2b$10$rOKvL.xXhJvN5XxW1Z5Z9OeR.8VpFP.HQpZmJKjhL7X8.5q7CcJ9O', 'Ahmad Yusuf', 'pengurus', 'aktif', '2026-03-24 14:20:06', '2026-03-24 14:20:06'),
(3, 'kasir1', 'kasir1@sukadalem.id', '$2b$10$rOKvL.xXhJvN5XxW1Z5Z9OeR.8VpFP.HQpZmJKjhL7X8.5q7CcJ9O', 'Rina Wati', 'pengurus', 'aktif', '2026-03-24 14:20:06', '2026-03-24 14:20:06'),
(4, 'kasir2', 'kasir2@sukadalem.id', '$2b$10$rOKvL.xXhJvN5XxW1Z5Z9OeR.8VpFP.HQpZmJKjhL7X8.5q7CcJ9O', 'Dedi Kurnia', 'pengurus', 'aktif', '2026-03-24 14:20:06', '2026-03-24 14:20:06');

-- --------------------------------------------------------

--
-- Structure for view `laporan_bulanan`
--
DROP TABLE IF EXISTS `laporan_bulanan`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `laporan_bulanan`  AS SELECT year(`t`.`tanggal_transaksi`) AS `tahun`, month(`t`.`tanggal_transaksi`) AS `bulan`, count(`t`.`id`) AS `total_transaksi`, sum(`t`.`total_harga`) AS `total_pendapatan`, `uu`.`nama_usaha` AS `nama_usaha`, `uu`.`id` AS `unit_usaha_id` FROM (((`transaksi` `t` join `transaksi_detail` `td` on((`t`.`id` = `td`.`transaksi_id`))) join `barang` `b` on((`td`.`barang_id` = `b`.`id`))) join `unit_usaha` `uu` on((`b`.`unit_usaha_id` = `uu`.`id`))) WHERE (`t`.`status` = 'selesai') GROUP BY year(`t`.`tanggal_transaksi`), month(`t`.`tanggal_transaksi`), `uu`.`id`, `uu`.`nama_usaha` ORDER BY `tahun` DESC, `bulan` DESC, `uu`.`nama_usaha` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `laporan_harian`
--
DROP TABLE IF EXISTS `laporan_harian`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `laporan_harian`  AS SELECT cast(`t`.`tanggal_transaksi` as date) AS `tanggal`, count(`t`.`id`) AS `total_transaksi`, sum(`t`.`total_harga`) AS `total_pendapatan`, `uu`.`nama_usaha` AS `nama_usaha`, `uu`.`id` AS `unit_usaha_id` FROM (((`transaksi` `t` join `transaksi_detail` `td` on((`t`.`id` = `td`.`transaksi_id`))) join `barang` `b` on((`td`.`barang_id` = `b`.`id`))) join `unit_usaha` `uu` on((`b`.`unit_usaha_id` = `uu`.`id`))) WHERE (`t`.`status` = 'selesai') GROUP BY cast(`t`.`tanggal_transaksi` as date), `uu`.`id`, `uu`.`nama_usaha` ORDER BY `tanggal` DESC, `uu`.`nama_usaha` ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nama_barang` (`nama_barang`),
  ADD KEY `idx_unit_usaha_id` (`unit_usaha_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_transaksi` (`kode_transaksi`),
  ADD KEY `idx_kode_transaksi` (`kode_transaksi`),
  ADD KEY `idx_tanggal_transaksi` (`tanggal_transaksi`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaksi_id` (`transaksi_id`),
  ADD KEY `idx_barang_id` (`barang_id`);

--
-- Indexes for table `unit_usaha`
--
ALTER TABLE `unit_usaha`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nama_usaha` (`nama_usaha`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unit_usaha`
--
ALTER TABLE `unit_usaha`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`unit_usaha_id`) REFERENCES `unit_usaha` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transaksi_detail`
--
ALTER TABLE `transaksi_detail`
  ADD CONSTRAINT `transaksi_detail_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksi_detail_ibfk_2` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
