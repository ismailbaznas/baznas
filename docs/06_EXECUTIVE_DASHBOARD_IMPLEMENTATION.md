# 📊 CATATAN IMPLEMENTASI & PANDUAN ROLLBACK: EXECUTIVE COMMAND CENTER DASHBOARD

Dokumen ini mencatat seluruh perubahan, struktur komponen, serta panduan *rollback* untuk implementasi **Executive Command Center Dashboard** pada halaman Admin BAZNAS Boven Digoel (`/admin`).

---

## 🔒 CATATAN ISOLASI FRONTEND, SKEMA TEMA & KEAMANAN
* **Dukungan Tema Terang (Light Mode) & Tema Gelap (Dark Mode):** Komponen `ExecutiveDashboardClient.tsx` telah dirancang **100% Adaptif**.
  - **Light Mode:** Menggunakan latar bersih modern (`bg-white`), teks Deep Emerald (`#004229`), aksen Gold Classic (`#D4AF37`), dan elemen UI dengan batas lembut (`border-slate-200`).
  - **Dark Mode:** Menggunakan latar Deep Dark Green (`rgb(5, 24, 8)` / `#051808`), kartu elevasi dark green (`#08240e`), border (`#0f4018`), teks terang, aksen Emerald Neon (`#10b981`), dan kartu transparan glassmorphism.
* **Frontend Publik (UNTOUCHED):** Seluruh file publik (seperti `/`, `/program`, `/transparansi`, `/tentang`, `/kabar`, dan komponen publik di `src/components/`) **TIDAK DIUBAH SAMA SEKALI**. Warna brand publik (`#004229`, `#D4AF37`) dan font publik (`Playfair Display`, `Plus Jakarta Sans`) pada situs publik tetap 100% utuh.
* **RBAC 3-Layer Defense:** Implementasi dashboard admin tetap mematuhi pengamanan layer server dengan `getRbacUser()` pada `src/app/admin/page.tsx`, tanpa mengabaikan hak akses user.
* **Kueri PostgREST Zero Waterfall:** Menggunakan `Promise.all` untuk fetching data paralel dari Supabase (`news`, `programs`, `admin_users`, `contact_messages`, `mustahik_applications`, `documents`).

---

## 🗂️ BERKAS YANG DIBUAT & DIUBAH

### 1. Berkas Baru Dibuat:
* `src/components/admin/ExecutiveDashboardClient.tsx`
  Komponen Client yang menangani visualisasi data interaktif (Dua Tema: Light & Dark):
  - **KPI Cards Baris Atas:** Metrik angka nominal Rupiah & statistik dengan persentase pertumbuhan YoY (▲ ▼).
  - **Tren Realisasi vs Target (Line & Area SVG Chart):** Visualisasi tren 5 tahun penerimaan & penyaluran ZIS.
  - **Realisasi per 5 Pilar BAZNAS (Interactive Donut Chart):** BAZNAS Sehat, Cerdas, Mandiri, Peduli, dan Taqwa.
  - **Top 10 Distrik Penyaluran (Horizontal Bar Chart):** Visualisasi distribusi per distrik Boven Digoel (Mandobo, Jair, Mindiptana, Waropko, Subur, Iniyandit, dll).
  - **Progress Bar Realisasi vs Target RKAT:** Persentase pencapaian per pilar program.
  - **Indikator Strategis & Operasional (Mini Cards with Sparklines):** Permohonan Bantuan, Pesan Publik, Status Audit KAP (WTP), & Kepatuhan Syariah.
  - **Right Drawer / Sidebar Filter:** Filter interaktif Tahun, Distrik, Jenis ZIS, Status, serta tombol *Reset Filter*.

* `docs/06_EXECUTIVE_DASHBOARD_IMPLEMENTATION.md`
  File panduan pencatatan & rollback ini.

### 2. Berkas Diubah:
* `src/app/admin/page.tsx`
  Menghubungkan fetching server-side Supabase paralel dengan komponen `ExecutiveDashboardClient.tsx`.

---

## 🔄 PANDUAN ROLLBACK (CARA MENGEMBALIKAN KE VERSI SEBELUMNYA)

Jika sewaktu-waktu ingin membatalkan/mengembalikan dasbor admin ke versi CMS lama, ikuti langkah mudah berikut:

### Opsi A: Menggunakan Git Rollback (Rekomendasi)
```bash
git checkout HEAD~1 -- src/app/admin/page.tsx
rm src/components/admin/ExecutiveDashboardClient.tsx
rm docs/06_EXECUTIVE_DASHBOARD_IMPLEMENTATION.md
```

### Opsi B: Mengubah Kode Manual
Kembalikan isi `src/app/admin/page.tsx` ke versi sederhana sebelumnya (metric cards dasar 4 box).

---

## 🛠️ VERIFIKASI BUILD
Jalankan perintah berikut untuk memastikan tidak ada kesalahan TypeScript atau hidrasi:
```bash
npm run build
```
