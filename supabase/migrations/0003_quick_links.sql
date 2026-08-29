-- supabase/migrations/0003_quick_links.sql
-- Migration to support customizable footer quick links with full CRUD capabilities

-- Create table for quick links
CREATE TABLE IF NOT EXISTS public.quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS "QuickLinks: Public read" ON public.quick_links;
DROP POLICY IF EXISTS "QuickLinks: Admin manage" ON public.quick_links;

-- POLICY 1: Allow public select access
CREATE POLICY "QuickLinks: Public read" ON public.quick_links
    FOR SELECT 
    USING (TRUE);

-- POLICY 2: Allow authenticated admins with settings.update to fully manage quick links
CREATE POLICY "QuickLinks: Admin manage" ON public.quick_links
    FOR ALL 
    TO authenticated 
    USING (
        public.has_permission('settings.read')
    ) 
    WITH CHECK (
        public.has_permission('settings.update')
    );

-- Seed initial links matching original footer links
INSERT INTO public.quick_links (label, url, sort_order, is_active)
VALUES 
    ('Tentang Kami', '/tentang', 1, TRUE),
    ('Program', '/program', 2, TRUE),
    ('Transparansi', '/transparansi', 3, TRUE),
    ('Layanan', '/layanan', 4, TRUE),
    ('Kabar', '/kabar', 5, TRUE),
    ('Kontak', '/kontak', 6, TRUE),
    ('Pengaduan', '/kontak', 7, TRUE)
ON CONFLICT DO NOTHING;
