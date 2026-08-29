-- supabase/migrations/0007_migrate_success_stories_to_site_settings.sql
-- Migration: Remove success_stories table and add story fields to site_settings

-- Step 1: Drop the success_stories table
DROP TABLE IF EXISTS public.success_stories CASCADE;

-- Step 2: Insert story fields into site_settings with default values
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('story_imageurl', 
     '{"value": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlhgJw2DEnStUFnnkfWbBiKJU9SWKa5v6DNRL1aRwYAZyALOisIYW3J5xnR-Fnqya4sldxl3i2cygZw_OjGD7yDJ2fxEsK515LzrCyeIQ8Xae77kpJ-rBoeojDp_cCJb7O9wj4ABSnpiZA68IQNbyd7H_i7zw_v3VRtspM_TuCTQ_3_5b3nJhiRTKKOWGzXkDidk5UvjAsnMllvvbkPA2aq7dqFWPQcLV_zT6bxLcXBfETlo0dzjZV"}'::jsonb,
     'Dampak: URL Foto Mustahik'),
    ('story_badge', 
     '{"value": "ZAKAT YANG MENJADI HARAPAN"}'::jsonb,
     'Dampak: Badge Kategori'),
    ('story_tittle', 
     '{"value": "Dari Zakat Menjadi Mandiri"}'::jsonb,
     'Dampak: Judul Cerita'),
    ('story_author', 
     '{"value": "Ibu Maria — Mindiptana"}'::jsonb,
     'Dampak: Nama & Lokasi Penulis/Mustahik'),
    ('story_quote', 
     '{"value": "Bantuan modal usaha dari BAZNAS membantu saya mengembangkan usaha anyaman dan sembako. Kini saya mampu menyekolahkan anak-anak dan menghidupi keluarga dengan layak."}'::jsonb,
     'Dampak: Kutipan Cerita'),
    ('story_metric', 
     '{"value": "+180%"}'::jsonb,
     'Dampak: Metrik Keberhasilan'),
    ('story_metric_label', 
     '{"value": "Peningkatan Omzet"}'::jsonb,
     'Dampak: Label Metrik'),
    ('story_is_active', 
     '{"value": "true"}'::jsonb,
     'Dampak: Status Aktif (true/false)')
ON CONFLICT (key) DO UPDATE 
SET 
    description = EXCLUDED.description;

-- Step 3: Clean up old impact_story_* keys from site_settings (replaced by story_*)
DELETE FROM public.site_settings 
WHERE key IN (
    'impact_story_title',
    'impact_story_name',
    'impact_story_location',
    'impact_story_quote',
    'impact_story_metric',
    'impact_story_metric_label'
);

-- Step 4: Clean up old home_stat_* keys from site_settings (moved to transparency_stats)
DELETE FROM public.site_settings 
WHERE key IN (
    'home_stat_zis',
    'home_stat_muzaki',
    'home_stat_mustahik',
    'home_stat_program'
);

-- Step 5: Clean up old bank_account_* keys from site_settings (moved to bank_accounts table)
DELETE FROM public.site_settings 
WHERE key IN (
    'bank_account_bsi',
    'bank_account_bri',
    'bank_account_bni',
    'bank_account_holder'
);
