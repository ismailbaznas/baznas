-- ============================================================================
-- 0012_create_homepage_view.sql
-- UNIFIED HOMEPAGE & FOOTER DATA VIEW (1 SINGLE DATABASE QUERY)
-- Mengagregasikan seluruh data Beranda & Footer dalam 1 baris JSON efisien.
-- ============================================================================

CREATE OR REPLACE VIEW public.view_homepage_data AS
SELECT
  -- 1. Berita Terbaru (3 item terbit + kategori)
  (
    SELECT COALESCE(jsonb_agg(n), '[]'::jsonb)
    FROM (
      SELECT 
        nw.id, 
        nw.title, 
        nw.slug, 
        nw.published_at, 
        nw.thumbnail_url,
        jsonb_build_object('name', c.name) AS categories
      FROM public.news nw
      LEFT JOIN public.categories c ON nw.category_id = c.id
      WHERE nw.is_published = TRUE
      ORDER BY nw.published_at DESC
      LIMIT 3
    ) n
  ) AS news,

  -- 2. Program Kerja Aktif (3 item + kategori)
  (
    SELECT COALESCE(jsonb_agg(p), '[]'::jsonb)
    FROM (
      SELECT 
        pr.id, 
        pr.title, 
        pr.slug, 
        pr.image_url, 
        pr.description,
        jsonb_build_object('name', c.name) AS categories
      FROM public.programs pr
      LEFT JOIN public.categories c ON pr.category_id = c.id
      WHERE pr.is_active = TRUE
      ORDER BY pr.created_at DESC
      LIMIT 3
    ) p
  ) AS programs,

  -- 3. Statistik Transparansi (Agregat key-value)
  (
    SELECT COALESCE(
      jsonb_object_agg(
        key, 
        jsonb_build_object(
          'label', label,
          'value', value,
          'sub_label', sub_label
        )
      ), 
      '{}'::jsonb
    )
    FROM public.transparency_stats
  ) AS transparency_stats,

  -- 4. Dokumen Transparansi Terbaru (3 item publik)
  (
    SELECT COALESCE(jsonb_agg(d), '[]'::jsonb)
    FROM (
      SELECT id, title, document_url, type, year
      FROM public.documents
      WHERE is_public = TRUE
      ORDER BY year DESC NULLS LAST, created_at DESC
      LIMIT 3
    ) d
  ) AS recent_documents,

  -- 5. Pengaturan Situs (Hero, Cerita Dampak, Kontak, Sosmed)
  (
    SELECT COALESCE(
      jsonb_object_agg(
        key, 
        CASE 
          WHEN jsonb_typeof(value) = 'string' THEN value #>> '{}' 
          ELSE value->>'value' 
        END
      ), 
      '{}'::jsonb
    )
    FROM public.site_settings
  ) AS settings,

  -- 6. Rekening Bank Resmi (Untuk Footer & Donasi)
  (
    SELECT COALESCE(jsonb_agg(ba), '[]'::jsonb)
    FROM (
      SELECT id, nama_bank, nomor_rekening, atas_nama, kategori 
      FROM public.bank_accounts 
      WHERE status = 'active' 
      ORDER BY created_at ASC
    ) ba
  ) AS bank_accounts,

  -- 7. Tautan Cepat Footer (Quick Links)
  (
    SELECT COALESCE(jsonb_agg(ql), '[]'::jsonb)
    FROM (
      SELECT id, label, url, sort_order 
      FROM public.quick_links 
      WHERE is_active = TRUE 
      ORDER BY sort_order ASC
    ) ql
  ) AS quick_links;

-- Berikan izin akses SELECT untuk publik dan pengguna terautentikasi
GRANT SELECT ON public.view_homepage_data TO anon, authenticated;
