-- supabase/migrations/0006_home_hero_image.sql
-- Add image URL setting for homepage hero

-- Add the home_hero_imageurl key to site_settings with a default empty value
INSERT INTO public.site_settings (key, value, description)
VALUES (
    'home_hero_imageurl',
    '{"value": ""}'::jsonb,
    'Beranda: URL Gambar Hero'
)
ON CONFLICT (key) DO UPDATE 
SET description = EXCLUDED.description;
