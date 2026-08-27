-- database/seed.sql
-- Seed data for BAZNAS Boven Digoel Public Content Tables

-- Define UUIDs for consistent linking
-- NOTE: If your Supabase instance does not support \\set (like the web console), you must replace these variables with actual UUIDs generated manually.

-- CATEGORY UUIDS
\set uuid_kat_pendidikan '1a2b3c4d-5e6f-7080-90a0-b1c2d3e4f5a1'
\set uuid_kat_ekonomi '1a2b3c4d-5e6f-7080-90a0-b1c2d3e4f5a2'
\set uuid_kat_kemanusiaan '1a2b3c4d-5e6f-7080-90a0-b1c2d3e4f5a3'
\set uuid_kat_berita '1a2b3c4d-5e6f-7080-90a0-b1c2d3e4f5a4'

-- 1. Insert Categories
INSERT INTO categories (id, slug, name, type) VALUES
(:'uuid_kat_pendidikan', 'pendidikan', 'Pendidikan', 'program'),
(:'uuid_kat_ekonomi', 'ekonomi', 'Ekonomi', 'program'),
(:'uuid_kat_kemanusiaan', 'kemanusiaan', 'Kemanusiaan', 'program'),
(:'uuid_kat_berita', 'berita', 'Berita Utama', 'news');

-- 2. Insert Programs
INSERT INTO programs (id, slug, title, description, is_active, category_id) VALUES
(gen_random_uuid(), 'beasiswa-cahaya-papua', 'Beasiswa Cahaya Papua', 'Program beasiswa penuh untuk anak yatim dan dhuafa di Kabupaten Boven Digoel untuk jenjang SD hingga SMA.', TRUE, :'uuid_kat_pendidikan'),
(gen_random_uuid(), 'modal-usaha-mikro', 'Modal Usaha Produktif', 'Penyaluran modal usaha tanpa bunga bagi mustahik yang memiliki usaha mikro kecil (UMK) untuk meningkatkan kemandirian ekonomi.', TRUE, :'uuid_kat_ekonomi'),
(gen_random_uuid(), 'bantuan-bencana-alam', 'Bantuan Cepat Tanggap Bencana', 'Dana siaga dan logistik untuk respon cepat terhadap bencana alam lokal.', FALSE, :'uuid_kat_kemanusiaan'); -- FALSE to show draft state

-- 3. Insert News (using is_published = TRUE for public display)
INSERT INTO news (id, slug, title, content, is_published, category_id, published_at) VALUES
(gen_random_uuid(), 'baznas-salurkan-bantuan-logistik', 'BAZNAS Salurkan Bantuan Logistik ke Distrik Terpencil', '<p>BAZNAS Kabupaten Boven Digoel berhasil menyalurkan bantuan logistik berupa sembako dan pakaian layak pakai kepada 50 KK di Distrik X.</p><p>Kegiatan ini merupakan bagian dari program BAZNAS Tanggap Bencana.</p>', TRUE, :'uuid_kat_berita', NOW() - interval '2 days'),
(gen_random_uuid(), 'rapat-koordinasi-program-2027', 'Rapat Koordinasi Program Kerja 2027', '<p>Pimpinan BAZNAS Boven Digoel mengadakan rapat koordinasi untuk menyusun rencana kerja strategis tahun 2027.</p><p>Fokus utama adalah pada penguatan program ekonomi produktif.</p>', TRUE, :'uuid_kat_berita', NOW() - interval '1 day'),
(gen_random_uuid(), 'draft-peresmian-kantor', 'DRAFT: Peresmian Kantor Baru BAZNAS', '<p>Ini adalah konten draft yang belum final dan tidak boleh ditampilkan ke publik.</p>', FALSE, :'uuid_kat_berita', NOW());
