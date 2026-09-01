---
name: nextjs-supabase-stack
description: Universal enterprise-grade SOP for building, auditing, refactoring, and optimizing fullstack applications using Next.js 16 (App Router), Supabase (Auth SSR, PostgreSQL, Granular RLS, Storage), Tailwind CSS, and Vercel Edge CDN. Enforces official Next.js 16 guidelines, zero-waterfall performance, pure server components, LCP preloading, and strict security boundaries.
---

# 🚀 NEXT.JS 16 + SUPABASE FULLSTACK PRODUCTION MASTER SKILL

Panduan standar arsitektur produksi, batasan keamanan, dan alur kerja rekayasa performa tinggi untuk membangun, mengaudit, dan mengoptimalkan aplikasi web berskala enterprise dengan **Next.js 16 (App Router)** dan **Supabase (Auth SSR, PostgreSQL RLS, Storage)**.

---

## ⚡ 1. NEXT.JS 16 APP ROUTER & SERVER-FIRST PRINCIPLES

### A. Async Page Props (Mandatori Next.js 16)
`params` dan `searchParams` pada Server Components (`page.tsx`) **WAJIB** bertipe `Promise<{ ... }>` dan harus di-`await` sebelum dibaca:
```tsx
// ✅ BENAR (Next.js 16 App Router):
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { slug } = await params;
  const { page, search } = await searchParams;
}
```

### B. Pemisahan Tegas Server Component vs Client Component
1. **Server Components by Default:** Halaman listing, layout shell, fetch data awal, dan static footer **WAJIB** berupa Server Component murni (tanpa `"use client"`).
2. **Kapan Menggunakan `"use client"`:** HANYA ketika komponen membutuhkan hooks (`useState`, `useEffect`, `useRef`), event handler (`onClick`, `onChange`), atau API browser (`localStorage`, `window`).
3. **Pemberian Props:** Selalu tarik data di Server Component dan operkan sebagai props statis ke Client Component.

### C. Semantik HTML & Hydration Safety
- Komponen `Badge.tsx` **WAJIB** merender tag `<span>` (`inline-flex items-center`), BUKAN `<div>`.
- DILARANG menaruh elemen block-level (`<div>`, `<p>`, `<h1>`) di dalam tag `<p>` atau inline container untuk mencegah *Hydration Mismatch Error*.

---

## 🏎️ 2. PAGESPEED & ZERO-WATERFALL PERFORMANCE ARCHITECTURE

### A. LCP Preload & Image Optimization (`next/image`)
1. **Hindari CSS `backgroundImage` untuk Elemen LCP:**
   - CSS `backgroundImage` tidak terdeteksi oleh *Preload Scanner* browser dan tidak memiliki format AVIF/WebP responsif.
   - Selalu gunakan Next.js `<Image />` dengan properti `priority`, `fill`, dan `sizes`:
     ```tsx
     <div className="relative w-full h-[500px]">
       <Image
         src={heroImageUrl}
         alt="Hero Banner"
         fill
         priority
         sizes="100vw"
         className="object-cover"
       />
     </div>
     ```
2. **Konfigurasi Edge Caching & Format Modern (`next.config.mjs`):**
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     minimumCacheTTL: 31536000, // 1 tahun edge CDN cache
     remotePatterns: [
       { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
       { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
     ],
   }
   ```

### B. Parallel Data Fetching (`Promise.all`)
DILARANG mengeksekusi kueri independen secara sekuensial (waterfall). Selalu bungkus dalam `Promise.all`:
```tsx
// ✅ BENAR (Waktu respon server = max(t1, t2, t3)):
const [{ data: news }, { data: programs }, { data: settings }] = await Promise.all([
  supabase.from("news").select("id, title, slug, thumbnail_url").eq("is_published", true).limit(3),
  supabase.from("programs").select("id, title, slug, image_url").eq("is_active", true).limit(3),
  supabase.from("site_settings").select("*"),
]);
```

### C. PostgREST Column Pruning & Head Counting
1. **Pruning Listing Kueri:** DILARANG menarik kolom rich-text HTML panjang (`content`) pada kueri daftar/listing. Hanya pilih kolom ringkas yang ditampilkan kartu.
2. **Header Count Aggregates:** Untuk menghitung total data statistik dasbor admin, gunakan `{ count: "exact", head: true }`:
   ```tsx
   const { count } = await supabase
     .from("messages")
     .select("*", { count: "exact", head: true })
     .eq("status", "new");
   ```

### D. Code Splitting & Dynamic Imports
Chunking formulir modal berat dan chart visualisasi dengan `next/dynamic` (`{ ssr: false }`):
```tsx
const AdminBeritaModal = dynamic(() => import("./AdminBeritaModal"), { ssr: false });
```

### E. Font Swap & Network Preconnect
1. Tambahkan `display: "swap"` pada seluruh `next/font/google` di `layout.tsx` untuk mencegah *Flash of Invisible Text* (FOIT).
2. Tambahkan `<link rel="preconnect" href="https://..." crossOrigin="anonymous" />` pada `<head>` untuk origin CDN gambar eksternal.

---

## 🛡️ 3. SUPABASE SSR, AUTH PKCE & 3-LAYER RBAC SECURITY

### A. 3 Kategori Klien Supabase Terisolasi
```
┌───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Klien Supabase                │ Lokasi Berkas                    │ Lingkup Penggunaan          │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ `createServerSupabase()`      │ `src/lib/server-supabase.ts`     │ Server Component & Actions  │
│ `getSupabaseBrowser()`        │ `src/lib/supabase.ts`            │ Client Component (Admin CMS)│
│ `createServiceRoleClient()`   │ `src/lib/server-supabase.ts`     │ Strictly `src/app/api/*`    │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```
⚠️ **PERINGATAN:** `createServiceRoleClient()` **DILARANG KERAS** diimpor ke berkas dengan direktif `"use client"`.

### B. Pencegahan Privilege Escalation (Auto-Guest Default)
1. **Database Trigger:** Pengguna baru dari Google OAuth / Sign-up publik WAJIB mendapatkan `role = NULL` (Tamu / Guest).
2. **Admin Lockdown:** Seluruh rute `/admin/*` memvalidasi status peran:
   ```typescript
   if (!user || !user.role) {
     redirect("/akun"); // Alihkan pengguna umum ke portal profil mereka
   }
   ```
3. **Smart PKCE OAuth Callback (`/api/auth/callback`):**
   - Menukar auth `code` menjadi session cookie di server.
   - Memeriksa role pengguna: jika staff/admin diarahkan ke `/admin`, jika tamu diarahkan ke `/akun`.

### C. Kebijakan Granular RLS PostgreSQL (Idempotent)
Selalu pisahkan kebijakan RLS per operasi (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) dan pastikan skrip migrasi diawali `DROP POLICY IF EXISTS`:
```sql
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts: Public read" ON public.posts;
CREATE POLICY "Posts: Public read" ON public.posts
  FOR SELECT TO public USING (is_published = TRUE);

DROP POLICY IF EXISTS "Posts: Admin insert" ON public.posts;
CREATE POLICY "Posts: Admin insert" ON public.posts
  FOR INSERT TO authenticated WITH CHECK (public.has_permission('berita.create'));

DROP POLICY IF EXISTS "Posts: Admin update" ON public.posts;
CREATE POLICY "Posts: Admin update" ON public.posts
  FOR UPDATE TO authenticated 
  USING (public.has_permission('berita.update')) 
  WITH CHECK (public.has_permission('berita.update'));

DROP POLICY IF EXISTS "Posts: Admin delete" ON public.posts;
CREATE POLICY "Posts: Admin delete" ON public.posts
  FOR DELETE TO authenticated USING (public.has_permission('berita.delete'));
```

---

## 📦 4. STORAGE BUCKET ARCHITECTURE & UPLOAD SECURITY

### A. Struktur Folder Tersegmentasi
```text
bucket_name
 ├── public/                      <── Public Read (Gambar konten, banner, dokumen publik)
 │    ├── news/
 │    ├── programs/
 │    └── team/
 └── admin/                       <── Private / Protected (Laporan internal & verifikasi)
```

### B. Validasi & Penamaan Berkas Aman
1. Validasi MIME type di client & server (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
2. Batas ukuran file: Maksimal 5MB untuk gambar, 10MB untuk PDF.
3. Sanitasi nama berkas: Gunakan prefix timestamp dan nama karakter alfanumerik bersih (`${Date.now()}_${cleanName}.${ext}`) untuk mencegah tabrakan nama file.

---

## 📋 5. CHECKLIST VERIFIKASI SEBELUM COMMIT (PRA-DEPLOY)

- [ ] **Build Check:** Jalankan `npm run build` dan pastikan 100% bebas dari kesalahan tipe, hidrasi, dan kompilasi Turbopack.
- [ ] **LCP Check:** Elemen visual utama di atas layar (Hero) menggunakan `<Image priority fill sizes="100vw" />`.
- [ ] **Zero Waterfall:** Kueri server independen dibungkus `Promise.all`.
- [ ] **Pure Server Components:** Layout dan footer statis tidak memuat client-side `useEffect` fetch.
- [ ] **RBAC Lockdown:** User OAuth baru berstatus Guest (`role = NULL`) dan dilarang mengakses `/admin`.
- [ ] **Service Role Safe:** Tidak ada kebocoran `createServiceRoleClient()` ke client bundle browser.
