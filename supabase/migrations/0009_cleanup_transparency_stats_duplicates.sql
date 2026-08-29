-- ============================================================
-- 0009_cleanup_transparency_stats_duplicates.sql
-- Hapus duplikat key & migrasi nilai home_stat_* ke key standar
-- ============================================================

-- 1. Migrasi nilai lama ke key standar (jika home_stat_* punya data)
-- home_stat_zis -> dana_dihimpun
UPDATE transparency_stats
SET label = 'Dana Dihimpun', sub_label = COALESCE(NULLIF(sub_label, ''), 'Tahun 2026')
WHERE key = 'home_stat_zis'
  AND NOT EXISTS (SELECT 1 FROM transparency_stats WHERE key = 'dana_dihimpun');

-- home_stat_mustahik -> mustahik_terlayani
UPDATE transparency_stats
SET label = 'Mustahik Terlayani'
WHERE key = 'home_stat_mustahik'
  AND NOT EXISTS (SELECT 1 FROM transparency_stats WHERE key = 'mustahik_terlayani');

-- 2. Hapus duplikat
DELETE FROM transparency_stats WHERE key IN ('home_stat_zis', 'home_stat_mustahik');

-- 3. Pastikan key homepage stats lengkap (insert jika belum ada)
INSERT INTO transparency_stats (key, label, value, sub_label)
SELECT 'dana_dihimpun', 'Dana Dihimpun', 'Rp 2,4 Miliar', 'Tahun 2026'
WHERE NOT EXISTS (SELECT 1 FROM transparency_stats WHERE key = 'dana_dihimpun');

INSERT INTO transparency_stats (key, label, value, sub_label)
SELECT 'mustahik_terlayani', 'Mustahik Terlayani', '4.800+', 'Tahun 2026'
WHERE NOT EXISTS (SELECT 1 FROM transparency_stats WHERE key = 'mustahik_terlayani');

INSERT INTO transparency_stats (key, label, value, sub_label)
SELECT 'dana_disalurkan', 'Dana Disalurkan', 'Rp 2,3 Miliar', 'Tahun 2026'
WHERE NOT EXISTS (SELECT 1 FROM transparency_stats WHERE key = 'dana_disalurkan');

-- 4. Catatan: home_stat_muzaki & home_stat_program disimpan di site_settings
-- (bukan transparency_stats), lihat migration 0005.
-- ============================================================
