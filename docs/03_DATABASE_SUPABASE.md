# 🗄️ STRUKTUR DATABASE, SKEMA & SUPABASE POSTGREST
*Acuan teknis khusus untuk skema database, migrasi, kamus key `site_settings`, kueri PostgREST, dan tipe TypeScript.*

---

## 1. DAFTAR TABEL & FUNGSINYA

| Nama Tabel | Deskripsi & Isi Data | Keterangan Akses |
|:---|:---|:---|
| `news` | Artikel, kabar berita, penyaluran ZIS, pengumuman | Publik Read, Admin Full |
| `categories` | Kategori berita & program kerja | Publik Read, Admin Full |
| `programs` | Program kerja 5 pilar (Sehat, Cerdas, Mandiri, Peduli, Taqwa) | Publik Read, Admin Full |
| `documents` | Laporan tahunan, keuangan, penyaluran, SK (PDF) | Publik Read (`is_public=true`), Admin Full |
| `agendas` | Agenda kegiatan & jadwal pimpinan | Admin Full |
| `contact_messages` | Pesan & aspirasi masyarakat yang dikirim lewat `/kontak` | Insert via API Route, Admin Read/Update/Delete |
| `mustahik_applications` | Formulir permohonan bantuan mustahik lewat `/layanan` | Insert via API Route, Admin Read/Update/Delete |
| `team_members` | Profil pimpinan & amil BAZNAS | Publik Read (`is_active=true`), Admin Full |
| `bank_accounts` | Rekening bank resmi pengumpulan ZIS | Publik Read (`status='active'`), Admin Full |
| `quick_links` | Tautan navigasi footer dinamis | Publik Read (`is_active=true`), Admin Full |
| `transparency_stats` | Statistik real-time (dana_dihimpun, dana_disalurkan, mustahik_terlayani) | Publik Read, Admin Update |
| `site_settings` | Konfigurasi situs (nama lembaga, kontak, hero, visi/misi, cerita dampak) | Publik Read, Admin Update |
| `admin_users` | Akun pengelola CMS dan mapping peran | Auth/RBAC Guard |
| `roles` & `permissions` | Role-Based Access Control dan hak akses modular | Auth/RBAC Guard |

---

## 2. KAMUS RESMI `site_settings`

Data dinamis konfigurasi disimpan di tabel `site_settings` dengan format `key-value`:

| Prefix / Key | Tipe | Deskripsi & Penggunaan |
|:---|:---|:---|
| `site_name` | string | Nama resmi website lembaga |
| `contact_address` | text | Alamat kantor BAZNAS Boven Digoel |
| `contact_phone` | string | Nomor telepon / WhatsApp kantor |
| `contact_email` | string | Email resmi lembaga |
| `home_hero_title` | string | Judul utama banner hero beranda |
| `home_hero_subtitle`| text | Subjudul deskripsi banner hero beranda |
| `home_hero_imageurl`| string | URL background hero beranda |
| `home_stat_muzaki` | string | Statistik Muzaki Terdaftar (default: "1.250+") |
| `home_stat_program`| string | Statistik Program Aktif (default: "12 Program") |
| `story_imageurl` | string | URL foto mustahik kisah inspiratif |
| `story_badge` | string | Badge kategori cerita (misal: "Kisah Sukses") |
| `story_tittle` | string | Judul cerita dampak |
| `story_author` | string | Nama mustahik dan nama distrik |
| `story_quote` | text | Kutipan testimoni dampak mustahik |
| `story_metric` | string | Angka peningkatan (misal: "+180%") |
| `story_metric_label`| string | Keterangan metrik (misal: "Kenaikan Omzet") |
| `story_is_active` | boolean | Toggle tampilkan cerita di homepage |
| `vision_text` | text | Teks visi BAZNAS Boven Digoel |
| `mission_1` s.d `4` | text | Teks poin misi lembaga 1 s.d 4 |
| `social_facebook` | string | URL halaman Facebook |
| `social_instagram` | string | URL profil Instagram |
| `social_tiktok` | string | URL profil TikTok |

---

## 3. ATURAN OPTIMASI POSTGREST & OVERFETCHING

### A. Column Pruning pada Halaman Listing
DILARANG mengambil kolom rich-text HTML panjang (`content`) pada halaman daftar berita (`/kabar` dan `/`).
```tsx
// ✅ BENAR (Hemat Bandwidth 98%):
supabase
  .from("news")
  .select("id, title, slug, published_at, thumbnail_url, categories(name)")
  .eq("is_published", true)
  .order("published_at", { ascending: false });

// ❌ SALAH (Mengirim Megabytes HTML untuk 50+ artikel):
supabase
  .from("news")
  .select("*");
```

### B. Header Count untuk Statistik (`head: true`)
Saat hanya membutuhkan total baris data (seperti count di dasbor admin), gunakan opsi `{ count: "exact", head: true }`:
```tsx
const { count } = await supabase
  .from("contact_messages")
  .select("*", { count: "exact", head: true })
  .eq("status", "new");
```

---

## 4. PEMBAGIAN KONEKSI SUPABASE

```
┌───────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Klien Supabase                │ Lokasi Berkas                    │ Lingkup Penggunaan          │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ `createServerSupabase()`      │ `src/lib/server-supabase.ts`     │ Server Component & Actions  │
│ `getSupabaseBrowser()`        │ `src/lib/supabase.ts`            │ Client Component (Admin CMS)│
│ `createServiceRoleClient()`   │ `src/lib/server-supabase.ts`     │ Strictly `src/app/api/*`    │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```

---

## 5. UNIFIED HOMEPAGE VIEW (`view_homepage_data`)

Untuk memangkas 5–8 roundtrip kueri terpisah saat pengunjung membuka Beranda, sistem menyediakan SQL View `public.view_homepage_data`:

```tsx
// ✅ 1 Kueri Tunggal Mengambil Seluruh Kebutuhan Beranda & Footer:
const { data, error } = await supabase
  .from("view_homepage_data")
  .select("*")
  .single();

// Data otomatis berisi:
// data.news              -> 3 Berita terbaru + kategori
// data.programs          -> 3 Program aktif + kategori
// data.transparency_stats-> Agregat angka real-time
// data.recent_documents  -> 3 Laporan PDF publik terbaru
// data.settings          -> Konfigurasi hero, quote, kontak, sosmed
// data.bank_accounts     -> Rekening bank resmi untuk footer
// data.quick_links       -> Tautan navigasi footer dinamis
```
