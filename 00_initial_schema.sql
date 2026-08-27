-- 00_initial_schema.sql
-- Minimum Viable Architecture for Public Content (PRD Section 37)

-- Ensure that the 'uuid-ossp' extension is enabled for gen_random_uuid() if not already done.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. categories table for News and Programs
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'news' or 'program'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for categories: public read
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone." ON public.categories
  FOR SELECT USING (TRUE);


-- 2. news (Berita & Artikel)
CREATE TABLE public.news (
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

-- RLS for news: public read of published content
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news are viewable by everyone." ON public.news
  FOR SELECT USING (is_published = TRUE);


-- 3. programs
CREATE TABLE public.programs (
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

-- RLS for programs: public read of active programs
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active programs are viewable by everyone." ON public.programs
  FOR SELECT USING (is_active = TRUE);


-- 4. agendas
CREATE TABLE public.agendas (
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

-- RLS for agendas: public read of public agendas
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public agendas are viewable by everyone." ON public.agendas
  FOR SELECT USING (is_public = TRUE);


-- 5. documents (for Transparansi/Dokumen Publik)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    document_url TEXT NOT NULL, -- Supabase Storage URL
    type TEXT NOT NULL, -- 'laporan_penghimpunan', 'laporan_penyaluran', 'laporan_tahunan', 'dokumen_publik'
    year INT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for documents: public read
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public documents are viewable by everyone." ON public.documents
  FOR SELECT USING (is_public = TRUE);


-- 6. team_members (Pimpinan / Struktur Organisasi)
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    sort_order INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- RLS for team_members: public read
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members are viewable by everyone." ON public.team_members
  FOR SELECT USING (TRUE);


-- 7. contact_messages (Internal: Pengaduan/Konsultasi)
CREATE TABLE public.contact_messages (
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

-- RLS for contact_messages: Admin Only (No public read/write)
-- Access will be managed via service_role_key in Server Actions/Functions.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to insert contact messages." ON public.contact_messages
  FOR INSERT TO authenticated WITH CHECK (TRUE);
-- Admin RLS will be added later when we implement role system.

-- Optional: Enable Realtime for all public tables (requires enabling Realtime for the schema in Supabase dashboard)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.news, public.programs, public.agendas, public.documents, public.team_members;
