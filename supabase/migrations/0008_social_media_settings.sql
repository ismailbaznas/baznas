-- supabase/migrations/0008_social_media_settings.sql
-- Migration: Add social media URL settings to site_settings

-- Insert social media keys with default empty values
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('social_facebook', 
     '{"value": ""}'::jsonb,
     'Sosial: URL Facebook'),
    ('social_instagram', 
     '{"value": ""}'::jsonb,
     'Sosial: URL Instagram'),
    ('social_tiktok', 
     '{"value": ""}'::jsonb,
     'Sosial: URL TikTok')
ON CONFLICT (key) DO UPDATE 
SET 
    description = EXCLUDED.description;
