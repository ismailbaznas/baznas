---
name: nextjs-seo-og-master
description: Use when auditing, implementing, or optimizing technical SEO, Open Graph, dynamic OG/Twitter images, sitemap, robots.txt, structured data (JSON-LD), and local SEO in Next.js (App Router) projects.
---

# 🚀 NEXT.JS SEO, OPEN GRAPH, SOCIAL SHARING & LOCAL SEO MASTER SKILL

Acuan standar arsitektur dan alur kerja teknis untuk Senior Next.js SEO Engineer, Technical SEO Specialist, dan Web Performance Engineer dalam membangun sistem SEO kelas enterprise, ramah crawler, aman, cepat, dan berestetika tinggi.

---

## 🧭 10-STEP MANDATORY SEO WORKFLOW

1. **Inspect Project:** Pahami struktur folder App Router, layouts, dynamic routes, remote image whitelist (`next.config`), database, dan metadata yang ada tanpa mengubah kode terlebih dahulu.
2. **Understand Architecture:** Cek server vs client boundary, runtime requirements, dan environment URL.
3. **Audit Existing Implementation:** Identifikasi metadata duplikat, broken links, missing canonicals, atau accidental indexing pada rute admin/private.
4. **Identify Problems & Edge Cases:** Analisis potensi runtime error (misal: Dynamic Server Usage di sitemap, Satori z-index di OG image).
5. **Create Implementation Plan:** Buat checklist terstruktur mencakup metadata dasar, dynamic OG, sitemap, robots, dan structured data.
6. **Implement SEO Engine & Helpers:** Bangun helper sentral (`seo.ts`), komponen renderer JSON-LD (`JsonLd.tsx`), dan dynamic images (`opengraph-image.tsx`).
7. **Implement Route Metadata:** Pasang canonical, dynamic `generateMetadata()`, dan JSON-LD di setiap rute publik & dynamic slug.
8. **Lock Security & Noindex:** Tambahkan `robots: { index: false, follow: false }` pada `/admin`, `/login`, `/accept-invite`, dan API routes.
9. **Verify & Build:** Jalankan `npm run lint` dan `npm run build` untuk memvalidasi zero-error TypeScript, SSR, dan Turbopack.
10. **Re-Audit & Output Matrix:** Buat laporan audit komprehensif berdasar indexability matrix.

---

## 🌐 1. METADATA BASE & ROOT FOUNDATION (`src/app/layout.tsx`)

### A. Dynamic & Safe `metadataBase`
Hindari hardcoded URL localhost pada mode produksi:
```typescript
// src/lib/seo.ts
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_ADMIN_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://production-domain.com";
}
```

### B. Title Template & Root Metadata
```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#004229" },
    { media: "(prefers-color-scheme: dark)", color: "#031407" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Nama Lembaga / Brand — Slogan Utama",
    template: "%s — Nama Lembaga / Brand",
  },
  description: "Deskripsi representatif organisasi (150-160 karakter)...",
  keywords: ["Keyword 1", "Keyword 2", "Entitas Lokal"],
  authors: [{ name: "Nama Lembaga", url: getBaseUrl() }],
  creator: "Nama Lembaga",
  publisher: "Nama Badan Resmi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "./",
    title: "Nama Lembaga — Slogan Utama",
    description: "Deskripsi representatif...",
    siteName: "Nama Lembaga Resmi",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nama Lembaga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nama Lembaga — Slogan Utama",
    description: "Deskripsi representatif...",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

---

## 🎨 2. DYNAMIC OG & TWITTER IMAGE (1200 × 630 PX)

Gunakan Next.js `ImageResponse` dari `next/og`:
- **Ukuran:** 1200 × 630 px
- **Palet Warna:** Primary (#004229), Accent Gold (#D4AF37), Neutral Light (#ffffff).
- **Aturan Satori / ImageResponse:**
  - ❌ DILARANG memakai `zIndex` (tidak didukung Satori).
  - ❌ DILARANG memakai simbol unicode langka (misal `✓`) yang memicu dynamic font download error 400. Gunakan `•` atau SVG path.
  - ✅ Gunakan flexbox murni (`display: flex`, `flexDirection: column/row`).

```tsx
// src/app/opengraph-image.tsx & src/app/twitter-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Nama Lembaga — Slogan Resmi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#004229",
          padding: "60px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Institutional Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#D4AF37",
              color: "#002112",
              padding: "8px 20px",
              borderRadius: "9999px",
              fontSize: "15px",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Lembaga Resmi
          </div>
        </div>

        {/* Brand Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.15 }}>
            Judul Utama Lembaga
          </div>
          <div style={{ fontSize: "24px", color: "#e2e8f0", lineHeight: 1.4 }}>
            Deskripsi institusional yang kredibel dan jelas saat dibagikan di WhatsApp, FB, dan LinkedIn.
          </div>
        </div>

        {/* Footer Features */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "24px" }}>
          <div style={{ display: "flex", gap: "24px", color: "#ffe088", fontSize: "16px", fontWeight: 600 }}>
            <span>• Amanah</span>
            <span>• Transparan</span>
            <span>• Profesional</span>
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>domain.go.id</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

---

## ⚡ 3. DYNAMIC SITEMAP & ROBOTS

### A. Dynamic Robots (`src/app/robots.ts`)
```typescript
import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/login",
          "/accept-invite",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

### B. Dynamic Sitemap Bebas Cookie Error (`src/app/sitemap.ts`)
⚠️ **PERINGATAN NEXT.JS 16:** Jangan memanggil `cookies()` di dalam `sitemap.ts` karena akan memicu `DynamicServerUsage Error`. Gunakan client Supabase stateless tanpa cookie handler:

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import { createPublicServerSupabase } from "@/lib/server-supabase";

export const revalidate = 3600; // 1 Jam ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/program`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/kabar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/transparansi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/layanan`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const supabase = createPublicServerSupabase();
    const [{ data: news }, { data: programs }] = await Promise.all([
      supabase.from("news").select("slug, updated_at, published_at").eq("is_published", true).order("published_at", { ascending: false }),
      supabase.from("programs").select("slug, updated_at, created_at").eq("is_active", true).order("created_at", { ascending: false }),
    ]);

    const newsRoutes: MetadataRoute.Sitemap = ((news as any[]) || []).map((item) => ({
      url: `${baseUrl}/kabar/${item.slug}`,
      lastModified: new Date(item.updated_at || item.published_at || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const programRoutes: MetadataRoute.Sitemap = ((programs as any[]) || []).map((item) => ({
      url: `${baseUrl}/program/${item.slug}`,
      lastModified: new Date(item.updated_at || item.created_at || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...programRoutes, ...newsRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}
```

---

## 📑 4. ASYNC `generateMetadata()` PADA DYNAMIC SLUG

Di Next.js 16, `params` adalah `Promise<{ slug: string }>`:

```typescript
// src/app/kabar/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("news")
    .select("title, content, published_at, thumbnail_url, categories(name)")
    .eq("slug", slug)
    .single();

  const item = data as any;
  if (!item) {
    return { title: "Konten Tidak Ditemukan", robots: { index: false } };
  }

  const plainExcerpt = (item.content || "").replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim().substring(0, 160) + "...";
  const baseUrl = getBaseUrl();
  const canonicalUrl = `/kabar/${slug}`;

  return {
    title: item.title,
    description: plainExcerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${item.title} — Nama Lembaga`,
      description: plainExcerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: item.published_at,
      section: (item.categories as any)?.name || "Berita",
      images: [
        {
          url: item.thumbnail_url || `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} — Nama Lembaga`,
      description: plainExcerpt,
      images: [item.thumbnail_url || `${baseUrl}/twitter-image`],
    },
  };
}
```

---

## 🏛️ 5. STRUCTURED DATA / JSON-LD ARCHITECTURE

### A. Component Renderer (`src/components/seo/JsonLd.tsx`)
```tsx
import React from "react";

export default function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

### B. Standard Schema Generator List:
1. **`GovernmentOrganization` / `NGO`:** Name, alternateName, url, logo, description, address, geo (lat, long), contactPoint, sameAs.
2. **`WebSite`:** ID `#website`, publisher rel `#organization`.
3. **`BreadcrumbList`:** Home (`/`) → Kategori (`/kabar`) → Detail Judul (`/kabar/slug`).
4. **`NewsArticle`:** headline, description, image, datePublished, dateModified, author, publisher, mainEntityOfPage.
5. **`Service` / Program:** name, description, serviceType, provider, areaServed.

---

## 📍 6. LOCAL SEO & NAP CONSISTENCY

- **Name, Address, Phone (NAP):** Wajib 100% konsisten antara footer, contact page, metadata, dan JSON-LD.
- **Google Maps Direct URL:** Gunakan formatted search query:
  `https://maps.google.com/?q=Nama+Lembaga+Kecamatan+Kabupaten+Provinsi`
- **Jangan mengarang data alamat atau nomor kontak jika belum tersedia (tandai `DATA REQUIRED`).**

---

## 🛡️ 7. VERIFIKASI SEBELUM SELESAI
1. Jalankan `npm run lint` & `npm run build`.
2. Pastikan output rute:
   - `/sitemap.xml` → status `Static` atau `ISR (1h)`.
   - `/robots.txt` → status `Static`.
   - `/manifest.webmanifest` → status `Static`.
   - `/opengraph-image` & `/twitter-image` → status `Static (1200x630)`.
   - `/_not-found` → status `Static`.
