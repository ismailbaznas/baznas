<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 📖 PANDUAN MASTER & ATURAN PENGEMBANGAN (BAZNAS BOVEN DIGOEL)
*Acuan utama untuk seluruh AI Agent dan Developer. Buka dokumen modular sesuai tugas yang sedang Anda kerjakan.*

---

## 🗂️ INDEX DOKUMEN MODULAR (BUKA HANYA SESUAI DOMAIN TUGAS)

| Domain Tugas Anda | Dokumen Spesifik | Fokus & Cakupan |
|:---|:---|:---|
| 🎨 **UI, Styling & Desain** | [`docs/01_UI_DESIGN_SYSTEM.md`](docs/01_UI_DESIGN_SYSTEM.md) | Deep Emerald `#004229`, Gold `#D4AF37`, Playfair Display, Plus Jakarta Sans, Badge `<span>`, Komponen Atomik, Layout Admin/Publik. |
| ⚡ **Next.js 16 & Routing** | [`docs/02_NEXTJS_ARCHITECTURE.md`](docs/02_NEXTJS_ARCHITECTURE.md) | Async `params`/`searchParams`, Server vs Client boundary, ISR `revalidate = 60`, `next/dynamic` modal chunking, `next/image`. |
| 🗄️ **Database & Supabase** | [`docs/03_DATABASE_SUPABASE.md`](docs/03_DATABASE_SUPABASE.md) | Skema tabel, kamus key `site_settings`, PostgREST column pruning, agregat `head: true`, pemisahan Klien Server/Browser/Service Role. |
| 🛡️ **Keamanan & RBAC** | [`docs/04_SECURITY_RBAC.md`](docs/04_SECURITY_RBAC.md) | 3-Layer Defense (`guardAdminPage`, `requirePermission`, `<Can>`), Google OAuth PKCE callback, pengamanan formulir publik via API routes. |
| 🚀 **Performa & Audit** | [`docs/05_PERFORMANCE_AUDIT.md`](docs/05_PERFORMANCE_AUDIT.md) | Laporan implementasi 10 optimasi performa, benchmark Core Web Vitals, dan checklist verifikasi pra-commit. |
| 📊 **Executive Dashboard** | [`docs/06_EXECUTIVE_DASHBOARD_IMPLEMENTATION.md`](docs/06_EXECUTIVE_DASHBOARD_IMPLEMENTATION.md) | Arsitektur Command Center, visualisasi data adaptif (Light/Dark mode), indikator strategis, dan panduan rollback. |
| 🌐 **SEO, Open Graph & PWA** | [`docs/07_SEO_PWA_ARCHITECTURE.md`](docs/07_SEO_PWA_ARCHITECTURE.md) | Metadata Base, Dynamic OG/Twitter Image (1200x630), Dynamic Sitemap/Robots, JSON-LD Structured Data, dan Native PWA Service Worker. |

---

## 🚨 7 ATURAN EMAS (WAJIB DIIKUTI TANPA PENGECUALIAN)

1. **Next.js 16 Async Page Props:**
   `params` dan `searchParams` pada Server Components **WAJIB** bertipe `Promise<{ ... }>` dan di-`await` sebelum dibaca.
2. **Semantik HTML & Hydration Safety:**
   `Badge.tsx` **WAJIB** merender tag `<span>` (bukan `<div>`). DILARANG menaruh elemen tingkat blok di dalam tag `<p>`.
3. **Pemisahan Klien Supabase:**
   `createServiceRoleClient()` **HANYA BOLEH** digunakan di `src/app/api/*`. DILARANG mengimpornya ke komponen klien (`"use client"`). Gunakan `createPublicServerSupabase()` untuk sitemap tanpa cookies.
4. **Performa Tinggi & Tanpa Waterfall:**
   - Kueri server independen **WAJIB** dibungkus `Promise.all`.
   - DILARANG menggunakan tag mentah `<img>` (gunakan `<Image />` dari `next/image`).
   - Modal CMS admin **WAJIB** diimpor dinamis dengan `next/dynamic` (`{ ssr: false }`).
5. **SEO & Metadata Integrity:**
   - Setiap halaman detail dinamis **WAJIB** mengekspor fungsi asinkron `generateMetadata({ params })`.
   - Seluruh halaman publik wajib memiliki `canonical` dan `openGraph` yang konsisten.
6. **Keamanan Service Worker & Caching PWA:**
   - DILARANG meng-cache rute `/admin/*`, `/api/*`, `/login`, auth session, atau data mutasi mustahik/muzaki.
   - Halaman `/offline` wajib diberi proteksi `robots: { index: false, follow: false }`.
7. **Verifikasi Build Mandatori:**
   Setiap selesai melakukan perubahan kode, jalankan `npm run build` untuk memastikan 100% bebas dari kesalahan tipe dan hidrasi.
