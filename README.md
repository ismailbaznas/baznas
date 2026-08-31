# 🏢 Website Resmi BAZNAS Kabupaten Boven Digoel

Portal resmi Badan Amil Zakat Nasional (BAZNAS) Kabupaten Boven Digoel. Dibangun dengan arsitektur modern **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Supabase SSR** untuk menjamin performa, skalabilitas, dan keamanan tata kelola zakat yang amanah, transparan, dan profesional.

---

## ⚡ Fitur Utama

- **Portal Publik Informatif & Cepat:** Beranda, Tentang Kami, 5 Pilar Program Unggulan, Arsip Transparansi Keuangan (PDF), Kabar Berita, Kalkulator Zakat & Permohonan Mustahik, serta Kontak Resmi.
- **Incremental Static Regeneration (ISR):** Halaman publik di-cache di Edge CDN (`revalidate = 60`) dengan waktu respon sub-50ms dan hemat kueri database.
- **Technical SEO & Dynamic Social Sharing:** Metadata Base dinamis, Dynamic OG & Twitter Image (1200×630 px) via `next/og`, Dynamic Sitemap XML, Robots.txt, dan Structured Data (JSON-LD) lengkap (`GovernmentOrganization`, `WebSite`, `BreadcrumbList`, `NewsArticle`, `Service`).
- **Progressive Web App (PWA) & Installability:** Native Service Worker berkinerja tinggi, Web App Manifest (`/manifest.webmanifest`), suite icon lengkap (192, 512, maskable dengan safe zone, dan apple-touch-icon), serta halaman offline fallback interaktif (`/offline`).
- **Admin CMS Terpadu & Responsif:** Manajemen penuh untuk Berita, Program Kerja, Agenda, Dokumen Publik, Profil Pimpinan, Permohonan Mustahik, Pesan Masuk, dan Pengaturan Situs dengan *Executive Command Center Dashboard*.
- **Sistem Keamanan 3-Lapis (RBAC):** Proteksi bertingkat pada Server Component, API Route, dan Client UI dengan Google OAuth PKCE.
- **Desain Modern Berstandar BAZNAS:** Palet *Deep Emerald* (`#004229`) dan *Gold Accent* (`#D4AF37`) dengan tipografi *Playfair Display* dan *Plus Jakarta Sans*.

---

## 🛠️ Stack Teknologi

- **Framework:** Next.js 16.3.0 (App Router & Turbopack)
- **Bahasa & Typing:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS 3 & Lucide Icons
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Storage, Auth SSR via `@supabase/ssr`)
- **PWA & Offline:** Native Standard Service Worker & Web App Manifest
- **Optimization:** Next.js `<Image />` (AVIF/WebP), Code Splitting (`next/dynamic`), Parallel Data Fetching (`Promise.all`).

---

## 🚀 Memulai Pengembangan Lokal

1. **Clone repository dan install dependensi:**
   ```bash
   npm install
   ```
2. **Setup Environment Variables (`.env.local`):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_ADMIN_URL=https://baznas-bvd.vercel.app
   ```
3. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
4. **Verifikasi Build Produksi:**
   ```bash
   npm run build
   ```

---

## 📚 Dokumentasi Teknis Modular

Untuk pedoman teknis mendalam, buka dokumen spesifik di folder `docs/`:

- 🎨 **[Sistem Desain & UI](docs/01_UI_DESIGN_SYSTEM.md)** — Palet warna, tipografi, token desain, komponen atomik (`Badge.tsx`), dan layout shell.
- ⚡ **[Arsitektur Next.js 16](docs/02_NEXTJS_ARCHITECTURE.md)** — Async `params`/`searchParams`, Server vs Client boundary, ISR, dynamic imports, dan kompresi gambar.
- 🗄️ **[Database & Supabase](docs/03_DATABASE_SUPABASE.md)** — Skema tabel, kamus key `site_settings`, optimasi kueri PostgREST, dan jenis klien Supabase.
- 🛡️ **[Keamanan & RBAC](docs/04_SECURITY_RBAC.md)** — Sistem keamanan 3-lapis, Google OAuth PKCE callback, dan pengamanan API route.
- 🚀 **[Audit & Standar Performa](docs/05_PERFORMANCE_AUDIT.md)** — Implementasi 10 pilar performa tinggi dan checklist verifikasi pra-commit.
- 📊 **[Executive Dashboard](docs/06_EXECUTIVE_DASHBOARD_IMPLEMENTATION.md)** — Catatan arsitektur dan panduan rollback Executive Command Center.
- 🌐 **[SEO, Open Graph & PWA](docs/07_SEO_PWA_ARCHITECTURE.md)** — Arsitektur Metadata, Dynamic OG Image, Sitemap, Robots, JSON-LD, dan Native PWA.
- 📝 **[Catatan & Log Riwayat Proyek](REBUILD_NOTES.md)** — Riwayat audit historis, resolusi masalah lampau, dan catatan migrasi.

---

## 🤖 AI Model Skills

Proyek ini dilengkapi custom AI Skills yang siap digunakan untuk workflow otomasi:

- **`nextjs-supabase-stack`** — SOP arsitektur Next.js 16 + Supabase SSR.
- **`nextjs-seo-og-master`** — Standar implementasi Technical SEO, Dynamic OG/Twitter Image, Dynamic Sitemap, Robots, dan JSON-LD.
- **`nextjs-pwa-master`** — Standar arsitektur Progressive Web App (PWA), Service Worker, Manifest, Icon suite, dan Offline Fallback.
