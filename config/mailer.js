const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Kirim email ucapan selamat bergabung dan info login
 * @param {string} email - Alamat email penerima
 * @param {string} nama - Nama lengkap anggota
 * @param {string} username - NIK anggota
 * @param {string} password - Password default
 */
const sendWelcomeEmail = async (email, nama, username, password) => {
  if (!email) return;

  try {
    await transporter.sendMail({
      from: '"Koperasi Desa Sukadalem" <noreply@koperasidesa.com>',
      to: email,
      subject: 'Selamat Bergabung di Koperasi Desa Sukadalem',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #d32f2f; text-align: center;">Selamat Bergabung!</h2>
          <p>Halo <strong>${nama}</strong>,</p>
          <p>Selamat! Data Anda telah resmi terdaftar sebagai anggota di <strong>Koperasi Desa Sukadalem</strong>. Akun sistem Anda telah dibuat secara otomatis agar Anda dapat memantau aktivitas koperasi secara mandiri.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Detail Akun Login:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Username:</strong> ${username}</li>
              <li><strong>Password:</strong> ${password}</li>
            </ul>
          </div>

          <p>Silakan gunakan kredensial di atas untuk masuk ke aplikasi Koperasi. Kami sangat menyarankan Anda untuk <strong>segera mengubah password</strong> Anda setelah login pertama kali demi keamanan data.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8rem; color: #777; text-align: center;">Email ini dikirim secara otomatis oleh Sistem Manajemen Koperasi Desa Sukadalem. Mohon tidak membalas email ini.</p>
        </div>
      `,
    });
    console.log(`✅ Email berhasil dikirim ke: ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email ke ${email}:`, error.message);
    // Graceful error handling: jangan biarkan proses utama berhenti
  }
};

module.exports = { sendWelcomeEmail };
