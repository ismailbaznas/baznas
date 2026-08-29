-- supabase/migrations/0002_bank_accounts.sql
-- Migration to support dedicated bank accounts management with CRUD capabilities

-- Create table for bank accounts
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_bank TEXT NOT NULL,
    nomor_rekening TEXT NOT NULL,
    atas_nama TEXT NOT NULL,
    kategori TEXT DEFAULT 'Zakat', -- e.g. 'Zakat', 'Infak & Sedekah', 'Kemanusiaan', etc.
    status TEXT DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Clean old policies if any
DROP POLICY IF EXISTS "BankAccounts: Public read" ON public.bank_accounts;
DROP POLICY IF EXISTS "BankAccounts: Admin manage" ON public.bank_accounts;

-- POLICY 1: Allow public select access
CREATE POLICY "BankAccounts: Public read" ON public.bank_accounts
    FOR SELECT 
    USING (TRUE);

-- POLICY 2: Allow authenticated admins with settings.update to fully manage bank accounts
CREATE POLICY "BankAccounts: Admin manage" ON public.bank_accounts
    FOR ALL 
    TO authenticated 
    USING (
        public.has_permission('settings.read')
    ) 
    WITH CHECK (
        public.has_permission('settings.update')
    );

-- Seed default accounts
INSERT INTO public.bank_accounts (nama_bank, nomor_rekening, atas_nama, kategori, status)
VALUES 
    ('Bank Syariah Indonesia (BSI)', '7123456789', 'BAZNAS Kab Boven Digoel - Zakat', 'Zakat', 'active'),
    ('Bank Rakyat Indonesia (BRI)', '012301004567890', 'BAZNAS Kabupaten Boven Digoel', 'Infak & Sedekah', 'active'),
    ('Bank Negara Indonesia (BNI)', '0987654321', 'BAZNAS Kab Boven Digoel - Kemanusiaan', 'Kemanusiaan', 'active')
ON CONFLICT DO NOTHING;
