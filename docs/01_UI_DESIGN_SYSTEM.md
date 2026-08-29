# 🎨 PANDUAN SISTEM DESAIN & UI (BAZNAS BOVEN DIGOEL)
*Acuan teknis khusus untuk pengembangan antarmuka (UI), penataan gaya (Styling), tipografi, dan komponen.*

---

## 1. IDENTITAS VISUAL & TOKEN WARNA (BRAND PALETTE)

Sistem warna memadukan kewibawaan institusi Islam modern (**Deep Emerald**) dengan transparansi dan kemuliaan amanah zakat (**Gold Accent**).

### A. Warna Utama (Brand Colors)
| Nama Token | Hex Code | Penggunaan Utama | Mode Gelap |
|:---|:---|:---|:---|
| **Deep Emerald Solid** | `#004229` | Background Sidebar Admin, Header/Footer Publik, Banner Utama | `#131313` / `#002112` |
| **Emerald Accent** | `#075C3B` | Tombol Utama, Badge Aktif, Border Penekanan | `#8cd6ac` (Teks/Aksen) |
| **Gold Classic** | `#D4AF37` | Lencana Kategori, Aksen Angka, Garis Aktif Sidebar | `#ffe088` (Teks Aksen Terang) |
| **Dark Gold Contrast** | `#a08124` | Teks Emas di atas latar terang (WCAG AA) | `#ffe088` |
| **Surface Cream Light**| `#F8F6F1` | Latar Seksi Profil, Trust Strip, Kontras Lembut | `#181818` |
| **Neutral Border** | `#bfc9c0`/30 | Garis pemisah kartu, header, dan tabel | `#27272a` (`border-zinc-800`) |

### B. Warna Status Semantik
* **Sukses / Terverifikasi (`verified`/`done`):** Emerald / Green (`bg-emerald-50 text-emerald-800 border-emerald-300`)
* **Peringatan / Menunggu (`pending`/`new`):** Amber / Gold (`bg-amber-50 text-amber-800 border-amber-300`)
* **Bahaya / Ditolak (`rejected`):** Crimson / Red (`bg-red-50 text-red-800 border-red-300`)
* **Informasi / Arsip:** Slate / Zinc (`bg-slate-100 text-slate-700`)

---

## 2. STANDAR TIPOGRAFI GLOBAL

| Elemen UI | Font Family | Tailwind Class | Keterangan & Hierarki |
|:---|:---|:---|:---|
| **Judul Halaman & Hero** | `Playfair Display` | `font-playfair font-bold` | Digunakan pada semua H1, H2, judul artikel, judul banner, dan judul modul admin. |
| **Body, Teks Konten & UI** | `Plus Jakarta Sans` | `font-jakarta` | Digunakan pada paragraf, label input, tabel, modal form, dan tombol. |
| **Data Numerik & Statistik** | `Space Grotesk` / `Playfair` | `font-space-grotesk` / `font-playfair` | Digunakan pada angka nominal rupiah dan metrik transparansi. |

---

## 3. KOMPONEN ATOMIK & ATURAN SEMANTIK

### A. Badge (`src/components/ui/Badge.tsx`)
* **ATURAN MUTLAK:** Badge **WAJIB** dirender sebagai elemen `<span>` (`inline-flex items-center`), BUKAN `<div>`.
* **Alasan:** Tag `<div>` di dalam `<p>` akan memicu *Hydration Mismatch Error* pada browser Next.js 16.

### B. Button (`src/components/ui/Button.tsx`)
* **Varian Baku:**
  - `primary`: `bg-[#075C3B] hover:bg-[#004229] text-white`
  - `outline`: `border border-surface-variant hover:bg-slate-50 dark:hover:bg-zinc-800`
  - `destructive`: `bg-red-600 hover:bg-red-700 text-white`
  - `ghost`: `hover:bg-slate-100 dark:hover:bg-zinc-800`

### C. Input, Textarea & Select (`src/components/ui/Input.tsx`)
* Memiliki style fokus seragam: `focus:ring-2 focus:ring-[#075C3B] focus:border-transparent outline-none`.
* Adaptasi dark mode bersih: `dark:bg-zinc-800 dark:border-zinc-700 dark:text-white`.

### D. Logo Brand (`src/components/ui/Logo.tsx`)
* Menggunakan komponen `next/image` (`<Image width={48} height={48} priority />`) dengan fallback teks institusional yang jelas.

---

## 4. STRUKTUR LAYOUT & SHELL

### A. Admin Shell (`src/components/AdminLayoutClient.tsx`)
* **Sidebar Kiri:** Latar `bg-[#004229]`, emblem resmi BAZNAS Boven Digoel, menu aktif dengan `border-l-4 border-[#D4AF37] bg-white/10`.
* **TopAppBar:** Fixed header di bagian atas memuat judul modul dinamis, tombol *"Lihat Situs"*, switch `ThemeToggle`, dan info pengguna login.
* **Layout Isolation:** Rute `/admin/*`, `/login`, dan `/accept-invite` diisolasi sepenuhnya tanpa `PublicNavbar` & `PublicFooter` melalui `AppLayoutWrapper.tsx`.

### B. Public Shell
* **Header:** `PublicNavbar` dengan latar sticky frosted-glass blur (`backdrop-blur-md`).
* **Footer:** `PublicFooter` pure static Server-rendered tanpa client fetching.
* **Struktur Halaman:**
  - **Beranda (`/`):** Hero, 5 Pilar Kebaikan, Jejak Kebaikan, Laporan Transparansi, 3 Kabar Terkini, Cerita Dampak.
  - **Tentang Kami (`/tentang`):** Banner Pimpinan, Profil Lembaga, Visi & Misi, Nilai-Nilai Utama, Grid 5 Kolom Pimpinan (Desktop), Dasar Hukum & Legalitas.
  - **Program (`/program`):** Banner Hero, 5 Pilar Bento Card, Listing Program Dinamis.
  - **Transparansi (`/transparansi`):** Statistik Keuangan Real-Time, Filter Tipe Dokumen & Tahun, Tabel/List Download PDF.
