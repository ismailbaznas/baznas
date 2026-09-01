-- ============================================================
-- 0010_storage_bucket_rls.sql
-- Konfigurasi Supabase Storage Bucket 'baznas' & RLS Restrict untuk roles, permissions, & storage
-- ============================================================

-- 1. Buat Bucket 'baznas' (Public Access) jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'baznas',
  'baznas',
  true,
  10485760, -- Limit 10MB per file
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'application/pdf'
  ];

-- 2. Kebijakan RLS Storage Objects (Catatan: RLS pada storage.objects sudah aktif secara default di Supabase,
--    sehingga DILARANG menjalankan `ALTER TABLE storage.objects` agar tidak memicu error ownership 42501)
DROP POLICY IF EXISTS "Public Read - baznas public folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage - baznas folders" ON storage.objects;

-- Kebijakan 1: Public Read untuk Seluruh Berkas di Folder 'public/' pada Bucket 'baznas'
CREATE POLICY "Public Read - baznas public folders" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'baznas' 
    AND (storage.foldername(name))[1] = 'public'
  );

-- Kebijakan 2: Admin Authenticated Manage (INSERT, UPDATE, DELETE, SELECT) pada Bucket 'baznas'
CREATE POLICY "Admin Manage - baznas folders" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'baznas'
  )
  WITH CHECK (
    bucket_id = 'baznas'
  );


-- ----------------------------------------------------------------------------
-- 3. PENGAMANAN & RESTRIKSI RLS UNTUK TABEL ROLES & PERMISSIONS
-- ----------------------------------------------------------------------------

-- A. Aktifkan RLS pada tabel roles & permissions
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- B. Kebijakan RLS untuk public.roles
DROP POLICY IF EXISTS "Roles: Public read" ON public.roles;
CREATE POLICY "Roles: Public read" ON public.roles 
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Roles: Admin manage" ON public.roles;
CREATE POLICY "Roles: Admin manage" ON public.roles 
  FOR ALL USING (public.has_permission('user.manage')) 
  WITH CHECK (public.has_permission('user.manage'));

-- C. Kebijakan RLS untuk public.permissions
DROP POLICY IF EXISTS "Permissions: Public read" ON public.permissions;
CREATE POLICY "Permissions: Public read" ON public.permissions 
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Permissions: Admin manage" ON public.permissions;
CREATE POLICY "Permissions: Admin manage" ON public.permissions 
  FOR ALL USING (public.has_permission('user.manage')) 
  WITH CHECK (public.has_permission('user.manage'));

-- D. Kebijakan RLS Tambahan untuk public.admin_users
DROP POLICY IF EXISTS "Admin Users: Admin manage" ON public.admin_users;
CREATE POLICY "Admin Users: Admin manage" ON public.admin_users
  FOR ALL USING (public.has_permission('user.manage'))
  WITH CHECK (public.has_permission('user.manage'));
