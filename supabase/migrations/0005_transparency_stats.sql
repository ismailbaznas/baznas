-- supabase/migrations/0005_transparency_stats.sql
-- Migration to support customizable financial and mustahik statistics with full CRUD capabilities

-- Create table for transparency stats
CREATE TABLE IF NOT EXISTS public.transparency_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    sub_label TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transparency_stats ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS "TransparencyStats: Public read" ON public.transparency_stats;
DROP POLICY IF EXISTS "TransparencyStats: Admin manage" ON public.transparency_stats;

-- POLICY 1: Allow public select access
CREATE POLICY "TransparencyStats: Public read" ON public.transparency_stats
    FOR SELECT 
    USING (TRUE);

-- POLICY 2: Allow authenticated admins with dokumentasi.update to fully manage transparency stats
CREATE POLICY "TransparencyStats: Admin manage" ON public.transparency_stats
    FOR ALL 
    TO authenticated 
    USING (
        public.has_permission('dokumentasi.read')
    ) 
    WITH CHECK (
        public.has_permission('dokumentasi.update')
    );

-- Seed initial financial statistics
INSERT INTO public.transparency_stats (key, label, value, sub_label)
VALUES 
    ('dana_dihimpun', 'Dana Dihimpun', 'Rp 2,45 Miliar', 'Tahun 2026'),
    ('dana_disalurkan', 'Dana Disalurkan', 'Rp 2,30 Miliar', 'Tahun 2026'),
    ('mustahik_terlayani', 'Mustahik Terlayani', '4.850 Jiwa', 'Tahun 2026')
ON CONFLICT (key) DO UPDATE 
SET 
    label = EXCLUDED.label,
    value = EXCLUDED.value,
    sub_label = EXCLUDED.sub_label;

-- Seed home page statistics (migrated from site_settings)
INSERT INTO public.transparency_stats (key, label, value, sub_label)
VALUES 
    ('home_stat_zis', 'Dana ZIS Terkumpul', 'Rp 2,4 Miliar', 'Beranda'),
    ('home_stat_muzaki', 'Muzaki Aktif', '1.250+', 'Beranda'),
    ('home_stat_mustahik', 'Penerima Manfaat', '4.800+', 'Beranda'),
    ('home_stat_program', 'Program Penyaluran', '12 Program', 'Beranda')
ON CONFLICT (key) DO UPDATE 
SET 
    label = EXCLUDED.label,
    value = EXCLUDED.value,
    sub_label = EXCLUDED.sub_label;
