# Panduan Deployment ke cPanel (Node.js)

Dokumen ini berisi panduan langkah-demi-langkah untuk mendeploy aplikasi **Sistem Manajemen Koperasi Desa** ke cPanel hosting.

---

## Langkah 1: Persiapan Database di cPanel

1. Masuk ke **cPanel** Anda.
2. Cari menu **MySQL® Database Wizard** atau **MySQL® Databases**.
3. Buat database baru (catat nama databasenya, contoh: `username_koperasi`).
4. Buat user database baru dan buat password yang kuat (catat username dan password).
5. Tambahkan user tersebut ke database dengan hak akses penuh (**ALL PRIVILEGES**).

---

## Langkah 2: Import Database

1. Di cPanel, buka **phpMyAdmin**.
2. Pilih database yang baru saja Anda buat di panel sebelah kiri.
3. Klik tab **Import** di bagian atas.
4. Klik **Choose File** dan pilih file dump database terbaru: `database_export.sql` (atau `database_export_aiven.sql`).
5. Klik **Go** atau **Import** untuk menjalankan proses import.

---

## Langkah 3: Upload File Project ke cPanel

1. Kompres semua file project menjadi file `.zip` **KECUALI** folder `node_modules` dan `.git`.
   > *Catatan: Pastikan menyertakan file `server.js` (entry point cPanel) dan folder `views`, `public`, `routes`, `models`, `controllers`, `config`, `middleware`.*
2. Di cPanel, buka **File Manager**.
3. Masuk ke direktori home (biasanya di luar `public_html`, contohnya buat folder baru bernama `koperasi-app` di root `/home/username/koperasi-app`).
4. Upload file `.zip` tersebut ke folder `koperasi-app`.
5. Ekstrak file `.zip` tersebut di dalam folder tersebut.

---

## Langkah 4: Setup Aplikasi Node.js di cPanel

1. Kembali ke halaman utama cPanel, cari dan buka menu **Setup Node.js App**.
2. Klik tombol **Create Application**.
3. Konfigurasikan opsi berikut:
   * **Node.js version:** Pilih versi Node.js yang disarankan (misalnya `v18.x` atau `v20.x`).
   * **Application Mode:** Pilih `Production`.
   * **Application root:** Masukkan path folder project Anda (contoh: `koperasi-app`).
   * **Application URL:** Pilih domain/subdomain tempat aplikasi akan diakses.
   * **Application startup file:** Isi dengan **`server.js`** (bukan `app.js` agar server berjalan di cPanel).
4. Klik **Create**.

---

## Langkah 5: Konfigurasi Environment Variables (ENV)

Di halaman **Setup Node.js App** bagian bawah (**Environment variables**), tambahkan variabel berikut satu per satu:

| Name | Value | Keterangan |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Mode aplikasi |
| `PORT` | *Kosongkan (otomatis diatur cPanel)* | Port aplikasi |
| `DB_HOST` | `localhost` | Host MySQL cPanel (biasanya localhost) |
| `DB_USER` | `nama_user_database` | User database yang dibuat di Langkah 1 |
| `DB_PASSWORD` | `password_user_database` | Password database yang dibuat di Langkah 1 |
| `DB_NAME` | `nama_database_anda` | Nama database yang dibuat di Langkah 1 |
| `DB_PORT` | `3306` | Port MySQL default |
| `SESSION_SECRET` | *Buat string acak dan panjang* | Kunci enkripsi session |
| `SMTP_HOST` | `smtp.gmail.com` | Host SMTP email (opsional) |
| `SMTP_PORT` | `587` | Port SMTP (opsional) |
| `SMTP_USER` | `email@gmail.com` | Email pengirim (opsional) |
| `SMTP_PASS` | `password_app_gmail` | Password aplikasi gmail (opsional) |

Setelah menambahkan semua variabel, klik **Save**.

---

## Langkah 6: Install Dependensi (npm install)

1. Di halaman **Setup Node.js App**, klik tombol **Run NPM Install** untuk mengunduh semua package node yang diperlukan.
2. Tunggu beberapa saat hingga proses install selesai (akan muncul notifikasi sukses).

---

## Langkah 7: Jalankan Aplikasi

1. Klik tombol **Start Application** (atau **Restart Application** jika sudah berjalan).
2. Buka URL aplikasi Anda di browser untuk memastikan sistem berjalan dengan normal.
