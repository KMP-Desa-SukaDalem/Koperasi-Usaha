const Supplier = require('../models/Supplier');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const supplierController = {
  // GET /supplier
  async index(req, res) {
    try {
      const search = req.query.search || '';
      const supplierList = await Supplier.findAll(search);
      res.render('supplier/index', {
        title: 'Data Supplier',
        currentPage: 'supplier',
        supplier: supplierList,
        user: req.session.user,
        search
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal memuat data supplier.');
      res.redirect('/dashboard');
    }
  },

  // GET /supplier/detail/:id
  async show(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        req.flash('error', 'Data supplier tidak ditemukan.');
        return res.redirect('/supplier');
      }
      res.render('supplier/detail', {
        title: 'Detail Supplier',
        currentPage: 'supplier',
        supplier,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan sistem.');
      res.redirect('/supplier');
    }
  },

  // GET /supplier/tambah
  createForm(req, res) {
    res.render('supplier/create', {
      title: 'Tambah Supplier',
      currentPage: 'supplier'
    });
  },

  // POST /supplier
  async create(req, res) {
    try {
      const { nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon } = req.body;
      
      // Validation
      if (!nama_penanggung_jawab || !nama_toko || !alamat || !nomor_telepon) {
        req.flash('error', 'Semua field dengan tanda * wajib diisi.');
        return res.redirect('/supplier/tambah');
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error', 'Format email tidak valid.');
        return res.redirect('/supplier/tambah');
      }

      await Supplier.create({ nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon });
      req.flash('success', 'Data supplier berhasil ditambahkan.');
      res.redirect('/supplier');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat menyimpan data supplier.');
      res.redirect('/supplier/tambah');
    }
  },

  // GET /supplier/edit/:id
  async editForm(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        req.flash('error', 'Data supplier tidak ditemukan.');
        return res.redirect('/supplier');
      }
      res.render('supplier/edit', {
        title: 'Edit Supplier',
        currentPage: 'supplier',
        editSupplier: supplier
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan sistem.');
      res.redirect('/supplier');
    }
  },

  // POST /supplier/edit/:id
  async update(req, res) {
    try {
      const { nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon } = req.body;
      
      if (!nama_penanggung_jawab || !nama_toko || !alamat || !nomor_telepon) {
        req.flash('error', 'Semua field dengan tanda * wajib diisi.');
        return res.redirect('/supplier/edit/' + req.params.id);
      }

      await Supplier.update(req.params.id, { nama_penanggung_jawab, nama_toko, email, alamat, nomor_telepon });
      req.flash('success', 'Data supplier berhasil diperbarui.');
      res.redirect('/supplier');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat memperbarui data supplier.');
      res.redirect('/supplier/edit/' + req.params.id);
    }
  },

  // POST /supplier/delete/:id
  async delete(req, res) {
    try {
      await Supplier.delete(req.params.id);
      req.flash('success', 'Data supplier berhasil dihapus.');
      res.redirect('/supplier');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menghapus data supplier.');
      res.redirect('/supplier');
    }
  },

  // GET /supplier/export-excel
  async exportExcel(req, res) {
    try {
      const suppliers = await Supplier.findAll();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Supplier');

      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Nama Toko', key: 'nama_toko', width: 30 },
        { header: 'Penanggung Jawab', key: 'nama_penanggung_jawab', width: 25 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Nomor Telepon', key: 'nomor_telepon', width: 20 },
        { header: 'Alamat', key: 'alamat', width: 40 }
      ];

      suppliers.forEach((s, index) => {
        worksheet.addRow({
          no: index + 1,
          nama_toko: s.nama_toko,
          nama_penanggung_jawab: s.nama_penanggung_jawab,
          email: s.email || '-',
          nomor_telepon: s.nomor_telepon,
          alamat: s.alamat
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Data_Supplier.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal mengekspor data ke Excel.');
      res.redirect('/supplier');
    }
  },

  // GET /supplier/export-pdf
  async exportPdf(req, res) {
    try {
      const suppliers = await Supplier.findAll();
      const doc = new PDFDocument({ margin: 30, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Data_Supplier.pdf');

      doc.pipe(res);

      doc.fontSize(18).text('DATA SUPPLIER KOPERASI DESA SUKADALEM', { align: 'center' });
      doc.moveDown();

      suppliers.forEach((s, index) => {
        doc.fontSize(12).text(`${index + 1}. ${s.nama_toko}`);
        doc.fontSize(10).text(`   Penanggung Jawab: ${s.nama_penanggung_jawab}`);
        doc.text(`   Telepon: ${s.nomor_telepon}`);
        doc.text(`   Email: ${s.email || '-'}`);
        doc.text(`   Alamat: ${s.alamat}`);
        doc.moveDown(0.5);
      });

      doc.end();
    } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal mengekspor data ke PDF.');
      res.redirect('/supplier');
    }
  }
};

module.exports = supplierController;
