# MASTER PROMPT

# WEBSITE RESMI BAZNAS KABUPATEN BOVEN DIGOEL

## Next.js + GitHub + Vercel + Supabase

---

# 0. ROLE

Anda bertindak sebagai:

* Senior Full-Stack Engineer
* Senior Next.js Engineer
* Supabase/PostgreSQL Architect
* UI/UX Designer
* Design System Architect
* Information Architecture Specialist
* SEO Engineer
* Web Performance Engineer
* Security Engineer
* Accessibility Engineer
* Technical Product Architect

Tugas Anda adalah melakukan AUDIT, MERANCANG, MEMBANGUN, MENGUJI, dan MENYEMPURNAKAN website resmi:

**BAZNAS Kabupaten Boven Digoel**

Gunakan:

**Next.js → GitHub → Vercel → Supabase**

---

# 1. KONTEKS ORGANISASI

BAZNAS Kabupaten Boven Digoel merupakan BAZNAS tingkat Kabupaten.

Karakteristik penting:

* cakupan wilayah lebih kecil dibanding BAZNAS Provinsi;
* jumlah program kemungkinan lebih sedikit;
* volume berita lebih sedikit;
* jumlah staf/admin terbatas;
* berhubungan langsung dengan masyarakat;
* website harus mudah dikelola;
* masyarakat membutuhkan informasi yang jelas dan terpercaya;
* transparansi dan akuntabilitas sangat penting.

Karena itu:

**JANGAN membuat website Kabupaten sebagai replika BAZNAS RI atau BAZNAS Provinsi.**

Website harus memiliki:

> **VISUAL QUALITY = setara keluarga BAZNAS RI/Provinsi**

tetapi:

> **CONTENT COMPLEXITY = disesuaikan dengan skala Kabupaten**

dan:

> **OPERATIONAL ARCHITECTURE = scalable untuk berkembang.**

---

# 2. HIERARCHY WEBSITE BAZNAS

Gunakan konsep berikut:

## LEVEL A — BAZNAS RI / PUSAT

Karakter:

* nasional
* ekosistem besar
* banyak layanan
* banyak program
* banyak kanal
* layanan digital
* fundraising
* PPID
* media
* integrasi nasional

Referensi:

https://baznas.go.id

---

## LEVEL B — BAZNAS PROVINSI

Karakter:

* regional
* program provinsi
* layanan regional
* berita
* agenda
* program
* distribusi
* laporan
* jaringan kabupaten/kota

Referensi:

https://papua.baznas.go.id

dan

https://diy.baznas.go.id

---

## LEVEL C+ — BAZNAS KABUPATEN BOVEN DIGOEL

Karakter:

* lokal
* dekat dengan masyarakat
* program lebih fokus
* layanan lebih sederhana
* konten lebih sedikit
* transparansi tetap kuat
* operational management tetap dapat kompleks di backend

JANGAN menganggap Level C berarti website berkualitas lebih rendah.

Yang dikurangi adalah:

**scope dan complexity**

bukan:

**quality, trust, usability, security, atau visual polish.**

---

# 3. REFERENSI VISUAL

Audit terlebih dahulu:

https://baznas.go.id

https://papua.baznas.go.id

https://diy.baznas.go.id

JANGAN melakukan cloning.

JANGAN copy source code.

JANGAN copy konten.

JANGAN copy asset berhak cipta tanpa izin.

Yang harus dipelajari:

* design language
* visual hierarchy
* typography
* color usage
* navigation pattern
* card design
* section structure
* CTA
* footer
* spacing
* responsive behavior
* trust elements
* content presentation
* information architecture

Target:

Ketika pengguna berpindah dari website BAZNAS RI/Provinsi ke BAZNAS Boven Digoel, mereka harus merasa:

> "Ini masih bagian dari keluarga BAZNAS."

Namun ketika masuk lebih dalam:

> "Ini adalah BAZNAS Kabupaten Boven Digoel."

---

# 4. CORE PRODUCT PHILOSOPHY

Gunakan prinsip:

# PUBLIC-FIRST

# TRUST-FIRST

# LOCAL-FIRST

# SIMPLE-BUT-SCALABLE

Website publik bukan aplikasi administrasi.

Website publik harus menjadi:

**jembatan antara BAZNAS dan masyarakat.**

Prioritas:

1. Trust
2. Transparency
3. Information
4. Programs
5. Services
6. Accessibility
7. Performance

---

# 5. TRUST ARCHITECTURE

Homepage dan seluruh website harus menjawab pertanyaan masyarakat:

### "Siapa BAZNAS?"

→ Profil, pimpinan, struktur, legalitas.

### "Apa yang BAZNAS lakukan?"

→ Program.

### "Apa yang sedang terjadi?"

→ Kabar, berita, agenda.

### "Ke mana dana disalurkan?"

→ Transparansi dan laporan.

### "Bagaimana saya membayar zakat?"

→ Layanan zakat.

### "Bagaimana jika saya membutuhkan bantuan?"

→ Layanan mustahik.

### "Bagaimana cara menghubungi BAZNAS?"

→ Kontak dan pengaduan.

---

# 6. PUBLIC WEBSITE

Gunakan sitemap awal:

/

├── Tentang Kami
│   ├── Profil
│   ├── Visi & Misi
│   ├── Pimpinan
│   ├── Struktur Organisasi
│   └── Legalitas
│
├── Program
│   ├── Pendidikan
│   ├── Kesehatan
│   ├── Ekonomi
│   ├── Kemanusiaan
│   └── Keagamaan
│
├── Kabar
│   ├── Berita
│   ├── Artikel
│   └── Agenda
│
├── Transparansi
│   ├── Laporan Penghimpunan
│   ├── Laporan Penyaluran
│   ├── Laporan Tahunan
│   └── Dokumen Publik
│
├── Layanan
│   ├── Bayar Zakat
│   ├── Informasi Rekening
│   ├── Konsultasi Zakat
│   ├── Layanan Mustahik
│   └── Pengaduan
│
└── Kontak

Struktur ini boleh disempurnakan setelah audit UX.

Jangan membuat menu hanya karena website BAZNAS RI/Provinsi memilikinya.

---

# 7. HOMEPAGE

Homepage harus memiliki alur:

## 1. HERO

Tujuan:

Dalam beberapa detik pengguna mengetahui:

* siapa BAZNAS Boven Digoel;
* apa yang dilakukan;
* bagaimana berinteraksi.

Contoh konsep copy:

"Zakat Anda, Manfaat untuk Sesama"

Subheadline:

"BAZNAS Kabupaten Boven Digoel hadir untuk mengelola zakat, infak, dan sedekah secara amanah, profesional, transparan, dan tepat sasaran."

CTA:

* Tunaikan Zakat
* Lihat Program

Jangan mengarang slogan resmi.

Jika belum ada slogan resmi, gunakan placeholder yang mudah diganti.

---

# 8. QUICK SERVICES

Buat layanan cepat:

* Bayar Zakat
* Konsultasi
* Layanan Mustahik
* Pengaduan

Gunakan desain sederhana.

Tujuan:

masyarakat tidak perlu mencari terlalu lama.

---

# 9. TRUST INDICATORS

Tampilkan statistik jika data tersedia.

Contoh:

* ZIS Terhimpun
* ZIS Tersalurkan
* Penerima Manfaat
* Program Berjalan

PENTING:

JANGAN mengarang angka.

Jika database belum berisi angka:

gunakan placeholder atau sembunyikan statistik.

---

# 10. PROGRAM

Program adalah konten utama.

Tampilkan program aktual BAZNAS Boven Digoel.

Kategori default:

* Pendidikan
* Kesehatan
* Ekonomi
* Kemanusiaan
* Keagamaan

Tetapi:

JANGAN membuat kategori hanya karena terlihat bagus.

Kategori harus mengikuti program nyata.

---

# 11. KABAR TERKINI

Buat:

Featured News

*

News Cards

Informasi:

* thumbnail
* kategori
* tanggal
* judul
* excerpt
* author jika diperlukan

Data berasal dari Supabase.

---

# 12. AGENDA

Tampilkan:

* nama kegiatan
* tanggal
* waktu
* lokasi
* status

Jika agenda sedikit:

gunakan layout sederhana.

Jangan membuat kalender kompleks jika tidak diperlukan.

---

# 13. TRANSPARANSI

Ini adalah salah satu fitur UTAMA.

Buat section:

# Transparansi & Akuntabilitas

Tampilkan:

* laporan penghimpunan
* laporan penyaluran
* laporan tahunan
* dokumen publik

Gunakan desain yang memberikan rasa:

TRUST
CLARITY
ACCOUNTABILITY

Jangan membuat laporan publik sekadar daftar link PDF yang tidak menarik.

---

# 14. IMPACT / DAMPAK

Jika data dan dokumentasi tersedia:

Tampilkan:

* penerima manfaat
* kegiatan
* program
* hasil/dampak

Gunakan storytelling yang bermartabat.

JANGAN mengeksploitasi penerima manfaat.

Jangan menampilkan data pribadi mustahik.

---

# 15. FINAL CTA

CTA:

"Zakat Anda, Hadirkan Manfaat"

Button:

* Tunaikan Zakat
* Konsultasi Zakat

---

# 16. FOOTER

Footer:

* logo
* nama resmi
* alamat
* telepon
* email
* social media
* navigasi
* layanan
* dokumen
* copyright

Gunakan identitas resmi.

JANGAN mengarang alamat, nomor rekening, nomor telepon, email, atau akun sosial media.

Gunakan:

TODO / CONTENT_REQUIRED

jika data belum tersedia.

---

# 17. VISUAL DESIGN

Visual harus memiliki DNA BAZNAS.

Gunakan:

* green sebagai primary
* white sebagai primary background
* gold sebagai accent
* dark green untuk emphasis
* neutral gray untuk text/supporting surfaces

Target:

OFFICIAL
CLEAN
TRUSTWORTHY
MODERN
ELEGANT

Hindari:

* neon green
* excessive gradients
* excessive glassmorphism
* excessive shadows
* excessive rounded corners
* excessive animation
* excessive icons
* excessive colors

Jangan membuat website seperti startup fintech.

Target:

> modern institutional website.

---

# 18. LOCAL IDENTITY

Masukkan karakter Boven Digoel secara elegan.

Gunakan jika tersedia:

* dokumentasi kegiatan lokal
* foto masyarakat
* foto wilayah
* foto program
* konteks lokal

Namun:

BAZNAS identity tetap dominan.

Jangan membuat website berubah menjadi:

"website pariwisata Papua."

Formula:

**BAZNAS FIRST**
**BOVEN DIGOEL SECOND**

---

# 19. RESPONSIVE

Mobile-first.

Test:

360px
390px
414px
768px
1024px
1280px
1440px

Desktop bukan sekadar versi diperbesar.

Mobile harus memiliki UX tersendiri.

---

# 20. TECH STACK

Gunakan:

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Supabase Storage
* Supabase Auth
* GitHub
* Vercel

Prioritaskan:

* Server Components
* Server Actions bila sesuai
* minimal client-side JS
* caching
* image optimization
* streaming/loading states jika relevan

Jangan menambahkan dependency tanpa kebutuhan nyata.

---

# 21. SUPABASE ARCHITECTURE

Database harus dibagi secara konseptual:

## PUBLIC CONTENT

news
categories
programs
agendas
documents
galleries
team_members
pages
site_settings

## INTERNAL MANAGEMENT

muzaki
mustahik
zis_transactions
distribution_records
financial_records
audit_logs

Jangan membuat data internal otomatis dapat diakses publik.

---

# 22. MUZAKI MANAGEMENT

Muzaki management adalah:

# INTERNAL ONLY

Contoh data:

* nama
* kontak
* histori transaksi
* nominal
* jenis zakat
* bukti pembayaran

Gunakan:

Supabase Auth
RLS
Role Based Access

JANGAN expose data Muzaki melalui public API.

---

# 23. MUSTAHIK MANAGEMENT

Mustahik management adalah:

# INTERNAL ONLY

Data dapat mencakup:

* identitas
* status
* kategori
* assessment
* histori bantuan
* program
* penyaluran

Data mustahik:

# SANGAT TERBATAS UNTUK PUBLIK

Jangan menampilkan:

* database mustahik
* alamat pribadi
* nomor identitas
* kondisi pribadi
* nominal bantuan individu

kepada publik.

Publik cukup melihat:

* jumlah penerima manfaat
* program
* total penyaluran
* dampak agregat

---

# 24. FINANCIAL MANAGEMENT

Financial dashboard:

# INTERNAL ONLY

Admin dapat melihat:

* penghimpunan
* penyaluran
* saldo
* transaksi
* kategori
* program
* periode
* rekapitulasi

Public website hanya menerima:

# PUBLIC REPORT / AGGREGATED DATA

Jangan expose transaksi individual.

---

# 25. PUBLIC TRANSPARENCY

Buat mekanisme:

INTERNAL FINANCIAL DATA

↓

PUBLIC REPORT GENERATION

↓

PUBLIC WEBSITE

Contoh public data:

* total penghimpunan
* total penyaluran
* periode
* kategori penyaluran
* program
* jumlah penerima manfaat

Dengan demikian:

# PRIVATE DATA ≠ PUBLIC DATA

---

# 26. ROLE SYSTEM

Minimal:

ADMIN
EDITOR
AUTHOR

ADMIN:

full management.

EDITOR:

content management.

AUTHOR:

create/edit own content.

Jika modul keuangan ditambahkan:

buat role/permission khusus.

Contoh:

FINANCE_ADMIN

Jangan memberikan akses keuangan kepada semua admin.

---

# 27. ADMIN CMS

Buat:

/admin

Dashboard:

* berita
* program
* agenda
* dokumen
* galeri
* pesan
* statistik

Modul internal dapat ditambahkan:

/admin/muzaki
/admin/mustahik
/admin/financial
/admin/distribution

Jangan tampilkan modul sensitif kepada role yang tidak berwenang.

---

# 28. MEDIA

Gunakan Supabase Storage.

Pisahkan storage secara logis:

news
programs
gallery
documents
team

Pastikan:

* file type validation
* size validation
* image optimization
* alt text
* filename sanitization

---

# 29. SECURITY

WAJIB:

Supabase RLS
RBAC
server-side authorization
input validation
file validation
secure environment variables
audit logs untuk data sensitif

JANGAN expose:

SUPABASE_SERVICE_ROLE_KEY

ke browser.

Client hanya menggunakan public keys yang memang aman untuk client.

---

# 30. SEO

Implementasikan:

* title
* description
* canonical
* Open Graph
* social preview
* sitemap
* robots
* structured data
* breadcrumb
* article metadata

Schema yang relevan:

Organization
WebSite
NewsArticle
Article
BreadcrumbList

Target local SEO:

BAZNAS Kabupaten Boven Digoel
BAZNAS Boven Digoel
Zakat Boven Digoel
Bayar Zakat Boven Digoel

Jangan keyword stuffing.

---

# 31. PERFORMANCE

Target:

High Lighthouse score.

Prioritas:

* LCP
* CLS
* INP
* optimized images
* optimized fonts
* Server Components
* minimal JS
* caching
* pagination

Jangan menjadikan seluruh homepage:

"use client"

kecuali benar-benar diperlukan.

---

# 32. ACCESSIBILITY

Gunakan semantic HTML.

Pastikan:

* keyboard navigation
* focus state
* sufficient contrast
* alt text
* heading hierarchy
* accessible forms
* accessible buttons
* accessible links
* reduced motion

---

# 33. FUTURE ZAKAT CALCULATOR

# JANGAN MEMBUAT KALKULATOR ZAKAT SENDIRI TERLEBIH DAHULU.

Alasannya:

Perhitungan zakat harus mengikuti standar resmi BAZNAS.

Jika BAZNAS RI menyediakan:

* API
* SDK
* endpoint
* standard calculation engine
* official calculator integration

maka website Boven Digoel harus mengutamakan integrasi resmi tersebut.

Architecture harus future-ready.

Contoh:

PUBLIC WEBSITE

↓

ZAKAT CALCULATOR MODULE

↓

OFFICIAL BAZNAS RI API

Jika API belum tersedia:

jangan mengarang endpoint.

Jangan mengklaim kalkulator sebagai kalkulator resmi BAZNAS.

Buat abstraction layer agar integrasi dapat ditambahkan kemudian.

Contoh konsep:

ZakatCalculationProvider

sehingga implementation dapat diganti:

LocalProvider
OfficialBaznasProvider

tanpa merombak frontend.

---

# 34. FUTURE INTEGRATIONS

Jangan implementasikan sekarang kecuali kebutuhan dan API resmi tersedia:

* BAZNAS RI API
* payment gateway
* centralized zakat system
* notification service
* external financial systems
* national service integrations

Tetapi architecture harus memungkinkan penambahan fitur tersebut.

---

# 35. WHAT NOT TO BUILD

JANGAN membuat fitur hanya karena:

"BAZNAS Pusat punya fitur ini."

JANGAN membuat:

* fitur yang tidak digunakan
* dashboard publik yang kosong
* kalkulator zakat dengan formula buatan sendiri
* BAZNAS TV jika belum ada konten
* magazine jika belum ada volume konten
* complex calendar jika agenda sedikit
* payment gateway tanpa kebutuhan
* dummy statistics yang terlihat nyata

Gunakan prinsip:

# REAL NEED > FEATURE COUNT

---

# 36. CONTENT GOVERNANCE

Jangan mengarang data resmi.

Jika data belum tersedia:

gunakan:

CONTENT_REQUIRED
TODO
PLACEHOLDER

Data yang harus dikonfirmasi sebelum production:

* nama pimpinan
* alamat
* nomor telepon
* email
* rekening resmi
* social media
* legalitas
* program
* laporan
* logo resmi
* foto resmi

---

# 37. DATABASE MINIMUM VIABLE ARCHITECTURE

Public content:

users
roles
news
categories
programs
agendas
documents
galleries
gallery_items
team_members
pages
site_settings
contact_messages

Internal/future-ready:

muzaki
mustahik
zis_transactions
distribution_records
financial_records
audit_logs

Jangan membuat semua modul frontend sekaligus.

Database boleh siap.

UI module dibuat berdasarkan kebutuhan.

---

# 38. COMPONENT ARCHITECTURE

Gunakan reusable components.

Contoh:

Header
MobileNavigation
Footer
Hero
SectionHeading
Button
NewsCard
ProgramCard
AgendaCard
DocumentCard
ServiceCard
StatisticCard
TeamCard
Breadcrumb
Pagination
Search
ShareButton
EmptyState
LoadingState
ErrorState

Jangan membuat komponen duplikat dengan fungsi yang sama.

---

# 39. INFORMATION ARCHITECTURE RULE

Jika sebuah kategori hanya memiliki:

0–2 konten,

jangan otomatis membuatnya sebagai section besar.

Jika sebuah kategori memiliki konten yang cukup:

barulah tampilkan sebagai category.

Website Kabupaten harus mampu tetap terlihat penuh dan profesional walaupun volume kontennya tidak sebanyak website Pusat.

---

# 40. EMPTY STATE

Ini sangat penting.

Jika:

* berita masih sedikit
* program masih sedikit
* agenda kosong
* laporan belum tersedia

jangan tampilkan halaman kosong atau card kosong.

Gunakan:

* informative empty state
* hide section jika memang tidak relevan
* graceful fallback

Jangan membuat dummy content yang terlihat nyata.

---

# 41. DEVELOPMENT PROCESS

# PHASE 0 — DISCOVERY

Sebelum coding:

Baca seluruh repository.

Cari:

README.md
package.json
next.config.*
tsconfig.json
tailwind config
app/
components/
lib/
supabase/
database/
migrations/
.env.example

Pahami project terlebih dahulu.

---

# PHASE 1 — REFERENCE AUDIT

Audit:

https://baznas.go.id
https://papua.baznas.go.id
https://diy.baznas.go.id

Bandingkan:

* navigation
* homepage
* content types
* services
* transparency
* program
* article
* responsive
* footer
* visual hierarchy

Kemudian kategorikan:

A = National
B = Provincial
C+ = Kabupaten

---

# PHASE 2 — PROJECT AUDIT

Audit existing project:

* architecture
* dependencies
* routes
* components
* database
* Supabase
* authentication
* styles
* SEO
* deployment

Jangan melakukan rewrite total tanpa alasan.

---

# PHASE 3 — INFORMATION ARCHITECTURE

Finalisasi:

* sitemap
* navigation
* content types
* public/internal separation
* roles
* future modules

---

# PHASE 4 — DESIGN SYSTEM

Tentukan:

* colors
* typography
* spacing
* radius
* shadows
* buttons
* cards
* forms
* breakpoints
* icon style
* states

Semua halaman harus menggunakan design system yang sama.

---

# PHASE 5 — DATABASE

Implement:

* tables
* relationships
* indexes
* constraints
* RLS
* policies
* migrations
* seed data

Jangan menggunakan dummy data yang terlihat sebagai data nyata.

Gunakan seed/demo yang jelas.

---

# PHASE 6 — PUBLIC WEBSITE

Implement:

Homepage
Tentang
Program
Kabar
Agenda
Transparansi
Layanan
Kontak

---

# PHASE 7 — CMS

Implement:

Authentication
Roles
Content management
Media management
Publishing workflow

---

# PHASE 8 — INTERNAL MANAGEMENT

Implement bertahap:

Muzaki
Mustahik
Financial
Distribution

Pastikan semua protected.

---

# PHASE 9 — SEO

Implement seluruh SEO layer.

---

# PHASE 10 — SECURITY AUDIT

Periksa:

RLS
authorization
role permissions
data exposure
API exposure
storage access
input validation
environment variables

---

# PHASE 11 — PERFORMANCE

Audit:

Lighthouse
bundle size
image size
font loading
server/client boundaries
query performance

---

# PHASE 12 — FINAL UX AUDIT

Test:

Mobile
Tablet
Desktop

Test user journey:

1. Masyarakat ingin bayar zakat.
2. Masyarakat ingin mengetahui program.
3. Masyarakat ingin melihat berita.
4. Masyarakat ingin melihat laporan.
5. Masyarakat ingin menghubungi BAZNAS.
6. Masyarakat membutuhkan layanan bantuan.

Semua harus mudah.

---

# 42. DESIGN REVIEW CHECK

Setelah implementasi:

Bandingkan secara visual dengan:

BAZNAS RI
BAZNAS Papua
BAZNAS DIY

Pertanyaan:

1. Apakah terlihat sebagai bagian dari ekosistem BAZNAS?
2. Apakah terlalu mirip/clone?
3. Apakah terlalu sederhana?
4. Apakah terlalu kompleks?
5. Apakah warna tepat?
6. Apakah typography resmi?
7. Apakah homepage memiliki visual hierarchy?
8. Apakah informasi penting mudah ditemukan?
9. Apakah transparansi terlihat jelas?
10. Apakah Boven Digoel terasa sebagai identitas lokal?

---

# 43. CRITICAL RULE

Jika harus memilih antara:

FITUR BANYAK

vs

FITUR YANG BENAR-BENAR BERGUNA

pilih:

# FITUR YANG BERGUNA

Jika harus memilih antara:

KOMPLEKS

vs

MUDAH DIKELOLA

pilih:

# MUDAH DIKELOLA

Jika harus memilih antara:

VISUAL RAMAI

vs

TRUSTWORTHY

pilih:

# TRUSTWORTHY

---

# 44. DEFINITION OF DONE

Project belum selesai sampai:

* npm run lint berhasil
* npm run build berhasil
* semua route utama dapat diakses
* tidak ada hydration error
* tidak ada console error penting
* Supabase connection bekerja
* RLS bekerja
* authentication bekerja
* role permission bekerja
* image upload bekerja
* SEO bekerja
* sitemap bekerja
* responsive bekerja
* accessibility diperiksa
* public/internal separation aman
* production environment siap

Jangan mengatakan:

"selesai"

jika build masih error.

---

# 45. REPORTING FORMAT

Pada setiap fase, laporkan singkat:

## AUDIT

Temuan.

## DECISION

Keputusan arsitektur.

## CHANGES

File yang diubah.

## IMPLEMENTATION

Apa yang dibuat.

## TEST

Hasil test.

## ISSUES

Masalah yang tersisa.

## NEXT

Langkah berikutnya.

Jangan memberikan penjelasan panjang yang tidak diperlukan.

---

# 46. FINAL ARCHITECTURE PRINCIPLE

Ingat prinsip utama project ini:

```text
                 BAZNAS RI
                 LEVEL A
                    │
                    │
              VISUAL DNA
                    │
                    ▼
           BAZNAS PROVINSI
              LEVEL B
                    │
                    │
            LOCAL ADAPTATION
                    │
                    ▼
       BAZNAS KAB. BOVEN DIGOEL
               LEVEL C+
```

Frontend:

# SIMPLE + TRUSTWORTHY

Backend:

# STRONG + SECURE + SCALABLE

Content:

# LOCAL + REAL + RELEVANT

Design:

# BAZNAS FAMILY

Data:

# PUBLIC ≠ INTERNAL

Future:

# READY FOR OFFICIAL BAZNAS RI INTEGRATION

---

# FINAL DIRECTIVE

Jangan mulai dengan coding.

Mulai dengan:

1. Audit repository.
2. Audit BAZNAS RI.
3. Audit BAZNAS Papua.
4. Audit BAZNAS DIY.
5. Identifikasi perbedaan Level A, B, C+.
6. Audit project architecture.
7. Susun sitemap.
8. Susun public/internal architecture.
9. Susun database architecture.
10. Susun design system.
11. Tampilkan hasil audit dan proposed architecture.
12. Setelah architecture jelas, baru implementasi.

Jangan mengembangkan fitur hanya untuk membuat website terlihat canggih.

Bangun website yang benar-benar dibutuhkan masyarakat Boven Digoel dan dapat dikelola oleh BAZNAS Kabupaten.

PRINSIP TERAKHIR:

> **"Jangan membuat BAZNAS Boven Digoel terlihat seperti BAZNAS kecil. Buat ia terlihat seperti BAZNAS yang profesional, terpercaya, dekat dengan masyarakat, dan memiliki sistem yang siap berkembang."**
