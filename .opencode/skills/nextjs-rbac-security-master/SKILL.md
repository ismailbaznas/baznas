---
name: nextjs-rbac-security-master
description: Use when designing, auditing, implementing, or fixing Role-Based Access Control (RBAC), user authentication, OAuth PKCE flows, admin lockdown, guest user portal separation, and 3-layer security defense in Next.js (App Router) + Supabase fullstack web applications.
---

# 🛡️ NEXT.JS + SUPABASE RBAC & FULLSTACK SECURITY MASTER SKILL

Panduan arsitektur standar produksi dan SOP teknis untuk mengimplementasikan sistem **Role-Based Access Control (RBAC)** berstandar enterprise, pencegahan eskalasi hak akses (Privilege Escalation Prevention), pemisahan portal Pengguna/Tamu vs Admin CMS, dan arsitektur pengamanan 3-Lapis (*3-Layer Defense*).

---

## 🔒 1. ARSITEKTUR PERTAHANAN 3-LAPIS (3-LAYER DEFENSE)

Setiap aksi dan halaman administratif wajib dilindungi pada 3 titik independen:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. SERVER COMPONENT GUARD (Halaman / Routing)                          │
│ const user = await guardAdminPage("user.manage");                      │
├────────────────────────────────────────────────────────────────────────┤
│ 2. BACKEND API GUARD (Endpoints API Routes)                            │
│ const authCheck = await requirePermission("user.manage");              │
├────────────────────────────────────────────────────────────────────────┤
│ 3. CLIENT UI CONDITIONAL RENDERING (Tombol & Menu)                     │
│ <Can required="user.manage"><Button>Hapus User</Button></Can>          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 2. PEMISAHAN HAK AKSES: USER TAMU (MASYARAKAT) VS STAFF/ADMIN

### Aturan Emas Keamanan:
1. **Auto-Guest Default:** Pengguna yang mendaftar melalui Google OAuth atau form pendaftaran publik **TIDAK BOLEH** langsung diberi peran `admin`. Mereka berstatus **Tamu** (`role = null` atau `role = 'tamu'`).
2. **Admin Lockdown:** Seluruh rute `/admin/*` (termasuk layout dan dasbor) **WAJIB** memvalidasi `if (!user.role) redirect("/akun");`.
3. **Portal Khusus Pengguna (`/akun`):** Pengguna non-admin memiliki area mandiri untuk mengelola nama, kata sandi, melihat riwayat layanan, atau profil mereka sendiri tanpa akses ke dasbor admin.

```
┌───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Kategori Pengguna             │ Rute & Dashboard Tujuan          │ Batasan Akses               │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Tamu / Masyarakat Umum**    │ `/akun` (Portal Pengguna)        │ • Tidak bisa akses `/admin` │
│ (Login Google / Email Publik) │ • Kelola nama & password         │ • Akses layanan publik saja │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Staff / Pengurus / Amil**   │ `/admin` (Command Center)        │ • Akses modular sesuai role │
│ (`superadmin`, `admin`, dll)  │ • `/akun` (Profil Pribadi)       │ • Diberikan izin oleh Admin │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```

---

## ⚡ 3. DATABASE SCHEMA & RPC FUNCTION (POSTGRESQL)

### A. Tabel Utama
- `roles`: `id` (PK string), `name`, `description`, `permission_ids` (text[]), `is_system` (boolean).
- `permissions`: `id` (PK string, e.g. `'berita.create'`), `module`, `action`, `name`.
- `admin_users`: `id` (PK UUID, FK `auth.users`), `email`, `name`, `role` (FK `roles.id`), `last_active_at`.

### B. Security Definer RPC: `get_rbac_user`
```sql
CREATE OR REPLACE FUNCTION public.get_rbac_user(user_email TEXT)
RETURNS TABLE (
    name TEXT,
    role TEXT,
    permissions TEXT[]
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT
        au.name,
        au.role,
        r.permission_ids
    FROM
        public.admin_users au
    LEFT JOIN
        public.roles r ON au.role = r.id
    WHERE
        au.email = user_email;
$$;
```

---

## 🛠️ 4. SERVER-SIDE RBAC RESOLVER (`src/lib/rbac/server.ts`)

```typescript
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PermissionId, RBACUser } from "@/types/rbac";
import { createServerSupabase } from "../server-supabase";

export async function getRbacUser(): Promise<RBACUser | null> {
  const supabase = await createServerSupabase();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser || !authUser.email) return null;

  const { data: rbacData, error } = await supabase.rpc("get_rbac_user", {
    user_email: authUser.email,
  } as any);

  const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;

  if (error || !rbacData || (rbacData as any[]).length === 0) {
    // User authenticated as Guest (Tamu) - No Admin Role
    return {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || authUser.email,
      role: null,
      permissions: [],
      isSuperAdmin: false,
      avatar_url: avatarUrl,
    };
  }

  const user: any = rbacData[0];
  const isSuperAdmin = user.role === "superadmin";

  return {
    id: authUser.id,
    email: authUser.email,
    name: user.name || authUser.user_metadata?.full_name || authUser.email,
    role: user.role,
    permissions: user.permissions || [],
    isSuperAdmin: isSuperAdmin,
    avatar_url: avatarUrl,
  };
}

export async function guardAdminPage(requiredPermission: PermissionId): Promise<RBACUser> {
  const user = await getRbacUser();

  if (!user) redirect("/login");
  if (!user.role) redirect("/akun"); // Redirect Guest to user portal

  if (user.isSuperAdmin) return user;
  if (!user.permissions.includes(requiredPermission)) {
    redirect("/admin"); // Unauthorized for this specific module
  }

  return user;
}

export async function requirePermission(requiredPermission: PermissionId): Promise<RBACUser | NextResponse> {
  const user = await getRbacUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.role) return NextResponse.json({ error: "Forbidden: Guest user" }, { status: 403 });
  if (user.isSuperAdmin) return user;
  if (!user.permissions.includes(requiredPermission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
```

---

## 🔑 5. SUPERADMIN USER MANAGEMENT & RLS BYPASS

⚠️ **Masalah Umum:** Saat Super Admin membuka halaman kelola pengguna (`/admin/users`), pemanggilan `createServerSupabase()` diblokir oleh RLS pada tabel `admin_users`, sehingga pengguna lain tidak muncul.

### Solusi Standar:
Di dalam Server Component yang telah dilindungi oleh `await guardAdminPage("user.manage")`, gunakan **`createServiceRoleClient()`** untuk mengambil seluruh daftar pengguna:
```typescript
// src/app/admin/users/page.tsx
export default async function AdminUsersPage({ searchParams }: Props) {
  const user = await guardAdminPage("user.manage");
  
  // Gunakan Service Role di server yang terproteksi guard untuk bypass RLS
  const supabase = createServiceRoleClient();
  const { data: users, count } = await supabase
    .from("admin_users")
    .select("*, roles(name)", { count: "exact" })
    .order("created_at", { ascending: false });
    
  return <AdminUsersClient initialUsers={users || []} ... />;
}
```

---

## 🔄 6. CERDAS MENGARAHKAN (SMART AUTH REDIRECT)

### A. OAuth PKCE Callback (`/api/auth/callback`)
```typescript
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (explicitNext) return NextResponse.redirect(`${origin}${explicitNext}`);

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: rbacData } = await supabase.rpc("get_rbac_user", { user_email: user.email } as any);
        const role = rbacData && (rbacData as any[])[0]?.role;
        if (role) return NextResponse.redirect(`${origin}/admin`);
      }
      return NextResponse.redirect(`${origin}/akun`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=AuthFailed`);
}
```

### B. Navbar Dropdown Adaptif
- Jika `isAdmin` (`role !== null`): Tampilkan tombol **"Buka Panel Admin"** (`/admin`) dan **"Akun & Profil Saya"** (`/akun`).
- Jika `isGuest` (`role === null`): Tampilkan hanya **"Akun & Profil Saya"** (`/akun`).

---

## 🛡️ 7. CHECKLIST KEAMANAN PRA-DEPLOY

- [ ] Seluruh rute `/admin/*` memvalidasi keberadaan `user.role`.
- [ ] Pengguna Google OAuth baru tidak otomatis menjadi admin.
- [ ] Formulir publik (kontak/bantuan) mengirim data lewat backend API Route dengan Service Role, bukan direct insert anonim.
- [ ] Rute `/akun` dilindungi autentikasi dan memblokir crawling search engine via `/robots.txt` (`disallow: /akun`).
- [ ] API routes admin menggunakan `requirePermission()` atau `requireAnyPermission()`.
- [ ] `createServiceRoleClient()` **TIDAK PERNAH** diimpor ke file Client Component (`"use client"`).
- [ ] Proyek lulus kompilasi `npm run build` tanpa error.
