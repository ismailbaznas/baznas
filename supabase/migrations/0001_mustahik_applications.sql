-- supabase/migrations/0001_mustahik_applications.sql
-- Migration to support mustahik (assistance) applications management

-- Create table for mustahik applications
CREATE TABLE IF NOT EXISTS public.mustahik_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    nik TEXT NOT NULL,
    district TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL, -- 'kesehatan', 'pendidikan', 'ekonomi', 'sosial', 'keagamaan'
    notes TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'verified', 'rejected', 'done'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mustahik_applications ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS "Mustahik: Public insert" ON public.mustahik_applications;
DROP POLICY IF EXISTS "Mustahik: Admin manage" ON public.mustahik_applications;

-- POLICY 1: Allow any public anonymous/authenticated user to submit application
CREATE POLICY "Mustahik: Public insert" ON public.mustahik_applications
    FOR INSERT 
    WITH CHECK (TRUE);

-- POLICY 2: Allow authenticated admin users with contact_messages.read/update permission to read and manage applications
CREATE POLICY "Mustahik: Admin manage" ON public.mustahik_applications
    FOR ALL 
    TO authenticated 
    USING (
        public.has_permission('contact_messages.read')
    ) 
    WITH CHECK (
        public.has_permission('contact_messages.update')
    );
