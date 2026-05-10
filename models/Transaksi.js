const db = require('../config/database');

const Transaksi = {
  // Buat transaksi baru (header + detail, dalam transaction)
  async create(userId, items, paymentInfo = {}) {
    const { metode_pembayaran = 'Cash', nominal_bayar = 0, kembalian = 0 } = paymentInfo;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Hitung total
      let totalHarga = 0;
      for (const item of items) {
        totalHarga += item.harga_jual * item.qty;
      }

      // Insert header transaksi
      const [headerResult] = await conn.query(
        'INSERT INTO transaksi (user_id, total_harga, metode_pembayaran, nominal_bayar, kembalian) VALUES (?, ?, ?, ?, ?)',
        [userId, totalHarga, metode_pembayaran, nominal_bayar, kembalian]
      );
      const transaksiId = headerResult.insertId;

      // Insert detail transaksi & kurangi stok
      for (const item of items) {
        const subtotal = item.harga_jual * item.qty;

        await conn.query(
          'INSERT INTO detail_transaksi (transaksi_id, barang_id, qty, subtotal) VALUES (?, ?, ?, ?)',
          [transaksiId, item.barang_id, item.qty, subtotal]
        );

        // Kurangi stok
        const [stockResult] = await conn.query(
          'UPDATE barang SET stok = stok - ? WHERE id = ? AND stok >= ?',
          [item.qty, item.barang_id, item.qty]
        );

        if (stockResult.affectedRows === 0) {
          throw new Error(`Stok barang ID ${item.barang_id} tidak mencukupi`);
        }
      }

      await conn.commit();
      return { transaksiId, totalHarga };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Ambil semua transaksi (dengan nama kasir)
  async findAll(filters = {}) {
    let query = `
      SELECT t.*, u.nama_lengkap as kasir
      FROM transaksi t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.startDate) {
      query += ' AND DATE(t.tanggal_transaksi) >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND DATE(t.tanggal_transaksi) <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY t.tanggal_transaksi DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Cari transaksi berdasarkan ID (dengan detail)
  async findById(id) {
    const [header] = await db.query(`
      SELECT t.*, u.nama_lengkap as kasir
      FROM transaksi t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (!header[0]) return null;

    const [details] = await db.query(`
      SELECT dt.*, b.nama_barang, b.harga_jual, u.nama_unit
      FROM detail_transaksi dt
      JOIN barang b ON dt.barang_id = b.id
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      WHERE dt.transaksi_id = ?
    `, [id]);

    return { ...header[0], details };
  },

  // Total pendapatan bulan ini
  async totalPendapatanBulanIni() {
    const [rows] = await db.query(`
      SELECT COALESCE(SUM(total_harga), 0) as total
      FROM transaksi
      WHERE MONTH(tanggal_transaksi) = MONTH(CURRENT_DATE())
      AND YEAR(tanggal_transaksi) = YEAR(CURRENT_DATE())
    `);
    return rows[0].total;
  },

  // Total transaksi hari ini
  async countToday() {
    const [rows] = await db.query(`
      SELECT COUNT(*) as total FROM transaksi
      WHERE DATE(tanggal_transaksi) = CURDATE()
    `);
    return rows[0].total;
  },

  // Transaksi terbaru (untuk dashboard)
  async recent(limit = 5) {
    const [rows] = await db.query(`
      SELECT t.*, u.nama_lengkap as kasir
      FROM transaksi t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.tanggal_transaksi DESC
      LIMIT ?
    `, [limit]);
    return rows;
  },

  // Laporan: pendapatan per unit usaha
  async laporanPerUnit(filters = {}) {
    let query = `
      SELECT u.id, u.nama_unit,
        COUNT(DISTINCT t.id) as jumlah_transaksi,
        COALESCE(SUM(dt.subtotal), 0) as total_pendapatan
      FROM unit_usaha u
      LEFT JOIN barang b ON b.unit_usaha_id = u.id
      LEFT JOIN detail_transaksi dt ON dt.barang_id = b.id
      LEFT JOIN transaksi t ON t.id = dt.transaksi_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.startDate) {
      query += ' AND (DATE(t.tanggal_transaksi) >= ? OR t.tanggal_transaksi IS NULL)';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND (DATE(t.tanggal_transaksi) <= ? OR t.tanggal_transaksi IS NULL)';
      params.push(filters.endDate);
    }

    query += ' GROUP BY u.id, u.nama_unit ORDER BY total_pendapatan DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Laporan: detail per barang
  async laporanPerBarang(filters = {}) {
    let query = `
      SELECT b.nama_barang, u.nama_unit,
        COALESCE(SUM(dt.qty), 0) as total_terjual,
        COALESCE(SUM(dt.subtotal), 0) as total_pendapatan
      FROM barang b
      JOIN unit_usaha u ON b.unit_usaha_id = u.id
      LEFT JOIN detail_transaksi dt ON dt.barang_id = b.id
      LEFT JOIN transaksi t ON t.id = dt.transaksi_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.startDate) {
      query += ' AND (DATE(t.tanggal_transaksi) >= ? OR t.tanggal_transaksi IS NULL)';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND (DATE(t.tanggal_transaksi) <= ? OR t.tanggal_transaksi IS NULL)';
      params.push(filters.endDate);
    }
    if (filters.unitId) {
      query += ' AND b.unit_usaha_id = ?';
      params.push(filters.unitId);
    }

    query += ' GROUP BY b.id, b.nama_barang, u.nama_unit ORDER BY total_terjual DESC';
    const [rows] = await db.query(query, params);
    return rows;
  }
};

module.exports = Transaksi;
