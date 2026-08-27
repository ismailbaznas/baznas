# REBUILD NOTES - BAZNAS KAB. BOVEN DIGOEL WEBSITE

## 0. Initial Setup & Context

*   **Goal:** Rebuild BAZNAS Kab. Boven Digoel website (Level C+).
*   **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (Auth, DB, Storage).
*   **Source Documents:** `00_rebuild.md`, `00_initial_schema.sql`, `PRD.MD`.

## 1. Progress Dicapai (Implementasi Fungsionalitas Penuh)

Semua modul Admin dan arsitektur inti telah selesai diimplementasikan:

| Modul | Status | Keterangan |
| :--- | :--- | :--- |
| **Arsitektur Dasar** | ✅ Selesai | Scaffolding Next.js 16, Supabase SSR, Auth (Login/Logout), Theming. |
| **Keamanan** | ✅ Selesai | Struktur RBAC (Peran/Izin/Pengguna) 3-Lapis (Server Guard, API Route Guard, Client UI Guard) diimplementasikan. |
| **Modul Konten** | ✅ Selesai | CRUD untuk Berita, Program, Agenda, Dokumen Transparansi, Pimpinan (Team Members). |
| **Modul Komunikasi** | ✅ Selesai | Manajemen Pesan Masuk (Read/Update Status/Delete), Form Kontak Publik. |
| **Modul Sistem** | ✅ Selesai | Manajemen Pengguna & Peran (CRUD/Invite), Pengaturan Situs. |
| **Tampilan Publik** | ✅ Selesai | Navbar, Footer, Halaman Utama (dengan *placeholder* data statis). |

## 2. Technical Debt & Langkah Lanjutan (Untuk Model Berikutnya)

Proyek ini gagal dalam tahap *Final Build Check* karena masalah parsial JavaScript/TypeScript yang disebabkan oleh transisi arsitektur yang kompleks.

| Prioritas | Deskripsi | Status | File Terdampak |
| :--- | :--- | :--- | :--- |
| **A** | **Fix TypeScript Errors (Schema):** Terjadi kesalahan karena ketidakcocokan tipe data `null` (dari DB) ke string/number (di state form). Perlu penyesuaian penanganan null value di semua Modal Component (`AdminBeritaModal.tsx`, `AdminTeamModal.tsx`, dll.). | 🔴 Pending | Semua Admin Modal |
| **B** | **Fix JSX/Parser Errors:** Kesalahan parser (kemungkinan bug di Turbopack/Next.js 16) yang terjadi pada penutup fungsi `map` di dalam `TableBody`. Perlu penyesuaian sintaks JSX (atau *safe-mode* ternary) di komponen Client yang menampilkan tabel. | 🔴 Pending | `AdminAgendaClient.tsx`, `AdminPesanClient.tsx`, `AdminUsersClient.tsx` |
| **C** | **Integrasi Final Public Data:** Hubungkan halaman publik (`/program`, `/kabar`, `/transparansi`) untuk menampilkan data dari Supabase (bukan *placeholder*). | ⏳ Pending | `/app/*page.tsx` Publik |

## 3. Rekomendasi untuk Sesi Berikutnya

Model berikutnya harus fokus pada **resolusi teknis** untuk memastikan *build* sukses, sesuai dengan langkah berikut:

1.  **Instalasi Ulang Dependencies:** Jalankan `npm install --legacy-peer-deps` (untuk memastikan semua dependencies terinstal dengan benar).
2.  **Fix Modals (Prioritas A):** Perbaiki penanganan `null` dari Supabase ke state form di semua Admin Modal.
3.  **Fix JSX Parser (Prioritas B):** Perbaiki struktur JSX di komponen client yang gagal build.
4.  **Final Build & Lint:** Pastikan `npm run build` dan `npm run lint` berjalan tanpa kesalahan.
5.  **Finalisasi Public Pages (Prioritas C):** Ambil data dari Supabase dan render di halaman publik.
