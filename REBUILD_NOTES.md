# REBUILD & ARCHITECTURE REFERENCE NOTES - BAZNAS KAB. BOVEN DIGOEL

Dokumen ini berfungsi sebagai acuan teknis master, analisis temuan awal, spesifikasi Sistem Desain, dan rencana peta jalan (roadmap) pengembangan di masa depan untuk situs resmi **BAZNAS Kabupaten Boven Digoel (Level C+)**.

---

## 1. HISTORICAL AUDIT & INITIATION FINDINGS (TEMUAN UTAMA)

### A. Bug Loop Redirect `/login` <-> `/admin`
* **Temuan Masalah**: Ketika admin mencoba mengakses `/admin`, halaman terus menerus memuat ulang (refresh) dan berputar tanpa henti antara rute `/login` dan `/admin`.
* **Penyebab**: 
  1. Browser client lama di `src/lib/supabase.ts` diinisialisasi menggunakan `createClient` bawaan `@supabase/supabase-js`. Client ini hanya menyimpan session di dalam `LocalStorage` browser dan tidak menulis cookie session.
  2. Saat Server Component Next.js 16 mengeksekusi `/admin` di sisi server, `createServerSupabase()` mencoba membaca session. Karena browser tidak mengirimkan cookie session, server menganggap pengguna belum login (`authUser = null`) dan melemparkan pengalihan status `307` ke `/login`.
  3. Di `/login` (sisi client), `@supabase/supabase-js` mendeteksi adanya token aktif di LocalStorage, sehingga Router Client langsung memindahkan pengguna kembali ke `/admin`. Hal ini berulang tanpa henti (looping).
* **Solusi & Perbaikan**:
  - Memperbarui library `@supabase/ssr` ke versi stabil terbaru `^0.12.3` yang memiliki keselarasan tinggi dengan Next.js 16.
  - Memperbarui `src/lib/supabase.ts` agar menggunakan `createBrowserClient` dari `@supabase/ssr` yang secara otomatis menulis dan menyinkronkan token session ke dalam cookie browser.
  - Mengubah `createServerSupabase` di `src/lib/server-supabase.ts` agar menggunakan pemanggilan `await cookies()` secara asinkron untuk mengambil cookie yang valid di Next.js 16.

### B. Kegagalan Google OAuth (PKCE Flow Breakage)
* **Temuan Masalah**: Klik tombol "Masuk dengan Google" memulai proses autentikasi tetapi gagal masuk ke panel admin, mengembalikan admin ke halaman login tanpa session cookie yang valid.
* **Penyebab**: `@supabase/ssr` secara default menggunakan metode PKCE yang sangat aman. Ketika Supabase mengarahkan kembali browser pengguna dengan kode otorisasi (`?code=...`) langsung ke halaman `/admin`, rute tersebut adalah Server Component. Karena kode belum ditukar menjadi session, server mendeteksi pengguna sebagai unauthenticated dan langsung melempar redirect `307` ke `/login` sebelum browser sempat menukar kode tersebut secara client-side. Kode otorisasi pun hilang dan tidak dapat ditukarkan lagi.
* **Solusi & Perbaikan**:
  - Membuat API Route server-side khusus di `src/app/api/auth/callback/route.ts`. Route ini menangani penerimaan parameter `code`, memanggil `exchangeCodeForSession(code)` di server untuk menulis cookie session, baru mengalihkan pengguna ke `/admin` dengan kondisi cookie sudah aktif penuh.
  - Mengubah opsi `redirectTo` di `LoginFormClient.tsx` agar mengarah ke `${window.location.origin}/api/auth/callback`.
  - Memperbarui `src/proxy.ts` (Next.js 16 Proxy) agar mencakup pencocokan rute `["/admin", "/admin/:path*"]` guna menyegarkan session cookie secara otomatis saat admin beraktivitas.

### C. Kesalahan Pra-render SSR (`localStorage is not defined`)
* **Temuan Masalah**: Kompilasi proyek (`next build`) gagal total dengan pesan kesalahan `ReferenceError: localStorage is not defined` di dalam berkas `AdminUsersModal.tsx`.
* **Penyebab**: Kode mencoba mengakses objek global browser `localStorage` di dalam tubuh komponen utama yang sedang dikompilasi di server Node.js selama proses pra-render (prerendering) Next.js.
* **Solusi & Perbaikan**: Menghapus referensi `localStorage` langsung dari tubuh komponen. Sebagai gantinya, data pengguna masuk yang sah (`currentUser`) diambil secara aman di sisi Server Component dan dialirkan ke level modal terdalam melalui properti (props) terstruktur, sehingga menjamin kompatibilitas SSR 100% dan keamanan tipe data TypeScript.

### D. Tautan Mati 404 pada Kabar & Program
* **Temuan Masalah**: Kartu berita terbaru dan kartu program di homepage serta halaman kategori mengarah ke tautan mati (404 Not Found) seperti `/kabar/${item.slug}` dan `/program/${item.slug}`.
* **Penyebab**: Direktori dynamic routing `/kabar/[slug]` dan `/program/[slug]` belum dibuat sama sekali dalam struktur folder Next.js.
* **Solusi & Perbaikan**: Membuat halaman detail dinamis yang teroptimasi di `/src/app/kabar/[slug]/page.tsx` dan `/src/app/program/[slug]/page.tsx`. Halaman-halaman ini secara asinkron mengambil data dari tabel `news` dan `programs` berdasarkan `slug` mereka, lengkap dengan penanganan halaman kosong (`notFound()`) dan visual artikel yang indah.

---

## 2. OFFICIAL DESIGN SYSTEM SPECIFICATION (SISTEM DESAIN RESMI)

Sistem desain BAZNAS Kabupaten Boven Digoel dirancang agar mempertahankan **Visual DNA keluarga besar BAZNAS**, tetapi disesuaikan dengan skala Kabupaten Boven Digoel (Level C+) agar bersih, berwibawa, profesional, terpercaya, dan sangat responsif.

### A. Token Warna Utama (Brand Colors)
Warna dipetakan secara dinamis menggunakan CSS variables (`globals.css`) untuk transisi Light/Dark Mode yang mulus:

*   **Primary Green (Hijau Keislaman)**: `rgb(29, 133, 9)` (Light) | `rgb(153, 234, 110)` (Dark). Digunakan untuk identitas utama BAZNAS (tombol utama, bar navigasi aktif, teks penekanan).
*   **Gold Accent (Emas Amanah & Transparansi)**: `rgb(245, 200, 80)` (Light) | `rgb(247, 210, 108)` (Dark). Digunakan untuk lencana penanda, tombol aksen (`outline-gold`), borders, dan efek bersinar lembut (`glow-gold`).
*   **Contrast Dark Gold (Emas Kontras Readability)**: `rgb(140, 105, 15)` (Light) | `rgb(200, 160, 40)` (Dark). Digunakan untuk teks emas di atas latar terang guna menjamin standar kontras keterbacaan tinggi (WCAG AA).
*   **Warna Latar Belakang (Surfaces)**: Putih bersih untuk mode terang, dan warna abu-abu hangat gelap (`rgb(18, 18, 18)`) untuk mode gelap (bukan hitam pekat, guna menjaga kenyamanan mata/luxury feel).
*   **Status Semantik (Semantic Indicators)**:
    *   **Success**: `rgb(22, 163, 74)` (Light) / `rgb(34, 197, 94)` (Dark) -> Digunakan untuk lencana peran kustom, pesan sukses, dll.
    *   **Warning**: `rgb(217, 119, 6)` (Light) / `rgb(251, 191, 36)` (Dark) -> Digunakan untuk lencana peran sistem, peringatan, dll.
    *   **Danger**: `rgb(220, 38, 38)` (Light) / `rgb(248, 113, 113)` (Dark) -> Digunakan untuk tombol hapus, pesan kesalahan, dll.

### B. Tipografi & Skala Font
*   **Headings & Judul Menarik**: `Space Grotesk` (`font-space-grotesk`). Memberikan kesan modern, kokoh, berwibawa, dan bernuansa institusional modern.
*   **Teks Konten & Artikel**: `Inter` (`font-inter`). Menjamin tingkat keterbacaan yang sangat tinggi baik di layar HP maupun desktop.
*   **Skala Font**:
    *   `body-md`: `0.95rem` (15.2px) -> Ukuran teks standar membaca, tabel, dan navigasi.
    *   `body-lg`: `1.05rem` (16.8px) -> Paragraf intro, kutipan, isi berita detail.
    *   `headline-md`: `1.6rem` (25.6px) -> Sub-judul section, judul kartu berita/program.
    *   `headline-lg`: `2rem` (32px) -> Judul halaman utama, judul artikel penuh, banner hero.

### C. Responsivitas Tata Letak & Akses Menu (Layout Responsiveness)
*   **Navigasi Mobile Admin (Responsive Drawer)**: Pada layar mobile (`< md`), bilah samping bertransisi menjadi **laci navigasi modal** yang meluncur mulus dari sisi kiri layar. Laci ini dapat dibuka menggunakan tombol mengambang (Floating Action Button) berbentuk bulat di pojok kanan bawah, memberikan kenyamanan akses satu jempol bagi pengguna mobile.
*   **Indikator Menu Aktif**: Semua menu navigasi admin secara cerdas membaca rute aktif via `usePathname()` dan memberikan penyorotan latar belakang yang lembut (`bg-primary-container`), memudahkan admin melacak halaman yang sedang dikelola.
*   **Efek Transisi Menu Mobile Publik**: Menu mobile pada halaman publik menggunakan efek perpaduan Opacity Fade & Slide-Down yang sangat stabil, serta memanfaatkan kelas `pointer-events-none` saat tertutup agar tidak memblokir interaksi ketukan layar.

---

## 3. MASTER PLAN & ROADMAP PENGEMBANGAN (PETA JALAN MASA DEPAN)

Rencana pengembangan fungsionalitas lanjutan situs BAZNAS Boven Digoel agar tetap kokoh, profesional, mudah dikelola, dan siap berintegrasi secara nasional:

### FASE I: Pemantapan Konten & Optimasi Media (Target: 1-2 Bulan)
1.  **Pembersihan Konten Placeholder**: Mengisi seluruh data kosong, alamat kantor, struktur kepengurusan pimpinan, visi misi resmi, serta nomor rekening donasi riil milik BAZNAS Kabupaten Boven Digoel.
2.  **Kategori & Pengarsipan Berita Dinamis**: Menghubungkan halaman Kabar publik dengan filter tab dinamis yang merujuk pada tabel `categories` di database Supabase secara real-time.
3.  **Optimasi Gambar & Media (Lighthouse Score 95+)**: Menerapkan validasi ukuran maksimal berkas unggahan pada CMS (maksimal 2MB per gambar) dan memastikan semua media publik dibungkus dalam format web modern (webp/avif) melalui komponen `next/image` otomatis.

### FASE II: Fitur Interaktif Transparansi & Publik (Target: 3-4 Bulan)
1.  **Visualisasi Laporan Transparansi**: Menyediakan grafik batang atau diagram lingkaran interaktif (menggunakan `recharts` / Tailwind murni) di halaman Transparansi untuk memvisualisasikan data agregat penghimpunan dan penyaluran ZIS per tahun agar lebih mudah dipahami publik.
2.  **Modul Pengaduan Publik Terintegrasi**: Menyediakan formulir pengaduan layanan terenkripsi di halaman Layanan yang terhubung langsung ke tabel kontak di Supabase, lengkap dengan notifikasi email otomatis ke admin ketika ada pesan masuk baru.
3.  **Formulir Permohonan Mustahik**: Membuat formulir permohonan bantuan mustahik terstruktur secara online yang memudahkan warga Boven Digoel mengajukan bantuan darurat atau program beasiswa langsung dari HP mereka.

### FASE III: Sistem Pembayaran & Integrasi Nasional (Target: 6+ Bulan)
1.  **Integrasi Kalkulator Zakat Nasional**: Menghubungkan modul perhitungan zakat BAZNAS Boven Digoel dengan Standard Calculation Engine resmi dari BAZNAS RI API (bila API tersedia), atau menggunakan abstraction layer `ZakatCalculationProvider` yang aman dan sesuai syariah.
2.  **Kolaborasi Payment Gateway**: Menyediakan fitur pembayaran zakat online menggunakan metode transfer bank otomatis, retail, atau kode QRIS dinamis berkolaborasi dengan payment gateway resmi yang berizin Bank Indonesia (misal: Midtrans / Xendit).
3.  **Dashboard Monitoring Muzaki & Mustahik**: Membangun modul internal admin (khusus role finansial & pimpinan) untuk memantau pendaftaran muzaki baru, melacak histori transaksi ZIS, serta mengelola verifikasi berkas penyaluran bantuan mustahik secara rahasia dan aman di bawah kendali RLS (Row Level Security) database yang sangat ketat.