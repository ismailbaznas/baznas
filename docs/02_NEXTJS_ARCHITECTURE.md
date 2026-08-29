# ⚡ ARSITEKTUR & KONVENSI NEXT.JS 16 (APP ROUTER)
*Acuan teknis khusus untuk routing, Server vs Client Components, caching, data fetching, dan standar Next.js 16.*

---

## 1. ASYNC PAGE PROPS (`params` & `searchParams`)

Pada Next.js 15 dan 16+, `params` dan `searchParams` pada Server Components (`page.tsx`) adalah sebuah **`Promise`**.

```tsx
// ✅ BENAR (Wajib di Next.js 16):
export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const search = resolvedParams.search || "";
  ...
}

// ❌ SALAH (Menyebabkan warning & kegagalan kompilasi):
export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1");
  ...
}
```

---

## 2. SERVER VS CLIENT COMPONENT BOUNDARY

| Jenis Komponen | Kapan Digunakan | Aturan & Ketentuan |
|:---|:---|:---|
| **Server Component** (Default) | Halaman listing publik, detail berita/program, layout, dan wrapper rute admin. | • Tidak menggunakan direktif `"use client"`.<br>• Mengambil data langsung via `createServerSupabase()`.<br>• Mendukung streaming dan zero-bundle JavaScript ke browser. |
| **Client Component** (`"use client"`) | Komponen yang membutuhkan hook React (`useState`, `useEffect`), event handler (`onClick`, `onChange`), atau form modal interaktif. | • Menerima initial data dari Server Component sebagai props.<br>• Wajib menyinkronkan state lokal saat props server diperbarui. |

### Sinkronisasi State Client dengan Server Props
Ketika Server Component me-refresh data via `router.refresh()`, state lokal di Client Component tidak otomatis berubah tanpa listener:
```tsx
const [newsList, setNewsList] = useState(initialNews);

// Wajib ditambahkan pada seluruh Admin Client Component:
useEffect(() => {
  setNewsList(initialNews);
}, [initialNews]);
```

---

## 3. PARALELISASI KUERI SERVER (`Promise.all`)

DILARANG menjalankan kueri database Supabase secara sekuensial (waterfall `await` berturut-turut) di Server Component:

```tsx
// ✅ BENAR (Eksekusi Paralel ~120ms):
const [
  { data: newsData },
  { data: programData },
  { data: currentSettings },
  { data: statsData }
] = await Promise.all([
  supabase.from("news").select("...").eq("is_published", true).limit(3),
  supabase.from("programs").select("...").eq("is_active", true).limit(3),
  supabase.from("site_settings").select("*"),
  supabase.from("transparency_stats").select("*")
]);

// ❌ SALAH (Waterfall Lambat ~500-750ms):
const { data: newsData } = await supabase.from("news").select("...");
const { data: programData } = await supabase.from("programs").select("...");
const { data: currentSettings } = await supabase.from("site_settings").select("*");
```

---

## 4. STRATEGI CACHING (ISR vs DYNAMIC)

1. **Halaman Publik Informasional (`/`, `/tentang`, `/program`, `/transparansi`, `/kabar`, `/kontak`, `/layanan`):**
   - Menggunakan Incremental Static Regeneration (ISR): `export const revalidate = 60;`.
   - Menghasilkan respon super cepat (TTFB < 50ms) langsung dari Static/Edge Cache.
2. **Halaman Admin & Mutasi Data (`/admin/*`, `/login`):**
   - Menggunakan `export const dynamic = "force-dynamic";`.
   - Menjamin keamanan otentikasi real-time dan evaluasi session cookie per-request.

---

## 5. CODE-SPLITTING MODAL CMS (`next/dynamic`)

Form modal admin berukuran besar (yang memuat validasi, icon, form state, date parser) **WAJIB** diimpor secara dinamis untuk memperkecil initial chunk size tabel:

```tsx
import dynamic from "next/dynamic";

const AdminBeritaModal = dynamic(() => import("./AdminBeritaModal"), { 
  ssr: false 
});
```

---

## 6. PANDUAN PENGGUNAAN `next/image`

1. **Seluruh gambar wajib menggunakan `<Image />`** dari `next/image`.
2. Gunakan properti `priority` hanya pada gambar Largest Contentful Paint (LCP) seperti Banner Hero.
3. Cantumkan properti `sizes` pada gambar fleksibel (`fill`):
   ```tsx
   <div className="relative w-full h-56">
     <Image
       src={item.thumbnail_url}
       alt={item.title}
       fill
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
       className="object-cover"
     />
   </div>
   ```
4. Seluruh domain eksternal wajib didaftarkan di `next.config.mjs`.
