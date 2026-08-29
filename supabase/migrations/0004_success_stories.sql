-- supabase/migrations/0004_success_stories.sql
-- Migration to support customizable homepage success stories with full CRUD capabilities

-- Create table for success stories
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_foto TEXT NOT NULL,
    badge_kategori TEXT NOT NULL DEFAULT 'ZAKAT YANG MENJADI HARAPAN',
    title TEXT NOT NULL DEFAULT 'Dari Zakat Menjadi Mandiri',
    author_info TEXT NOT NULL DEFAULT 'Ibu Maria — Mindiptana',
    quote TEXT NOT NULL,
    metric TEXT DEFAULT '+180%',
    metric_label TEXT DEFAULT 'Peningkatan Omzet',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS "SuccessStories: Public read" ON public.success_stories;
DROP POLICY IF EXISTS "SuccessStories: Admin manage" ON public.success_stories;

-- POLICY 1: Allow public select access
CREATE POLICY "SuccessStories: Public read" ON public.success_stories
    FOR SELECT 
    USING (TRUE);

-- POLICY 2: Allow authenticated admins with settings.update to fully manage success stories
CREATE POLICY "SuccessStories: Admin manage" ON public.success_stories
    FOR ALL 
    TO authenticated 
    USING (
        public.has_permission('settings.read')
    ) 
    WITH CHECK (
        public.has_permission('settings.update')
    );

-- Seed initial success story
INSERT INTO public.success_stories (url_foto, badge_kategori, title, author_info, quote, metric, metric_label, is_active)
VALUES 
    (
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlhgJw2DEnStUFnnkfWbBiKJU9SWKa5v6DNRL1aRwYAZyALOisIYW3J5xnR-Fnqya4sldxl3i2cygZw_OjGD7yDJ2fxEsK515LzrCyeIQ8Xae77kpJ-rBoeojDp_cCJb7O9wj4ABSnpiZA68IQNbyd7H_i7zw_v3VRtspM_TuCTQ_3_5b3nJhiRTKKOWGzXkDidk5UvjAsnMllvvbkPA2aq7dqFWPQcLV_zT6bxLcXBfETlo0dzjZV', 
        'ZAKAT YANG MENJADI HARAPAN', 
        'Dari Zakat Menjadi Mandiri', 
        'Ibu Maria — Mindiptana', 
        'Bantuan modal usaha dari BAZNAS membantu saya mengembangkan usaha anyaman dan sembako. Kini saya mampu menyekolahkan anak-anak dan menghidupi keluarga dengan layak.', 
        '+180%', 
        'Peningkatan Omzet', 
        TRUE
    )
ON CONFLICT DO NOTHING;
