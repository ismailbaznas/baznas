---
name: nextjs-uiux-audit-master
description: Use when auditing, refactoring, or optimizing UI/UX, accessibility (WCAG AA), touch targets, mobile responsiveness, active tactile feedback, dvh viewport units, dark/light contrast parity, and semantic HTML in web applications.
---

# 🎨 UI/UX, ACCESSIBILITY, INTERACTION & RESPONSIVE AUDIT MASTER SKILL

Panduan standar dan SOP rekayasa antarmuka (Frontend Design Engineering) untuk Senior UI/UX Engineer dan Frontend Specialist dalam mengaudit, meningkatkan, dan mengoptimalkan kualitas visual, aksesibilitas, interaksi sentuh, dan responsivitas aplikasi web.

---

## 🧭 7 PRIORITAS UTAMA AUDIT UI/UX (1 → 7)

```
1. Accessibility (WCAG AA, Focus Ring, Aria Labels)  [CRITICAL]
2. Touch & Interaction (Target Sentuh, Tactile Scale)  [CRITICAL]
3. Performance & Layout Stability (dvh vs vh units)   [HIGH]
4. Style & Visual Hierarchy (Design Tokens, SVG Only) [HIGH]
5. Layout & Mobile Responsiveness (No Fixed Overflow) [HIGH]
6. Typography & Descender Safety (Line Height)        [MEDIUM]
7. Dual Theme Consistency (Light & Dark Parity)       [MEDIUM]
```

---

## ♿ 1. ACCESSIBILITY (CRITICAL)

### A. Rasio Kontras Teks (WCAG AA)
- **Teks Normal (< 18pt / < 24px):** Minimal rasio kontras **4.5:1** terhadap latar belakang.
- **Teks Besar / Ikon (≥ 18pt / bold ≥ 14pt):** Minimal rasio kontras **3:1**.
- Uji keterbacaan di tema Terang (Light Mode) dan tema Gelap (Dark Mode) secara terpisah.

### B. Keyboard Navigation & `:focus-visible`
Seluruh elemen interaktif (`<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`) wajib memiliki indikator fokus yang tegas tanpa mengganggu pengguna mouse:
```tsx
// ✅ BENAR (Kontras tinggi & jelas):
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
```

### C. Aksesibilitas Tombol Icon-Only
Setiap tombol yang hanya menampilkan ikon **WAJIB** memiliki atribut `aria-label` dan `title`:
```tsx
// ✅ BENAR:
<button 
  type="button"
  onClick={handleDelete}
  aria-label="Hapus berita"
  title="Hapus berita"
  className="..."
>
  <Trash2 className="w-4 h-4" />
</button>

// ❌ SALAH (Screen reader tidak dapat mengidentifikasi fungsi tombol):
<button onClick={handleDelete}><Trash2 /></button>
```

---

## 👆 2. TOUCH & TACTILE INTERACTION (CRITICAL)

### A. Target Sentuh Minimum (Mobile First)
- **Aksi Utama / Navigasi / Form Submit:** Minimal **44 × 44px** (misal: `min-h-[44px]` atau `min-w-[44px]`).
- **Aksi Sekunder / Compact Action (Tabel / Icon Button):** Minimal **36 × 36px** hingga **40 × 40px** (`min-w-[36px] min-h-[36px]`).

### B. Feedback Fisik Instan (Tactile Micro-Interaction)
Setiap elemen interaktif wajib memberikan umpan balik visual saat ditekan:
```css
/* Tailwind Class */
active:scale-[0.98] transition-all duration-150 cursor-pointer
/* Untuk tombol compact / bulat */
active:scale-95 transition-transform duration-100
```

### C. No Hover-Only Dependencies
Dilarang menyembunyikan aksi kritis yang hanya muncul saat `hover` pada perangkat layar sentuh. Sediakan tombol aksi yang selalu terlihat atau dapat diakses via ketukan langsung.

---

## 📱 3. PERFORMANCE & VIEWPORT STABILITY (HIGH)

### Dynamic Viewport Units (`dvh` vs `vh`)
Gunakan `100dvh` atau `dvh` daripada `100vh` untuk modal, drawer navigasi, dan halaman auth guna mencegah *layout jumping* / *content clipping* saat bilah alamat (URL bar) browser mobile muncul/hilang:
```tsx
// ✅ BENAR (Stabil di mobile Safari & Chrome):
<div className="flex min-h-[100dvh] items-center justify-center ...">
<div className="max-h-[calc(100dvh-5rem)] overflow-y-auto ...">

// ❌ SALAH (Terpotong saat keyboard atau URL bar aktif):
<div className="min-h-screen ...">
```

---

## 💎 4. STYLE & VISUAL HIERARCHY (HIGH)

1. **Design Tokens Terpadu:** Gunakan palet warna brand secara konsisten (Primary, Accent, Surface, Neutral).
2. **Vektor SVG Murni:** Hindari penggunaan emoji sebagai ikon struktural sistem (tombol edit, hapus, status, atau navigasi). Gunakan pustaka ikon vektor seperti `lucide-react`.
3. **Skeleton Loading:** Sediakan placeholder skeleton yang menyerupai bentuk akhir komponen saat memuat data.

---

## 📐 5. LAYOUT & MOBILE RESPONSIVENESS (HIGH)

1. **No Horizontal Scrollbar:** Hindari lebar tetap piksel (`width: 1200px`) tanpa `max-w-full`.
2. **Responsive Table Containers:** Bungkus elemen `<table>` dengan container berkemampuan scroll horizontal yang mulus:
   ```tsx
   <div className="relative w-full overflow-x-auto custom-scrollbar">
     <table className="w-full text-left border-collapse">...</table>
   </div>
   ```
3. **Drawer Navigasi Mobile:** Sediakan backdrop blur yang dapat ditutup dengan mengetuk area luar (`handleBackdropClick`) atau tombol tutup eksplisit.

---

## 🔤 6. TYPOGRAPHY & DESCENDER SAFETY (MEDIUM)

Pastikan seluruh heading dan teks berukuran besar memiliki `line-height` memadai ($\ge 1.25$) dengan sedikit padding bawah cadangan (`pb-0.5` atau `pb-1`) agar huruf yang memiliki ekor ke bawah (*descenders*: `y`, `g`, `j`, `p`, `q`) tidak terpotong saat berada di dalam container `overflow-hidden`.

---

## 🌓 7. DUAL THEME CONSISTENCY (MEDIUM)

Verifikasi bahwa setiap komponen:
1. Input form memiliki latar yang jelas di mode gelap (`dark:bg-slate-800` / `dark:bg-zinc-900`) dan border yang terlihat (`dark:border-outline/20`).
2. Teks sekunder tetap kontras (`text-[#5B6470] dark:text-zinc-400` atau `dark:text-slate-300`).
3. Status badge memiliki varian terang dan gelap yang serasi (misal: `bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400`).

---

## 📋 CHECKLIST PRA-COMMIT AUDIT UI/UX

- [ ] Seluruh tombol icon-only memiliki `aria-label` dan `title`.
- [ ] Tombol dan tautan memiliki `active:scale-[0.98]` atau `active:scale-95`.
- [ ] Focus ring `:focus-visible` terlihat jelas dengan keyboard Tab.
- [ ] Kontainer tinggi penuh menggunakan unit `100dvh`.
- [ ] Target sentuh tombol $\ge 44\text{px}$ di mobile (atau $\ge 36\text{px}$ untuk compact action).
- [ ] Kontras teks lulus uji WCAG AA di Light dan Dark mode.
- [ ] Kompilasi proyek lulus `npm run build` tanpa error.
