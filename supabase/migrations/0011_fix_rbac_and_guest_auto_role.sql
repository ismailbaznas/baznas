-- ============================================================================
-- 0011_fix_rbac_and_guest_auto_role.sql
-- FULL IDEMPOTENT MIGRATION: RBAC, GUEST AUTO-ROLE, GRANULAR RLS & STORAGE
-- (Dapat dijalankan berulang kali di Supabase SQL Editor tanpa error)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PERBAIKAN TRIGGER AUTO-ROLE (PENCEGAHAN PRIVILEGE ESCALATION)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- User baru dari Google OAuth / Sign-up publik didaftarkan dengan role NULL (Tamu/Guest)
  -- Hak akses Staff / Admin HANYA dapat diberikan oleh Super Admin via menu /admin/users
  INSERT INTO public.admin_users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), 
    NULL -- ROLE NULL = GUEST / TAMU
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Pasang Trigger pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 2. TABEL ROLES, PERMISSIONS & ADMIN USERS
-- ----------------------------------------------------------------------------

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Roles: Public read" ON public.roles;
DROP POLICY IF EXISTS "Roles: Admin manage" ON public.roles;
CREATE POLICY "Roles: Public read" ON public.roles FOR SELECT USING (TRUE);
CREATE POLICY "Roles: Admin manage" ON public.roles FOR ALL TO authenticated 
  USING (public.has_permission('user.manage')) WITH CHECK (public.has_permission('user.manage'));

DROP POLICY IF EXISTS "Permissions: Public read" ON public.permissions;
DROP POLICY IF EXISTS "Permissions: Admin manage" ON public.permissions;
CREATE POLICY "Permissions: Public read" ON public.permissions FOR SELECT USING (TRUE);
CREATE POLICY "Permissions: Admin manage" ON public.permissions FOR ALL TO authenticated 
  USING (public.has_permission('user.manage')) WITH CHECK (public.has_permission('user.manage'));

DROP POLICY IF EXISTS "Allow select own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admin Users: Admin manage" ON public.admin_users;
CREATE POLICY "Allow select own profile" ON public.admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin Users: Admin manage" ON public.admin_users FOR ALL TO authenticated 
  USING (public.has_permission('user.manage')) WITH CHECK (public.has_permission('user.manage'));


-- ----------------------------------------------------------------------------
-- 3. TABEL KONTEN PUBLIK (NEWS, PROGRAMS, CATEGORIES, AGENDAS, DOCUMENTS, TEAM)
-- ----------------------------------------------------------------------------

-- ==================== NEWS ====================
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "News: Public read published" ON public.news;
DROP POLICY IF EXISTS "News: Admin CRUD" ON public.news;
DROP POLICY IF EXISTS "News: Admin read all" ON public.news;
DROP POLICY IF EXISTS "News: Admin insert" ON public.news;
DROP POLICY IF EXISTS "News: Admin update" ON public.news;
DROP POLICY IF EXISTS "News: Admin delete" ON public.news;

CREATE POLICY "News: Public read published" ON public.news FOR SELECT TO public USING (is_published = TRUE);
CREATE POLICY "News: Admin read all" ON public.news FOR SELECT TO authenticated USING (public.has_permission('berita.read'));
CREATE POLICY "News: Admin insert" ON public.news FOR INSERT TO authenticated WITH CHECK (public.has_permission('berita.create'));
CREATE POLICY "News: Admin update" ON public.news FOR UPDATE TO authenticated USING (public.has_permission('berita.update')) WITH CHECK (public.has_permission('berita.update'));
CREATE POLICY "News: Admin delete" ON public.news FOR DELETE TO authenticated USING (public.has_permission('berita.delete'));

-- ==================== PROGRAMS ====================
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Programs: Public read active" ON public.programs;
DROP POLICY IF EXISTS "Programs: Admin CRUD" ON public.programs;
DROP POLICY IF EXISTS "Programs: Admin read all" ON public.programs;
DROP POLICY IF EXISTS "Programs: Admin insert" ON public.programs;
DROP POLICY IF EXISTS "Programs: Admin update" ON public.programs;
DROP POLICY IF EXISTS "Programs: Admin delete" ON public.programs;

CREATE POLICY "Programs: Public read active" ON public.programs FOR SELECT TO public USING (is_active = TRUE);
CREATE POLICY "Programs: Admin read all" ON public.programs FOR SELECT TO authenticated USING (public.has_permission('program.read'));
CREATE POLICY "Programs: Admin insert" ON public.programs FOR INSERT TO authenticated WITH CHECK (public.has_permission('program.create'));
CREATE POLICY "Programs: Admin update" ON public.programs FOR UPDATE TO authenticated USING (public.has_permission('program.update')) WITH CHECK (public.has_permission('program.update'));
CREATE POLICY "Programs: Admin delete" ON public.programs FOR DELETE TO authenticated USING (public.has_permission('program.delete'));

-- ==================== CATEGORIES ====================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories: Public read" ON public.categories;
DROP POLICY IF EXISTS "Categories: Admin CRUD" ON public.categories;
DROP POLICY IF EXISTS "Categories: Admin insert" ON public.categories;
DROP POLICY IF EXISTS "Categories: Admin update" ON public.categories;
DROP POLICY IF EXISTS "Categories: Admin delete" ON public.categories;

CREATE POLICY "Categories: Public read" ON public.categories FOR SELECT TO public USING (TRUE);
CREATE POLICY "Categories: Admin insert" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_permission('categories.create'));
CREATE POLICY "Categories: Admin update" ON public.categories FOR UPDATE TO authenticated USING (public.has_permission('categories.update')) WITH CHECK (public.has_permission('categories.update'));
CREATE POLICY "Categories: Admin delete" ON public.categories FOR DELETE TO authenticated USING (public.has_permission('categories.delete'));

-- ==================== AGENDAS ====================
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agendas: Public read public" ON public.agendas;
DROP POLICY IF EXISTS "Agendas: Admin CRUD" ON public.agendas;
DROP POLICY IF EXISTS "Agendas: Admin read all" ON public.agendas;
DROP POLICY IF EXISTS "Agendas: Admin insert" ON public.agendas;
DROP POLICY IF EXISTS "Agendas: Admin update" ON public.agendas;
DROP POLICY IF EXISTS "Agendas: Admin delete" ON public.agendas;

CREATE POLICY "Agendas: Public read public" ON public.agendas FOR SELECT TO public USING (is_public = TRUE);
CREATE POLICY "Agendas: Admin read all" ON public.agendas FOR SELECT TO authenticated USING (public.has_permission('agenda.read'));
CREATE POLICY "Agendas: Admin insert" ON public.agendas FOR INSERT TO authenticated WITH CHECK (public.has_permission('agenda.create'));
CREATE POLICY "Agendas: Admin update" ON public.agendas FOR UPDATE TO authenticated USING (public.has_permission('agenda.update')) WITH CHECK (public.has_permission('agenda.update'));
CREATE POLICY "Agendas: Admin delete" ON public.agendas FOR DELETE TO authenticated USING (public.has_permission('agenda.delete'));

-- ==================== DOCUMENTS ====================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Documents: Public read public" ON public.documents;
DROP POLICY IF EXISTS "Documents: Admin CRUD" ON public.documents;
DROP POLICY IF EXISTS "Documents: Admin read all" ON public.documents;
DROP POLICY IF EXISTS "Documents: Admin insert" ON public.documents;
DROP POLICY IF EXISTS "Documents: Admin update" ON public.documents;
DROP POLICY IF EXISTS "Documents: Admin delete" ON public.documents;

CREATE POLICY "Documents: Public read public" ON public.documents FOR SELECT TO public USING (is_public = TRUE);
CREATE POLICY "Documents: Admin read all" ON public.documents FOR SELECT TO authenticated USING (public.has_permission('dokumentasi.read'));
CREATE POLICY "Documents: Admin insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.has_permission('dokumentasi.create'));
CREATE POLICY "Documents: Admin update" ON public.documents FOR UPDATE TO authenticated USING (public.has_permission('dokumentasi.update')) WITH CHECK (public.has_permission('dokumentasi.update'));
CREATE POLICY "Documents: Admin delete" ON public.documents FOR DELETE TO authenticated USING (public.has_permission('dokumentasi.delete'));

-- ==================== TEAM MEMBERS ====================
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Team Members: Public read" ON public.team_members;
DROP POLICY IF EXISTS "Team Members: Admin CRUD" ON public.team_members;
DROP POLICY IF EXISTS "Team Members: Admin insert" ON public.team_members;
DROP POLICY IF EXISTS "Team Members: Admin update" ON public.team_members;
DROP POLICY IF EXISTS "Team Members: Admin delete" ON public.team_members;

CREATE POLICY "Team Members: Public read" ON public.team_members FOR SELECT TO public USING (TRUE);
CREATE POLICY "Team Members: Admin insert" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_permission('team_members.create'));
CREATE POLICY "Team Members: Admin update" ON public.team_members FOR UPDATE TO authenticated USING (public.has_permission('team_members.update')) WITH CHECK (public.has_permission('team_members.update'));
CREATE POLICY "Team Members: Admin delete" ON public.team_members FOR DELETE TO authenticated USING (public.has_permission('team_members.delete'));


-- ----------------------------------------------------------------------------
-- 4. PENGATURAN, REKENING, QUICK LINKS & STATISTIK
-- ----------------------------------------------------------------------------

-- ==================== SITE SETTINGS ====================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Settings: Public read" ON public.site_settings;
DROP POLICY IF EXISTS "Settings: Admin read/update" ON public.site_settings;
DROP POLICY IF EXISTS "Settings: Admin update" ON public.site_settings;
DROP POLICY IF EXISTS "Settings: Admin insert" ON public.site_settings;

CREATE POLICY "Settings: Public read" ON public.site_settings FOR SELECT TO public USING (TRUE);
CREATE POLICY "Settings: Admin update" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_permission('settings.update')) WITH CHECK (public.has_permission('settings.update'));
CREATE POLICY "Settings: Admin insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_permission('settings.update'));

-- ==================== BANK ACCOUNTS ====================
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "BankAccounts: Public read" ON public.bank_accounts;
DROP POLICY IF EXISTS "BankAccounts: Admin manage" ON public.bank_accounts;
DROP POLICY IF EXISTS "BankAccounts: Admin insert" ON public.bank_accounts;
DROP POLICY IF EXISTS "BankAccounts: Admin update" ON public.bank_accounts;
DROP POLICY IF EXISTS "BankAccounts: Admin delete" ON public.bank_accounts;

CREATE POLICY "BankAccounts: Public read" ON public.bank_accounts FOR SELECT TO public USING (TRUE);
CREATE POLICY "BankAccounts: Admin insert" ON public.bank_accounts FOR INSERT TO authenticated WITH CHECK (public.has_permission('settings.update'));
CREATE POLICY "BankAccounts: Admin update" ON public.bank_accounts FOR UPDATE TO authenticated USING (public.has_permission('settings.update')) WITH CHECK (public.has_permission('settings.update'));
CREATE POLICY "BankAccounts: Admin delete" ON public.bank_accounts FOR DELETE TO authenticated USING (public.has_permission('settings.update'));

-- ==================== QUICK LINKS ====================
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "QuickLinks: Public read" ON public.quick_links;
DROP POLICY IF EXISTS "QuickLinks: Admin manage" ON public.quick_links;
DROP POLICY IF EXISTS "QuickLinks: Admin insert" ON public.quick_links;
DROP POLICY IF EXISTS "QuickLinks: Admin update" ON public.quick_links;
DROP POLICY IF EXISTS "QuickLinks: Admin delete" ON public.quick_links;

CREATE POLICY "QuickLinks: Public read" ON public.quick_links FOR SELECT TO public USING (TRUE);
CREATE POLICY "QuickLinks: Admin insert" ON public.quick_links FOR INSERT TO authenticated WITH CHECK (public.has_permission('settings.update'));
CREATE POLICY "QuickLinks: Admin update" ON public.quick_links FOR UPDATE TO authenticated USING (public.has_permission('settings.update')) WITH CHECK (public.has_permission('settings.update'));
CREATE POLICY "QuickLinks: Admin delete" ON public.quick_links FOR DELETE TO authenticated USING (public.has_permission('settings.update'));

-- ==================== TRANSPARENCY STATS ====================
ALTER TABLE public.transparency_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "TransparencyStats: Public read" ON public.transparency_stats;
DROP POLICY IF EXISTS "TransparencyStats: Admin manage" ON public.transparency_stats;
DROP POLICY IF EXISTS "TransparencyStats: Admin insert" ON public.transparency_stats;
DROP POLICY IF EXISTS "TransparencyStats: Admin update" ON public.transparency_stats;
DROP POLICY IF EXISTS "TransparencyStats: Admin delete" ON public.transparency_stats;

CREATE POLICY "TransparencyStats: Public read" ON public.transparency_stats FOR SELECT TO public USING (TRUE);
CREATE POLICY "TransparencyStats: Admin insert" ON public.transparency_stats FOR INSERT TO authenticated WITH CHECK (public.has_permission('dokumentasi.update'));
CREATE POLICY "TransparencyStats: Admin update" ON public.transparency_stats FOR UPDATE TO authenticated USING (public.has_permission('dokumentasi.update')) WITH CHECK (public.has_permission('dokumentasi.update'));
CREATE POLICY "TransparencyStats: Admin delete" ON public.transparency_stats FOR DELETE TO authenticated USING (public.has_permission('dokumentasi.update'));


-- ----------------------------------------------------------------------------
-- 5. PESAN MASUK & PERMOHONAN MUSTAHIK (SECURE INBOX)
-- ----------------------------------------------------------------------------

-- ==================== CONTACT MESSAGES ====================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Contact: Public insert" ON public.contact_messages;
DROP POLICY IF EXISTS "Contact: Admin read/update/delete" ON public.contact_messages;
DROP POLICY IF EXISTS "Contact: Admin read" ON public.contact_messages;
DROP POLICY IF EXISTS "Contact: Admin update" ON public.contact_messages;
DROP POLICY IF EXISTS "Contact: Admin delete" ON public.contact_messages;

CREATE POLICY "Contact: Admin read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_permission('contact_messages.read'));
CREATE POLICY "Contact: Admin update" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_permission('contact_messages.update')) WITH CHECK (public.has_permission('contact_messages.update'));
CREATE POLICY "Contact: Admin delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_permission('contact_messages.delete'));

-- ==================== MUSTAHIK APPLICATIONS ====================
ALTER TABLE public.mustahik_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Mustahik: Public insert" ON public.mustahik_applications;
DROP POLICY IF EXISTS "Mustahik: Admin manage" ON public.mustahik_applications;
DROP POLICY IF EXISTS "Mustahik: Admin read" ON public.mustahik_applications;
DROP POLICY IF EXISTS "Mustahik: Admin update" ON public.mustahik_applications;
DROP POLICY IF EXISTS "Mustahik: Admin delete" ON public.mustahik_applications;

CREATE POLICY "Mustahik: Admin read" ON public.mustahik_applications FOR SELECT TO authenticated USING (public.has_permission('contact_messages.read'));
CREATE POLICY "Mustahik: Admin update" ON public.mustahik_applications FOR UPDATE TO authenticated USING (public.has_permission('contact_messages.update')) WITH CHECK (public.has_permission('contact_messages.update'));
CREATE POLICY "Mustahik: Admin delete" ON public.mustahik_applications FOR DELETE TO authenticated USING (public.has_permission('contact_messages.delete'));


-- ----------------------------------------------------------------------------
-- 6. STORAGE BUCKET 'baznas' RLS HARDENING
-- ----------------------------------------------------------------------------

-- A. Buat / Pastikan Bucket 'baznas' Ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'baznas',
  'baznas',
  true,
  10485760, -- 10MB limit
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

-- B. Drop semua policy lama pada storage.objects secara eksplisit
DROP POLICY IF EXISTS "Public Read - baznas public folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage - baznas folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload - baznas public folders" ON storage.objects;
DROP POLICY IF EXISTS "Admin Modify/Delete - baznas folders" ON storage.objects;

-- C. KEBIJAKAN 1: Public Read untuk seluruh file di folder 'public/'
CREATE POLICY "Public Read - baznas public folders" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'baznas' 
    AND (storage.foldername(name))[1] = 'public'
  );

-- D. KEBIJAKAN 2: Upload (INSERT) hanya untuk admin berwenang
CREATE POLICY "Admin Upload - baznas public folders" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'baznas'
    AND (storage.foldername(name))[1] = 'public'
    AND (
      public.has_permission('berita.create')
      OR public.has_permission('program.create')
      OR public.has_permission('team_members.create')
      OR public.has_permission('dokumentasi.create')
      OR public.has_permission('settings.update')
    )
  );

-- E. KEBIJAKAN 3: Modify & Delete (UPDATE/DELETE) hanya untuk admin berwenang
CREATE POLICY "Admin Modify/Delete - baznas folders" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'baznas'
    AND (
      public.has_permission('berita.delete')
      OR public.has_permission('program.delete')
      OR public.has_permission('team_members.delete')
      OR public.has_permission('dokumentasi.delete')
      OR public.has_permission('settings.update')
    )
  )
  WITH CHECK (
    bucket_id = 'baznas'
    AND (
      public.has_permission('berita.update')
      OR public.has_permission('program.update')
      OR public.has_permission('team_members.update')
      OR public.has_permission('dokumentasi.update')
      OR public.has_permission('settings.update')
    )
  );
