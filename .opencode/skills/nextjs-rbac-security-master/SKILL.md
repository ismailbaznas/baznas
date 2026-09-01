---
name: nextjs-rbac-security-master
description: Universal enterprise-grade standard for designing, auditing, implementing, and securing Role-Based Access Control (RBAC), OAuth PKCE authentication, Guest vs Admin isolation, granular RLS policies, Storage security, and 3-Layer Defense in any Next.js (App Router) + Supabase application.
---

# 🛡️ UNIVERSAL NEXT.JS + SUPABASE RBAC & FULLSTACK SECURITY MASTER

Panduan arsitektur standar produksi dan SOP teknis komprehensif untuk merancang, mengaudit, mengimplementasikan, dan mengamankan sistem **Role-Based Access Control (RBAC)** pada aplikasi web berbasis **Next.js (App Router)** dan **Supabase (Auth, PostgreSQL RLS, Storage)**.

---

## 🔒 1. ARSITEKTUR PERTAHANAN 3-LAPIS (3-LAYER DEFENSE)

Setiap entitas administratif dan aksi sensitif wajib dilindungi secara independen pada 3 lapisan:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LAPIS 1: SERVER COMPONENT GUARD (Page & Layout Navigation)             │
│ const user = await guardAdminPage("content.manage");                   │
├────────────────────────────────────────────────────────────────────────┤
│ LAPIS 2: BACKEND API ROUTE GUARD (Endpoints & Mutation)                │
│ const authCheck = await requirePermission("content.delete");           │
├────────────────────────────────────────────────────────────────────────┤
│ LAPIS 3: CLIENT UI CONDITIONAL RENDERING (Buttons, Actions & Navigation│
│ <Can required="content.delete"><Button>Hapus</Button></Can>            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 2. PEMISAHAN HAK AKSES: GUEST / TAMU VS STAFF / ADMIN

### Aturan Emas Pencegahan Eskalasi Hak Akses (Privilege Escalation Prevention):
1. **Auto-Guest Default:** Pengguna yang mendaftar melalui OAuth (Google/GitHub/dsb.) atau formulir registrasi publik **WAJIB** berstatus **Guest/Tamu (`role = NULL`)**. DILARANG memberikan default role `admin` pada database trigger atau signup handler.
2. **Admin Lockdown:** Seluruh rute administratif (`/admin/*`) wajib memvalidasi status peran:
   ```typescript
   if (!user || !user.role) {
     redirect("/akun"); // Alihkan pengguna umum ke portal profil mereka
   }
   ```
3. **Pemisahan Portal Mandiri (`/akun`):** Pengguna publik memiliki portal mandiri untuk mengelola profil, kata sandi, atau data layanan pribadi tanpa akses ke dashboard admin institusi.

```
┌───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Kategori Pengguna             │ Rute & Dashboard Tujuan          │ Batasan & Otoritas          │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Tamu / Masyarakat Umum**    │ `/akun` (Portal Pengguna)        │ • Akses data milik sendiri  │
│ (Login OAuth / Email Publik)  │ • Kelola Profil & Sandi Pribadi  │ • DILARANG akses `/admin`   │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ **Staff / Administrator**     │ `/admin` (Command Center)        │ • Akses modular sesuai role │
│ (`superadmin`, `editor`, dll) │ • `/akun` (Profil Pribadi)       │ • Diberikan izin oleh Admin │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```

---

## ⚡ 3. DATABASE SCHEMA & SECURITY DEFINER RPC (POSTGRESQL)

### A. Skema RBAC Standar
```sql
-- 1. Master Permissions
CREATE TABLE IF NOT EXISTS public.permissions (
    id TEXT PRIMARY KEY,          -- Format: 'module.action' (contoh: 'berita.create', 'user.manage')
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    name TEXT NOT NULL
);

-- 2. Master Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY,          -- Format slug: 'superadmin', 'editor', 'staff'
    name TEXT NOT NULL,
    description TEXT,
    permission_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_system BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. Mapping Pengguna Admin
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT REFERENCES public.roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);
```

### B. Security Definer RPC: `get_rbac_user` & `has_permission`
```sql
-- Function untuk validasi cepat di RLS PostgreSQL
CREATE OR REPLACE FUNCTION public.has_permission(permission_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users au
        JOIN public.roles r ON au.role = r.id
        WHERE au.id = auth.uid()
        AND (
            r.id = 'superadmin' OR -- Superadmin bypass
            permission_id = ANY(r.permission_ids)
        )
    );
$$;

-- Function untuk resolve sesi pengguna ke Server Component / API
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

### C. Trigger Auto-Guest (Aman dari Privilege Escalation)
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- User baru selalu berstatus Guest (role = NULL)
  INSERT INTO public.admin_users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), 
    NULL -- ROLE NULL = GUEST
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
```

---

## 🛡️ 4. ATURAN KEBIJAKAN RLS POSTGRESQL (IDEMPOTENT & GRANULAR CRUD)

DILARANG menggunakan satu policy umum `FOR ALL` tanpa memisahkan hak mutasi. Selalu gunakan policy granular:

```sql
-- Aktifkan RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. Public / Anon SELECT (Hanya data aktif/terbit)
DROP POLICY IF EXISTS "Posts: Public read published" ON public.posts;
CREATE POLICY "Posts: Public read published" ON public.posts
  FOR SELECT TO public
  USING (is_published = TRUE);

-- 2. Admin SELECT All (Termasuk draft)
DROP POLICY IF EXISTS "Posts: Admin read all" ON public.posts;
CREATE POLICY "Posts: Admin read all" ON public.posts
  FOR SELECT TO authenticated
  USING (public.has_permission('berita.read'));

-- 3. Admin INSERT
DROP POLICY IF EXISTS "Posts: Admin insert" ON public.posts;
CREATE POLICY "Posts: Admin insert" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_permission('berita.create'));

-- 4. Admin UPDATE
DROP POLICY IF EXISTS "Posts: Admin update" ON public.posts;
CREATE POLICY "Posts: Admin update" ON public.posts
  FOR UPDATE TO authenticated
  USING (public.has_permission('berita.update'))
  WITH CHECK (public.has_permission('berita.update'));

-- 5. Admin DELETE
DROP POLICY IF EXISTS "Posts: Admin delete" ON public.posts;
CREATE POLICY "Posts: Admin delete" ON public.posts
  FOR DELETE TO authenticated
  USING (public.has_permission('berita.delete'));
```

---

## 📦 5. SUPABASE STORAGE BUCKET SECURITY & RLS

### A. Struktur Folder Tersegmentasi
```text
bucket_name
 ├── public/           <── Public Read (Gambar konten, banner, PDF publik)
 │    ├── news/
 │    └── documents/
 └── admin/            <── Private / Protected (Laporan audit, dokumen internal)
      └── private/
```

### B. Idempotent Storage RLS Policies
*(Catatan: DILARANG menjalankan `ALTER TABLE storage.objects` di Supabase SQL Editor untuk mencegah error ownership 42501).*

```sql
DROP POLICY IF EXISTS "Public Read - storage public folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload - storage public folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Modify/Delete - storage folders" ON storage.objects;

-- 1. Public Read pada folder public/
CREATE POLICY "Public Read - storage public folders" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'my_bucket' 
    AND (storage.foldername(name))[1] = 'public'
  );

-- 2. Authenticated Upload dengan Permission Guard
CREATE POLICY "Admin Upload - storage public folders" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'my_bucket'
    AND (storage.foldername(name))[1] = 'public'
    AND (
      public.has_permission('berita.create')
      OR public.has_permission('settings.update')
    )
  );

-- 3. Authenticated Modify & Delete
CREATE POLICY "Admin Modify/Delete - storage folders" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'my_bucket'
    AND public.has_permission('berita.delete')
  )
  WITH CHECK (
    bucket_id = 'my_bucket'
    AND public.has_permission('berita.update')
  );
```

---

## 🛠️ 6. SERVER-SIDE RBAC RESOLVER (`src/lib/rbac/server.ts`)

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
    // Pengguna terautentikasi sebagai Guest (Tamu)
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
  if (!user.role) redirect("/akun"); // Kunci akses admin untuk pengguna tamu

  if (user.isSuperAdmin) return user;
  if (!user.permissions.includes(requiredPermission)) {
    redirect("/admin"); // Tidak memiliki hak akses modul ini
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

## 🔄 7. SMART AUTH REDIRECT & OAUTH PKCE FLOW

### Callback Handler (`/api/auth/callback/route.ts`):
```typescript
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server-supabase";

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
        // Staff/Admin langsung ke dashboard, Guest ke portal akun
        if (role) return NextResponse.redirect(`${origin}/admin`);
      }
      return NextResponse.redirect(`${origin}/akun`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=AuthFailed`);
}
```

---

## 🛡️ 8. CHECKLIST PRA-DEPLOY & AUDIT KEAMANAN LENGKAP

- [ ] **Akar Eskalasi Hak Akses Ditutup:** Trigger `handle_new_user()` menyetel `role = NULL`. Pengguna Google OAuth baru tidak otomatis menjadi admin.
- [ ] **Admin Lockdown:** Seluruh Server Component di `/admin/*` memvalidasi `if (!user.role) redirect("/akun")`.
- [ ] **RLS Seluruh Tabel:** Seluruh tabel PostgreSQL memiliki `ENABLE ROW LEVEL SECURITY` dengan kebijakan granular `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- [ ] **Service Role Terisolasi:** `createServiceRoleClient()` **HANYA** diimpor pada lingkungan Server (`src/app/api/*` atau Server Component terproteksi). **TIDAK PERNAH** berada di `"use client"`.
- [ ] **API Endpoint Terproteksi:** Seluruh mutasi API administratif memanggil `requirePermission()`.
- [ ] **Storage Hardened:** Folder public hanya bisa dibaca umum; upload/delete memerlukan izin autentikasi role terkait.
- [ ] **File Upload Sanity:** Validasi ukuran berkas, pembatasan MIME type, dan sanitasi nama file unik.
- [ ] **User Enumeration Ditutup:** Daftar pengguna sistem hanya dapat dibaca oleh pemegang izin `user.manage` (Superadmin).
- [ ] **Build Verifikasi:** Lulus kompilasi `npm run build` tanpa error tipe atau hidrasi.
