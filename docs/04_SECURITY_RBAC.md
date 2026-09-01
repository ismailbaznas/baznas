# 🛡️ KEAMANAN, OTENTIKASI & RBAC (3-LAYER DEFENSE)
*Acuan teknis khusus untuk kontrol akses berbasis peran (RBAC), otentikasi Google OAuth PKCE, dan keamanan API.*

---

## 1. SISTEM PERTAHANAN 3 LAPIS (3-LAYER DEFENSE)

Sistem admin BAZNAS Boven Digoel dilindungi oleh 3 lapis pengamanan hak akses:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LAPIS 1: SERVER COMPONENT GUARD (Halaman Admin)                        │
│ const user = await guardAdminPage("berita.read");                      │
├────────────────────────────────────────────────────────────────────────┤
│ LAPIS 2: API ROUTE GUARD (Endpoint Backend)                            │
│ const user = await requirePermission("berita.delete");                 │
├────────────────────────────────────────────────────────────────────────┤
│ LAPIS 3: CLIENT UI GUARD (Tombol & Menu)                               │
│ <Can do="berita.delete"><Button>Hapus</Button></Can>                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PENGGUNAAN GUARD DALAM KODE

### A. Lapis 1: Server Component Guard (`page.tsx`)
```tsx
import { guardAdminPage } from "@/lib/rbac/server";

export default async function AdminBeritaPage() {
  // Jika tidak punya permission 'berita.read', otomatis redirect ke /admin
  const user = await guardAdminPage("berita.read");
  ...
}
```

### B. Lapis 2: API Route Guard (`route.ts`)
```tsx
import { requirePermission } from "@/lib/rbac/server";

export async function DELETE(request: Request) {
  const user = await requirePermission("berita.delete");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  ...
}
```

### C. Lapis 3: Client Component Rendering (`Can.tsx`)
```tsx
import { Can } from "@/components/rbac/Can";
import { useAdmin } from "@/lib/admin-context";

// Opsi 1: Menggunakan Wrapper Komponen
<Can do="berita.create">
  <Button onClick={handleCreate}>Tambah Berita</Button>
</Can>

// Opsi 2: Menggunakan Hook
const { can } = useAdmin();
if (can("berita.delete")) { ... }
```

---

## 3. ALUR OTENTIKASI GOOGLE OAUTH & PKCE FLOW

1. **Inisiasi Login:** Browser memanggil `supabase.auth.signInWithOAuth()` dengan `redirectTo: `${window.location.origin}/api/auth/callback``.
2. **Server-Side Token Exchange:** Supabase mengarahkan kembali ke API Route `src/app/api/auth/callback/route.ts`.
3. **Session Cookie Sync:** API route menukar `code` menjadi session via `exchangeCodeForSession(code)` dan menulis HTTP-Only Cookie sebelum melakukan pengalihan `303 Redirect` ke `/admin`.
4. **Session Refresh via Proxy (`src/proxy.ts`):** `src/proxy.ts` memantau rute `/admin/*` dan menyegarkan token kedaluwarsa di latar belakang secara transparan.

---

## 4. KEAMANAN SUBMISI FORMULIR PUBLIK

Formulir pesan kontak (`/kontak`) dan permohonan mustahik (`/layanan`) **DILARANG** melakukan direct insert dari browser klien publik. Seluruh kiriman wajib melalui API Route khusus:
* `/api/contact` ➔ Melakukan validasi input, sanitasi string, dan insert via Service Role Client.
* `/api/mustahik` ➔ Memvalidasi NIK, nama, distrik, dan nomor telepon sebelum menyimpan data ke `mustahik_applications`.

---

## 5. PEMISAHAN HAK AKSES: USER TAMU (MASYARAKAT) VS ADMINISTRATOR

```
┌───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Kategori Pengguna             │ Rute & Dashboard Tujuan          │ Batasan Akses               │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Tamu / Masyarakat Umum**    │ `/akun` (Portal Pengguna)        │ • Tidak bisa akses `/admin` │
│ (Login Google / Email Baru)   │ • Kelola nama lengkap            │ • Akses layanan publik saja │
│                               │ • Ganti kata sandi               │                             │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Staff / Pengurus / Amil**   │ `/admin` (Command Center)        │ • Akses modular sesuai role │
│ (`superadmin`, `admin`, dll)  │ • `/akun` (Profil Pribadi)       │ • Diberikan izin oleh Admin │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```

1. **Auto-Guest Boundary:** Pengguna yang mendaftar secara mandiri melalui Google OAuth atau email publik tanpa penugasan peran dari administrator otomatis berstatus **Tamu** (`role = null`).
2. **Admin Lockdown:** Seluruh rute `/admin/*` memvalidasi `if (!user.role) redirect("/akun");` untuk mencegah kebocoran panel kontrol ke publik.
3. **Superadmin Visibility:** Halaman `/admin/users` menggunakan `createServiceRoleClient()` setelah melewati guard `guardAdminPage("user.manage")` agar Super Admin dapat melihat seluruh daftar pengguna dan menetapkan peran secara akurat tanpa terhalang RLS PostgREST.
