---
name: nextjs-supabase-stack
description: Use when building, refactoring, or optimizing fullstack apps using Next.js 16 (App Router), Supabase (Auth SSR, PostgreSQL, RLS), Tailwind CSS, or deploying to Vercel. Enforces official Next.js agent guidelines, zero-waterfall performance, and strict security boundaries.
---

# 🚀 SOP ARSITEKTUR PRODUKSI: NEXT.JS + SUPABASE + VERCEL

Patuhi standar teknis, batasan keamanan, dan alur kerja verifikasi ini pada setiap pembuatan fitur atau perbaikan kode.

---

## 1. NEXT.JS 16 APP ROUTER & BUNDLED DOCS
1. **Bundled Documentation Priority:**
   - Selalu rujuk `node_modules/next/dist/docs/` dan `AGENTS.md` untuk API Next.js versi terpasang. Jangan menebak API dari data latih lama.
2. **Async Page Props:**
   - `params` dan `searchParams` pada Server Components (`page.tsx`) WAJIB berupa `Promise<{ ... }>` dan harus di-`await` sebelum digunakan:
     ```tsx
     export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
       const { page } = await searchParams;
     }
     ```
3. **Server vs Client Boundary:**
   - Halaman listing dan render konten statis adalah Server Component murni (tanpa `"use client"`).
   - Gunakan `"use client"` HANYA jika memerlukan `useState`, `useEffect`, atau event handler (`onClick`, `onChange`).
4. **Hydration Safety:**
   - Komponen Badge/Lencana WAJIB merender tag `<span>` (bukan `<div>`). Dilarang menempatkan elemen tingkat blok di dalam tag `<p>`.

---

## 2. SUPABASE SSR & 3-LAYER SECURITY ARCHITECTURE
1. **3 Kategori Klien Supabase Terpisah:**
   - `createServerSupabase()`: Menggunakan cookie asinkron untuk Server Component & Server Actions.
   - `getSupabaseBrowser()`: Singleton browser client untuk Client Component (Admin CMS & mutasi).
   - `createServiceRoleClient()`: HANYA untuk backend API route (`src/app/api/*`). DILARANG KERAS diimpor ke Client Component.
2. **Google OAuth PKCE Flow:**
   - `redirectTo` mengarah ke `${origin}/api/auth/callback`.
   - API callback menukar `code` menjadi session cookie via `exchangeCodeForSession` di server sebelum redirect.
3. **Keamanan Formulir Publik:**
   - Formulir kirim pesan publik dan permohonan bantuan WAJIB mengirim data via API Route backend, bukan direct write dari browser anonim.
4. **3-Layer RBAC Guard:**
   - Halaman: `await guardAdminPage('module.read')`
   - API: `await requirePermission('module.action')`
   - UI: `<Can do="module.action">`

---

## 3. ZERO-WATERFALL PERFORMANCE & CACHING
1. **Parallel Fetching (`Promise.all`):**
   - Kueri data independen di Server Component WAJIB dijalankan paralel via `await Promise.all([...])` (TTFB < 100ms).
2. **Column Pruning:**
   - Kueri listing berita/program dilarang mengambil kolom rich-text `content`. Excerpt dipotong di server.
3. **Code Splitting Form Modal:**
   - Seluruh modal CMS diimpor dinamis: `dynamic(() => import("./ModalComponent"), { ssr: false })`.
4. **Strategi Caching:**
   - Halaman publik informasional memakai ISR: `export const revalidate = 60;`.
   - Halaman admin/autentikasi memakai `export const dynamic = "force-dynamic";`.
5. **Next.js Image Optimization:**
   - Seluruh gambar menggunakan `<Image />` dari `next/image` dengan properti `sizes` dan remote domain terdaftar di `next.config.mjs` (`formats: ['image/avif', 'image/webp']`).

---

## 4. VERIFIKASI SEBELUM SELESAI (EDIT-AND-VERIFY LOOP)
- Setiap selesai melakukan modifikasi, AI wajib menjalankan `npm run build` untuk memvalidasi bahwa seluruh rute lulus kompilasi Type-Check, Turbopack, dan SSR tanpa error.
