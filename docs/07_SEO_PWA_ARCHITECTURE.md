# 🌐 ARSITEKTUR SEO, OPEN GRAPH, PWA & INSTALLABILITY
*Acuan teknis khusus untuk standar Next.js 16 App Router Metadata, Dynamic Open Graph Image (1200x630), Dynamic Sitemap/Robots, JSON-LD Structured Data, dan Progressive Web Apps (PWA).*

---

## 1. STRUKTUR METADATA & TITLE STRATEGY

### A. Root Metadata (`src/app/layout.tsx`)
- **`metadataBase`:** Menggunakan helper dinamis `getBaseUrl()` (`src/lib/seo.ts`) yang aman untuk localhost, preview deployment, dan domain produksi (`https://baznas-bvd.vercel.app`).
- **`title`:**
  ```typescript
  title: {
    default: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
    template: "%s — BAZNAS Kabupaten Boven Digoel",
  }
  ```
- **`viewport`:** Diekspor terpisah melalui `export const viewport: Viewport = { ... }` dengan themeColor dual-mode (`#004229` light, `#031407` dark).
- **`alternates`:** Seluruh halaman publik memiliki `canonical` URL yang valid.

### B. Dynamic Metadata pada Dynamic Routes (`generateMetadata`)
Pada halaman detail `/kabar/[slug]` dan `/program/[slug]`, `params` di-await asinkron sesuai standar Next.js 16:
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Kueri judul, excerpt/deskripsi, thumbnail_url, dan tanggal publikasi...
}
```

---

## 2. DYNAMIC OPEN GRAPH & TWITTER CARD (1200 × 630 PX)

Dihasilkan secara dinamis menggunakan Next.js `ImageResponse` dari `next/og`:
- `src/app/opengraph-image.tsx`
- `src/app/twitter-image.tsx`

### Aturan Kompatibilitas Satori:
- Hindari penggunaan CSS `zIndex` (tidak didukung oleh engine Satori).
- Hindari simbol unicode khusus yang memicu kegagalan dynamic font loading (gunakan `•` atau SVG).
- Gunakan tata letak flexbox murni berestetika Deep Emerald (`#004229`) dan Gold (`#D4AF37`).

---

## 3. DYNAMIC SITEMAP & ROBOTS ENGINE

### A. Sitemap Bebas Dynamic Server Error (`src/app/sitemap.ts`)
Menggunakan `createPublicServerSupabase()` dari `src/lib/server-supabase.ts` (klien stateless tanpa pemanggilan `cookies()`) sehingga sitemap dapat di-generate sebagai aset statis/ISR tanpa memicu error `DynamicServerUsage`.
- Mengindeks seluruh 7 halaman statis (`/`, `/tentang`, `/program`, `/kabar`, `/transparansi`, `/layanan`, `/kontak`).
- Mengindeks seluruh slug berita aktif (`/kabar/[slug]`) dan program aktif (`/program/[slug]`).
- Tidak mengindeks rute internal (`/admin`, `/api`, `/login`, `/offline`).

### B. Robots.txt (`src/app/robots.ts`)
- Mengizinkan crawling halaman publik dan file aset.
- Memblokir crawling pada `/admin`, `/admin/*`, `/api/*`, `/login`, `/accept-invite`, `/offline`.
- Menunjuk ke lokasi sitemap: `https://baznas-bvd.vercel.app/sitemap.xml`.

---

## 4. STRUCTURED DATA (JSON-LD)

Komponen server `<JsonLd data={...} />` (`src/components/seo/JsonLd.tsx`) merender schema terstandar:
1. **`GovernmentOrganization`:** Identitas BAZNAS Boven Digoel, logo resmi, alamat Tanah Merah Papua Selatan, koordinat geo, kontak, dan tautan sosial media.
2. **`WebSite`:** Data entitas portal dengan relasi publisher organisasi.
3. **`BreadcrumbList`:** Hirarki navigasi terstruktur pada seluruh rute internal.
4. **`NewsArticle`:** Metadata artikel berita pada rute `/kabar/[slug]`.
5. **`Service`:** Metadata layanan program ZIS pada rute `/program/[slug]`.

---

## 5. PROGRESSIVE WEB APP (PWA) & SERVICE WORKER

### A. Web App Manifest (`src/app/manifest.ts`)
Menghasilkan `/manifest.webmanifest` dengan:
- `start_url: "/"`, `id: "/"`, `scope: "/"`
- `display: "standalone"`, `orientation: "portrait-primary"`
- `theme_color: "#004229"`, `background_color: "#ffffff"`
- Suite icon lengkap (192, 512, maskable dengan safe-zone padding, dan apple-touch-icon).

### B. Native Service Worker (`public/sw.js`)
- **Pre-caching:** App Shell, offline page, dan icon institusi.
- **Navigasi Halaman (HTML):** Strategi **Network-First** dengan fallback otomatis ke `/offline`.
- **Aset Statis (CSS, JS, Images, Fonts):** Strategi **Stale-While-Revalidate / Cache-First**.
- **Batasan Keamanan Ketat:** Bypass penuh untuk `/admin/*`, `/api/*`, `/login`, `/accept-invite`, mutasi HTTP (POST/PUT/DELETE), dan token Supabase/OAuth.

### C. Offline Fallback Page (`src/app/offline/page.tsx` & `src/components/OfflineClient.tsx`)
- Halaman interaktif ramah pengguna dengan tombol *Muat Ulang* dan kontak WhatsApp darurat BAZNAS.
- Dilengkapi `robots: { index: false, follow: false }`.

### D. PWA Registration Client (`src/components/pwa/PwaRegister.tsx`)
- Dijalankan pada event `window.load` di browser tanpa mengganggu hidrasi React SSR.

---

## 6. DAFTAR AI MODEL SKILLS

| Nama Skill | Lokasi Berkas | Deskripsi & Pemicu |
|:---|:---|:---|
| **`nextjs-seo-og-master`** | `.opencode/skills/nextjs-seo-og-master/SKILL.md` | Standar audit & implementasi Technical SEO, Dynamic OG/Twitter Image, Sitemap, Robots, dan JSON-LD. |
| **`nextjs-pwa-master`** | `.opencode/skills/nextjs-pwa-master/SKILL.md` | Standar audit & implementasi PWA, Web App Manifest, Service Worker, Offline Handling, dan Icon Suite. |
