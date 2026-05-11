const Anggota = require('../models/Anggota');
const User = require('../models/User');
const Log = require('../models/Log');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { sendWelcomeEmail } = require('../config/mailer');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const anggotaController = {
  // GET /anggota
  async index(req, res) {
    try {
      const search = req.query.search || '';
      // Default findAll di model sudah 'active'
      const anggotaList = await Anggota.findAll(search, 'active');
      res.render('anggota/index', {
        title: 'Data Anggota',
        currentPage: 'anggota',
        anggota: anggotaList,
        user: req.session.user,
        search
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat data anggota.');
      res.redirect('/dashboard');
    }
  },

  // GET /anggota/arsip
  async arsipIndex(req, res) {
    try {
      const search = req.query.search || '';
      const anggotaList = await Anggota.findAll(search, 'nonactive');
      res.render('anggota/arsip', {
        title: 'Arsip Anggota (Nonaktif)',
        currentPage: 'anggota',
        anggota: anggotaList,
        user: req.session.user,
        search
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat data arsip anggota.');
      res.redirect('/anggota');
    }
  },

  // GET /anggota/detail/:id
  async show(req, res) {
    try {
      const anggota = await Anggota.findById(req.params.id);
      if (!anggota) {
        req.flash('error', 'Data anggota tidak ditemukan.');
        return res.redirect('/anggota');
      }
      res.render('anggota/detail', {
        title: 'Detail Anggota',
        currentPage: 'anggota',
        anggota,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan sistem.');
      res.redirect('/anggota');
    }
  },

  // GET /anggota/tambah
  createForm(req, res) {
    res.render('anggota/create', {
      title: 'Tambah Anggota',
      currentPage: 'anggota'
    });
  },

  // POST /anggota
  async create(req, res) {
    const { nik, nama_lengkap, email, nomor_telepon } = req.body;
    
    // 1. Validasi Input
    if (!nik || !nama_lengkap || !email || !nomor_telepon) {
      req.flash('error', 'NIK, Nama Lengkap, Email, dan Nomor Telepon wajib diisi.');
      return res.redirect('/anggota/tambah');
    }

    if (!/^\d+$/.test(nik)) {
      req.flash('error', 'NIK harus berupa angka.');
      return res.redirect('/anggota/tambah');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      req.flash('error', 'Format email tidak valid.');
      return res.redirect('/anggota/tambah');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 2. Cek apakah NIK sudah ada
      const [existingAnggota] = await conn.query('SELECT id, nama_lengkap, status FROM anggota WHERE nik = ?', [nik]);
      
      if (existingAnggota.length > 0) {
        if (existingAnggota[0].status === 'nonactive') {
          // AUTO-RESTORE LOGIC
          const oldNama = existingAnggota[0].nama_lengkap;
          await conn.query(
            'UPDATE anggota SET nama_lengkap = ?, email = ?, nomor_telepon = ?, status = \'active\' WHERE nik = ?',
            [nama_lengkap, email, nomor_telepon, nik]
          );
          await conn.query(
            'UPDATE users SET nama_lengkap = ?, email = ?, status = \'active\' WHERE nama_lengkap = ?',
            [nama_lengkap, email, oldNama]
          );
          await conn.commit();
          await Log.record(req.session.user.id, 'RESTORE', 'ANGGOTA', existingAnggota[0].id, `Memulihkan anggota ${nama_lengkap} (NIK: ${nik}) dari arsip.`);
          req.flash('success', 'Data anggota ditemukan di Arsip dan telah berhasil dipulihkan.');
          return res.redirect('/anggota');
        } else {
          throw new Error('NIK sudah terdaftar sebagai anggota aktif.');
        }
      }

      // 3. Cek apakah Email sudah ada di tabel anggota
      const [existingEmail] = await conn.query('SELECT id FROM anggota WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        throw new Error('Email sudah digunakan oleh anggota lain.');
      }

      // 4. Cek apakah NIK atau Email sudah ada di tabel users
      const [existingUser] = await conn.query('SELECT id FROM users WHERE username = ? OR email = ?', [nik, email]);
      if (existingUser.length > 0) {
        throw new Error('NIK atau Email sudah terdaftar pada akun pengguna sistem.');
      }

      // 4. Simpan ke tabel anggota
      const [newAnggota] = await conn.query(
        'INSERT INTO anggota (nik, nama_lengkap, email, nomor_telepon) VALUES (?, ?, ?, ?)',
        [nik, nama_lengkap, email, nomor_telepon]
      );

      // 5. Otomasi Buat User
      let baseUsername = nama_lengkap.split(' ')[0].toLowerCase().substring(0, 5);
      let generatedUsername = baseUsername;
      
      let counter = 1;
      while (true) {
        const [checkRows] = await conn.query('SELECT id FROM users WHERE username = ?', [generatedUsername]);
        if (checkRows.length === 0) break;
        
        let suffix = counter.toString();
        let prefixLimit = 5 - suffix.length;
        generatedUsername = baseUsername.substring(0, prefixLimit) + suffix;
        counter++;
        if (counter > 99) throw new Error('Gagal membuat username unik.');
      }
      
      const defaultPassword = 'Anggota123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await conn.query(
        'INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
        [generatedUsername, hashedPassword, nama_lengkap, email, 'pengurus']
      );

      await conn.commit();

      // Log Activity: Create
      await Log.record(req.session.user.id, 'CREATE', 'ANGGOTA', newAnggota.insertId, `Menambah anggota baru: ${nama_lengkap} (NIK: ${nik}).`);

      // 6. Kirim Email (Asynchronous)
      if (email) {
        sendWelcomeEmail(email, nama_lengkap, generatedUsername, defaultPassword);
      }

      req.flash('success', 'Data anggota dan akun pengguna berhasil dibuat.');
      res.redirect('/anggota');

    } catch (error) {
      if (conn) await conn.rollback();
      console.error("CREATE_ANGGOTA_ERROR:", error);
      req.flash('error', error.message || 'Terjadi kesalahan saat menyimpan data.');
      res.redirect('/anggota/tambah');
    } finally {
      if (conn) conn.release();
    }
  },

  // GET /anggota/edit/:id
  async editForm(req, res) {
    try {
      const anggota = await Anggota.findById(req.params.id);
      if (!anggota) {
        req.flash('error', 'Data anggota tidak ditemukan.');
        return res.redirect('/anggota');
      }
      res.render('anggota/edit', {
        title: 'Edit Anggota',
        currentPage: 'anggota',
        editAnggota: anggota
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan sistem.');
      res.redirect('/anggota');
    }
  },

  // POST /anggota/edit/:id
  async update(req, res) {
    try {
      const { nik, nama_lengkap, email, nomor_telepon } = req.body;
      const id = req.params.id;
      
      if (!nik || !nama_lengkap || !email || !nomor_telepon) {
        req.flash('error', 'NIK, Nama Lengkap, Email, dan Nomor Telepon wajib diisi.');
        return res.redirect('/anggota/edit/' + id);
      }

      if (!/^\d+$/.test(nik)) {
        req.flash('error', 'NIK harus berupa angka.');
        return res.redirect('/anggota/edit/' + id);
      }

      // Cek Duplikat NIK (selain data ini sendiri)
      const [dupNik] = await db.query('SELECT id FROM anggota WHERE nik = ? AND id != ?', [nik, id]);
      if (dupNik.length > 0) {
        req.flash('error', 'NIK sudah digunakan oleh anggota lain.');
        return res.redirect('/anggota/edit/' + id);
      }

      // Cek Duplikat Email (selain data ini sendiri)
      const [dupEmail] = await db.query('SELECT id FROM anggota WHERE email = ? AND id != ?', [email, id]);
      if (dupEmail.length > 0) {
        req.flash('error', 'Email sudah digunakan oleh anggota lain.');
        return res.redirect('/anggota/edit/' + id);
      }

      await Anggota.update(id, { nik, nama_lengkap, email, nomor_telepon });
      
      // Update data di tabel users juga jika ada (berdasarkan nama_lengkap lama jika berubah?)
      // Untuk sederhananya, kita update email di tabel users jika username-nya cocok dengan NIK lama atau baru
      await db.query('UPDATE users SET email = ?, nama_lengkap = ? WHERE username = ?', [email, nama_lengkap, nik]);
      
      await Log.record(req.session.user.id, 'UPDATE', 'ANGGOTA', id, `Memperbarui data anggota: ${nama_lengkap} (NIK: ${nik}).`);

      req.flash('success', 'Data anggota berhasil diperbarui.');
      res.redirect('/anggota');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat memperbarui data.');
      res.redirect('/anggota/edit/' + req.params.id);
    }
  },

  // POST /anggota/delete/:id (Soft Delete)
  async delete(req, res) {
    const id = req.params.id;
    
    // ID Validation
    if (!id || isNaN(id)) {
      req.flash('error', 'ID Anggota tidak valid.');
      return res.redirect('/anggota');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Ambil data anggota untuk mendapatkan nama_lengkap (link ke users)
      const [anggota] = await conn.query('SELECT nama_lengkap FROM anggota WHERE id = ?', [id]);
      if (anggota.length === 0) {
        throw new Error('Data anggota tidak ditemukan.');
      }
      const nama_lengkap = anggota[0].nama_lengkap;

      // 2. Soft Delete Anggota
      await conn.query('UPDATE anggota SET status = \'nonactive\' WHERE id = ?', [id]);

      // 3. Soft Delete User terkait
      await conn.query('UPDATE users SET status = \'nonactive\' WHERE nama_lengkap = ?', [nama_lengkap]);

      await conn.commit();

      // Log Activity: Delete (Soft)
      await Log.record(req.session.user.id, 'DELETE', 'ANGGOTA', id, `Menonaktifkan (arsip) anggota: ${nama_lengkap}.`);

      req.flash('success', 'Data anggota berhasil dinonaktifkan/arsip.');
      res.redirect('/anggota');
    } catch (error) {
      if (conn) await conn.rollback();
      console.error(error);
      req.flash('error', 'Gagal memproses penghapusan data anggota.');
      res.redirect('/anggota');
    } finally {
      if (conn) conn.release();
    }
  },

  // POST /anggota/restore/:id
  async restoreData(req, res) {
    const id = req.params.id;

    // ID Validation
    if (!id || isNaN(id)) {
      req.flash('error', 'ID Anggota tidak valid.');
      return res.redirect('/anggota/arsip');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Ambil data anggota
      const [anggota] = await conn.query('SELECT nama_lengkap FROM anggota WHERE id = ?', [id]);
      if (anggota.length === 0) {
        throw new Error('Data anggota tidak ditemukan.');
      }
      const nama_lengkap = anggota[0].nama_lengkap;

      // 2. Restore Anggota
      await conn.query('UPDATE anggota SET status = \'active\' WHERE id = ?', [id]);

      // 3. Restore User terkait
      await conn.query('UPDATE users SET status = \'active\' WHERE nama_lengkap = ?', [nama_lengkap]);

      await conn.commit();

      // Log Activity: Restore
      await Log.record(req.session.user.id, 'RESTORE', 'ANGGOTA', id, `Mengaktifkan kembali anggota: ${nama_lengkap}.`);

      req.flash('success', 'Data anggota berhasil diaktifkan kembali.');
      res.redirect('/anggota');
    } catch (error) {
      if (conn) await conn.rollback();
      console.error(error);
      req.flash('error', 'Gagal memulihkan data anggota.');
      res.redirect('/anggota/arsip');
    } finally {
      if (conn) conn.release();
    }
  },

  // GET /anggota/export/excel
  async exportExcel(req, res) {
    try {
      const anggotaList = await Anggota.findAll('', 'active');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Anggota');

      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'NIK', key: 'nik', width: 20 },
        { header: 'Nama Lengkap', key: 'nama_lengkap', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Nomor Telepon', key: 'nomor_telepon', width: 20 },
        { header: 'Tanggal Bergabung', key: 'created_at', width: 20 }
      ];

      anggotaList.forEach((a, i) => {
        worksheet.addRow({
          no: i + 1,
          nik: a.nik,
          nama_lengkap: a.nama_lengkap,
          email: a.email || '-',
          nomor_telepon: a.nomor_telepon,
          created_at: new Date(a.created_at).toLocaleDateString('id-ID')
        });
      });

      // Styling header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Data_Anggota_' + Date.now() + '.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal ekspor ke Excel.');
      res.redirect('/anggota');
    }
  },

  // GET /anggota/export/pdf
  async exportPDF(req, res) {
    try {
      const anggotaList = await Anggota.findAll('', 'active');
      const doc = new PDFDocument({ margin: 30, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Data_Anggota_' + Date.now() + '.pdf');

      doc.pipe(res);

      // Header
      doc.fontSize(18).text('DATA ANGGOTA KOPERASI DESA SUKADALEM', { align: 'center' });
      doc.fontSize(10).text('Dicetak pada: ' + new Date().toLocaleString('id-ID'), { align: 'center' });
      doc.moveDown(2);

      // Table Header
      const tableTop = 150;
      const colNik = 30;
      const colNama = 130;
      const colEmail = 280;
      const colTelp = 430;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('NIK', colNik, tableTop);
      doc.text('Nama Lengkap', colNama, tableTop);
      doc.text('Email', colEmail, tableTop);
      doc.text('Nomor Telepon', colTelp, tableTop);

      doc.moveTo(30, tableTop + 15).lineTo(565, tableTop + 15).stroke();

      // Table Rows
      let y = tableTop + 25;
      doc.font('Helvetica').fontSize(9);

      anggotaList.forEach(a => {
        // Auto page break if y > 750
        if (y > 750) {
          doc.addPage();
          y = 50;
        }
        doc.text(a.nik, colNik, y);
        doc.text(a.nama_lengkap, colNama, y, { width: 140 });
        doc.text(a.email || '-', colEmail, y, { width: 140 });
        doc.text(a.nomor_telepon, colTelp, y);
        y += 20;
      });

      doc.end();
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal ekspor ke PDF.');
      res.redirect('/anggota');
    }
  },

  // GET /anggota/riwayat
  async riwayatAktivitas(req, res) {
    try {
      const logs = await Log.findAll({ targetType: 'ANGGOTA' }, 200);
      res.render('anggota/riwayat', {
        title: 'Riwayat Aktivitas Data Anggota',
        currentPage: 'anggota',
        logs,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat riwayat aktivitas.');
      res.redirect('/anggota');
    }
  }
};

module.exports = anggotaController;
