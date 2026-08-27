# BAZNAS Kabupaten Boven Digoel Rebuild Project

Selamat datang di proyek pembangunan ulang Website Resmi BAZNAS Kabupaten Boven Digoel. Proyek ini dibangun dengan arsitektur modern Next.js 16 (App Router), TypeScript, Tailwind CSS, dan Supabase untuk menjamin performa, skalabilitas, dan keamanan.

Sistem ini mengadopsi pola arsitektur yang teruji (berdasarkan proyek KEMENHAJ) dan telah dilengkapi dengan modul fungsionalitas penuh untuk CMS dan manajemen keamanan.

## 🚀 Status Proyek (Selesai Implementasi)

Seluruh fungsionalitas yang disepakati dalam PRD telah selesai diimplementasikan, termasuk:

1.  **Arsitektur Inti:** Next.js 16 (App Router) + Supabase SSR.
2.  **Keamanan:** Sistem RBAC 3-Lapis (Roles, Permissions, Guards) terintegrasi penuh.
3.  **Modul Admin (CMS):** CRUD Lengkap untuk Berita, Program, Agenda, Dokumen Transparansi, Pimpinan, Pesan Masuk, Pengguna, dan Peran.
4.  **Halaman Publik:** Navigasi, Layout Publik, dan Form Kontak/Pengaduan (Selesai).

**Proyek saat ini dalam kondisi siap *Production Build* setelah dilakukan beberapa perbaikan kecil pada TypeScript dan JSX.**

## 🛠️ Cara Menjalankan

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Konfigurasi Database:** Terapkan skema SQL (`supabase/migrations/0000_initial_schema.sql`) ke proyek Supabase Anda.
3.  **Isi Environment:** Isi file `.env.local` dengan kunci Supabase Anda.
4.  **Jalankan Lokal:**
    ```bash
    npm run dev
    ```

## 📝 Catatan dan Checklist Detail

Untuk perincian kemajuan, daftar file yang diubah, dan langkah-langkah *deployment* berikutnya, silakan merujuk pada file:

**[REBUILD_NOTES.md](./REBUILD_NOTES.md)**
