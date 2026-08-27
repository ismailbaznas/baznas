KITA BUAT ULANG WEBSITE BAZNAS KAB. BOVEN DOGOEL, yang gagal 

skema konten dan styling ikuti = PRD.md

skema fitur/modul/halaman ikuti = D:\01.APPS\baznas boven digoel, (JANGAN IKUTI KODE, PROYEK GAGAL)

skema database dan sistem ikuti pola = D:\01.APPS\haji3\kemenhaj-boven-app2 (JANGAN IKUTI STYLE WARNA)

database yang sudah ada di supabase = 00_initial_schema.sql (MASIH MENTAH)


**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 3 · Supabase (Auth + Database + Storage) · `@supabase/ssr`

**Pola arsitektur:**
```
src/app/admin/xxx/page.tsx         ← Server Component (fetch data via createServerSupabase())
src/components/admin/AdminXxxClient.tsx ← Client Component (initialData props + mutasi via createBrowserClient())
src/proxy.ts                       ← Next.js 16 proxy, refresh session setiap request
src/lib/supabase.ts                ← createBrowserClient() (singleton) + createServerSupabase()
```

- **Server Component** menjalankan semua query utama, data dikirim sebagai props.
- **Client Component** hanya query saat mutasi (update/insert/delete) + `fetchData()` refresh.

### Supabase SSR — Optimasi Koneksi Database

Database Supabase free tier limit 60 koneksi **hanya untuk koneksi PostgreSQL langsung** (port 5432/6543). Project ini menggunakan `@supabase/supabase-js` (REST API via HTTPS/PostgREST) → **tidak kena limit 60 koneksi**. SSR tetap diimplementasikan demi performa & memory.

### Keamanan Database (RBAC)

- **RBAC**: tabel `roles` (`permission_ids`) + `permissions` (katalog `module.action`); `admin_users.role` = id role. Guard 3 lapis: page wrapper SSR (`guardAdminPage`), API route (`requirePermission`), client UI (`can()`). Lihat `AGENTS.md` §18 & `PLAN-RBAC.md`.
- RLS memakai `has_permission('<module>.<action>')` (SECURITY DEFINER; `superadmin` bypass). Helper legacy `is_superadmin()`/`is_admin()` (`add-rls-helper.sql`) tetap tersedia sebagai cadangan.
- Semua policy memakai role check, bukan `USING(true)`
- Fungsi dengan `SET search_path = 'public'` mencegah search path hijacking
- `cari_jamaah_publik` menggunakan `SECURITY INVOKER`
- **Self-service profil**: semua role bisa ubah nama sendiri via RPC `update_own_admin_profile` + password via `auth.updateUser` (tanpa alur lupa password). Policy UPDATE/INSERT/DELETE `admin_users` tetap `user.manage` (superadmin-only) untuk kelola user.


## Visual Style System
baca PRD.md

## Reusable Components
## Optimasi Gambar (next/image)
### Storage Bucket (kerapian & keamanan)
## Caching Strategy - NON ISR

## Env
NEXT_PUBLIC_SUPABASE_URL=https://rxqfngjcogakrnzzaago.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWZuZ2pjb2dha3JuenphYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3OTA0NjUsImV4cCI6MjEwMzM2NjQ2NX0.KqUUyEbQ_Qg_CDbLQZuywFg9F_h2DTK6W1YTr8UPE4s

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWZuZ2pjb2dha3JuenphYWdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc5MDQ2NSwiZXhwIjoyMTAzMzY2NDY1fQ.dP25ljf4rhkccDbBadexghMXnmEogYGmOldiAJPACF0

NEXT_PUBLIC_ADMIN_URL=https://baznas-bvd.vercel.app