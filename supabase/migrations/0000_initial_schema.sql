-- supabase/migrations/0000_initial_schema.sql
-- Combined schema for BAZNAS Boven Digoel (Public Content + RBAC/Admin)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. RBAC TABLES (Roles and Permissions)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.permissions (
    id TEXT PRIMARY KEY, -- e.g., 'berita.read'
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY, -- e.g., 'superadmin', 'editor'
    name TEXT NOT NULL,
    description TEXT,
    permission_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_system BOOLEAN NOT NULL DEFAULT FALSE
);

-- ----------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT REFERENCES public.roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy to allow authenticated users to select their own profile data (required for get_rbac_user)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select own profile" ON public.admin_users;
CREATE POLICY "Allow select own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 3. PUBLIC CONTENT TABLES (from 00_initial_schema.sql)
-- ----------------------------------------------------------------------------

-- Site Settings (for Footer, Navigation, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings: Public read" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Settings: Admin read/update" ON public.site_settings
  FOR ALL USING (public.has_permission('settings.read')) WITH CHECK (public.has_permission('settings.update'));


-- categories table for News and Programs
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'news' or 'program'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- news (Berita & Artikel)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    author_id UUID, -- References auth.users or team_members
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- programs
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- agendas
CREATE TABLE IF NOT EXISTS public.agendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    location TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;

-- documents (for Transparansi/Dokumen Publik)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    document_url TEXT NOT NULL, -- Supabase Storage URL
    type TEXT NOT NULL, -- 'laporan_penghimpunan', 'laporan_penyaluran', 'laporan_tahunan', 'dokumen_publik'
    year INT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- team_members (Pimpinan / Struktur Organisasi)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    sort_order INT,
    is_active BOOLEAN DEFAULT TRUE
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- contact_messages (Internal: Pengaduan/Konsultasi)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'konsultasi', 'pengaduan', 'umum'
    status TEXT DEFAULT 'new', -- new, in_progress, closed
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- 4. RBAC FUNCTIONS
-- ----------------------------------------------------------------------------

-- Helper function to check if the current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER -- IMPORTANT: runs with the definer's privileges (e.g., bypass RLS on roles/permissions tables)
AS $$
    -- Check if the user is authenticated and linked to a role
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

-- Function to return the RBAC user data (used by getRbacUser RPC)
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


-- ----------------------------------------------------------------------------
-- 5. APPLY RLS POLICIES USING has_permission()
-- ----------------------------------------------------------------------------

-- PUBLIC READ POLICIES (reusing old policies where needed)

-- categories
DROP POLICY IF EXISTS "Categories: Public read" ON public.categories;
CREATE POLICY "Categories: Public read" ON public.categories
  FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Categories: Admin CRUD" ON public.categories;
CREATE POLICY "Categories: Admin CRUD" ON public.categories
  FOR ALL USING (public.has_permission('categories.read')) WITH CHECK (public.has_permission('categories.create') OR public.has_permission('categories.update'));

-- news
DROP POLICY IF EXISTS "News: Public read published" ON public.news;
CREATE POLICY "News: Public read published" ON public.news
  FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "News: Admin CRUD" ON public.news;
CREATE POLICY "News: Admin CRUD" ON public.news
  FOR ALL USING (public.has_permission('berita.read')) WITH CHECK (public.has_permission('berita.create') OR public.has_permission('berita.update'));

-- programs
DROP POLICY IF EXISTS "Programs: Public read active" ON public.programs;
CREATE POLICY "Programs: Public read active" ON public.programs
  FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Programs: Admin CRUD" ON public.programs;
CREATE POLICY "Programs: Admin CRUD" ON public.programs
  FOR ALL USING (public.has_permission('program.read')) WITH CHECK (public.has_permission('program.create') OR public.has_permission('program.update'));

-- agendas
DROP POLICY IF EXISTS "Agendas: Public read public" ON public.agendas;
CREATE POLICY "Agendas: Public read public" ON public.agendas
  FOR SELECT USING (is_public = TRUE);
DROP POLICY IF EXISTS "Agendas: Admin CRUD" ON public.agendas;
CREATE POLICY "Agendas: Admin CRUD" ON public.agendas
  FOR ALL USING (public.has_permission('agenda.read')) WITH CHECK (public.has_permission('agenda.create') OR public.has_permission('agenda.update'));

-- documents
DROP POLICY IF EXISTS "Documents: Public read public" ON public.documents;
CREATE POLICY "Documents: Public read public" ON public.documents
  FOR SELECT USING (is_public = TRUE);
DROP POLICY IF EXISTS "Documents: Admin CRUD" ON public.documents;
CREATE POLICY "Documents: Admin CRUD" ON public.documents
  FOR ALL USING (public.has_permission('dokumentasi.read')) WITH CHECK (public.has_permission('dokumentasi.create') OR public.has_permission('dokumentasi.update'));

-- team_members
DROP POLICY IF EXISTS "Team Members: Public read" ON public.team_members;
CREATE POLICY "Team Members: Public read" ON public.team_members
  FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Team Members: Admin CRUD" ON public.team_members;
CREATE POLICY "Team Members: Admin CRUD" ON public.team_members
  FOR ALL USING (public.has_permission('team_members.read')) WITH CHECK (public.has_permission('team_members.create') OR public.has_permission('team_members.update'));

-- contact_messages (Public INSERT allowed, Admin READ/UPDATE/DELETE)
DROP POLICY IF EXISTS "Contact: Public insert" ON public.contact_messages;
CREATE POLICY "Contact: Public insert" ON public.contact_messages
  FOR INSERT TO authenticated WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Contact: Admin read/update/delete" ON public.contact_messages;
CREATE POLICY "Contact: Admin read/update/delete" ON public.contact_messages
  FOR ALL USING (public.has_permission('contact_messages.read')) WITH CHECK (public.has_permission('contact_messages.update') OR public.has_permission('contact_messages.delete'));


-- ----------------------------------------------------------------------------
-- 6. RBAC SEED DATA (from src/lib/rbac/constants.ts)
-- ----------------------------------------------------------------------------
-- Note: This is an example, the actual seeding should be done via a dedicated script or seed file
-- to handle the array type and large permission list. For simplicity in this migration,
-- we insert the system roles/permissions now.

INSERT INTO public.permissions (id, module, action, name) VALUES
('berita.create', 'berita', 'create', 'Berita & Artikel: Create'),
('berita.read', 'berita', 'read', 'Berita & Artikel: Read'),
('berita.update', 'berita', 'update', 'Berita & Artikel: Update'),
('berita.delete', 'berita', 'delete', 'Berita & Artikel: Delete'),
('program.create', 'program', 'create', 'Program: Create'),
('program.read', 'program', 'read', 'Program: Read'),
('program.update', 'program', 'update', 'Program: Update'),
('program.delete', 'program', 'delete', 'Program: Delete'),
('dokumentasi.create', 'dokumentasi', 'create', 'Transparansi & Dokumen: Create'),
('dokumentasi.read', 'dokumentasi', 'read', 'Transparansi & Dokumen: Read'),
('dokumentasi.update', 'dokumentasi', 'update', 'Transparansi & Dokumen: Update'),
('dokumentasi.delete', 'dokumentasi', 'delete', 'Transparansi & Dokumen: Delete'),
('agenda.create', 'agenda', 'create', 'Agenda: Create'),
('agenda.read', 'agenda', 'read', 'Agenda: Read'),
('agenda.update', 'agenda', 'update', 'Agenda: Update'),
('agenda.delete', 'agenda', 'delete', 'Agenda: Delete'),
('team_members.create', 'team_members', 'create', 'Pimpinan/Struktur: Create'),
('team_members.read', 'team_members', 'read', 'Pimpinan/Struktur: Read'),
('team_members.update', 'team_members', 'update', 'Pimpinan/Struktur: Update'),
('team_members.delete', 'team_members', 'delete', 'Pimpinan/Struktur: Delete'),
('contact_messages.read', 'contact_messages', 'read', 'Pesan Masuk (Kontak/Pengaduan): Read'),
('contact_messages.update', 'contact_messages', 'update', 'Pesan Masuk (Kontak/Pengaduan): Update'),
('contact_messages.delete', 'contact_messages', 'delete', 'Pesan Masuk (Kontak/Pengaduan): Delete'),
('settings.read', 'settings', 'read', 'Pengaturan Situs: Read'),
('settings.update', 'settings', 'update', 'Pengaturan Situs: Update'),
('user.manage', 'user', 'manage', 'Manajemen Pengguna: Manage'),
('role.manage', 'role', 'manage', 'Manajemen Role: Manage'),
('permission.manage', 'permission', 'manage', 'Katalog Permission: Manage')
ON CONFLICT (id) DO NOTHING;


-- Insert System Roles (Superadmin and Admin Read-only)
INSERT INTO public.roles (id, name, description, permission_ids, is_system) VALUES
('superadmin', 'Super Admin', 'Akses penuh ke semua modul, termasuk manajemen pengguna dan peran. Bypass RLS.', (SELECT ARRAY_AGG(id) FROM public.permissions), TRUE),
('admin', 'Admin', 'Akses read-only ke semua modul konten.', (SELECT ARRAY_AGG(id) FROM public.permissions WHERE action = 'read'), TRUE)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 7. TRIGGER FOR NEW AUTH USERS (auto-create entry in admin_users)
-- ----------------------------------------------------------------------------

-- This trigger ensures that when a new user signs up via auth.users, 
-- an entry is created in admin_users (initially with role 'admin' or NULL)
-- This is mainly for external sign-up flows (e.g., Google OAuth or public sign-up), 
-- but in this project, admin users should be invited/managed via user.manage permission.
-- We will only create a minimal trigger for future compatibility.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'admin')
  ON CONFLICT (id) DO NOTHING; -- Add ON CONFLICT for user creation trigger
  RETURN NEW;
END;
$$;

-- Create the trigger function
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Note: The initial 'superadmin' user must be manually added to admin_users after sign-up
-- or the trigger must be modified to check for a specific initial user email.


-- This trigger ensures that when a new user signs up via auth.users, 
-- an entry is created in admin_users (initially with role 'admin' or NULL)
-- This is mainly for external sign-up flows (e.g., Google OAuth or public sign-up), 
-- but in this project, admin users should be invited/managed via user.manage permission.
-- We will only create a minimal trigger for future compatibility.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'admin'); -- Default role 'admin' for initial setup
  RETURN NEW;
END;
$$;

-- Create the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Note: The initial 'superadmin' user must be manually added to admin_users after sign-up
-- or the trigger must be modified to check for a specific initial user email.
