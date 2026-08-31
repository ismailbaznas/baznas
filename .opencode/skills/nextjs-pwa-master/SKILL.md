---
name: nextjs-pwa-master
description: Use when implementing, auditing, or configuring Progressive Web Apps (PWA), Web App Manifest, Service Workers, offline caching strategies, mobile installability, and icon systems in Next.js (App Router) projects.
---

# 📱 NEXT.JS PWA, WEB APP MANIFEST, SERVICE WORKER & INSTALLABILITY MASTER SKILL

Panduan arsitektur dan SOP teknis standar industri untuk mengimplementasikan Progressive Web App (PWA) kelas produksi pada Next.js (App Router) dengan performa tinggi, 100% kompatibel dengan Turbopack & React 19, bebas ketergantungan library pihak ketiga yang rentan rusak, dan memiliki proteksi keamanan rute yang ketat.

---

## 🧭 10-STEP PWA ENGINEERING WORKFLOW

1. **Inspect & Audit Baseline:** Periksa versi Next.js, `manifest`, icon di `public/`, dan service worker yang ada tanpa merusak kode.
2. **Standard Native Strategy:** Hindari library usang (`next-pwa`, webpack-only plugins). Gunakan **Native Standard Service Worker** (`public/sw.js`) + **Next.js Manifest Route** (`src/app/manifest.ts`).
3. **Icon Suite Generation:** Sediakan icon 192x192, 512x512, maskable icon (dengan 20% safe-zone padding), dan apple-touch-icon 180x180.
4. **Web App Manifest Implementation:** Konfigurasikan `src/app/manifest.ts` dengan `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `theme_color`, dan `icons`.
5. **Lightweight Service Worker:** Buat `public/sw.js` dengan strategi Network-First untuk navigasi halaman dan Cache-First untuk aset statis.
6. **Strict Security Boundaries:** Larang keras caching pada rute `/admin/*`, `/api/*`, `/login`, mutasi HTTP (POST/PUT/DELETE), dan token autentikasi.
7. **Offline Fallback Route:** Bangun halaman `/offline` yang ramah pengguna dengan tombol coba ulang dan proteksi `robots: { index: false }`.
8. **Hydration-Safe PWA Registration:** Daftarkan service worker melalui Client Component murni (`src/components/pwa/PwaRegister.tsx`) yang berjalan saat event `window.load`.
9. **iOS / Apple Web App Compatibility:** Tambahkan properti `appleWebApp` dan link icon pada `src/app/layout.tsx`.
10. **Build & Installability Verification:** Uji dengan `npm run build` dan verifikasi bahwa seluruh rute `/manifest.webmanifest`, `/offline`, dan `/robots.txt` berstatus statis.

---

## 🎨 1. ICON SYSTEM & MASKABLE SAFEZONE

PWA wajib memiliki icon launcher standar dan maskable icon agar logo tidak terpotong pada launcher Android/iOS yang berbentuk lingkaran/squircle.

### Standar Ukuran Icon:
- `/icons/icon-192x192.png` (`purpose: "any"`)
- `/icons/icon-512x512.png` (`purpose: "any"`)
- `/icons/icon-maskable-192x192.png` (`purpose: "maskable"`, logo berada di dalam 80% area tengah dengan background solid tema)
- `/icons/icon-maskable-512x512.png` (`purpose: "maskable"`)
- `/icons/apple-touch-icon.png` (180x180)

### Script Pembuat Icon Otomatis (Node.js + Sharp):
```javascript
const sharp = require('sharp');
const fs = require('fs');

if (!fs.existsSync('public/icons')) fs.mkdirSync('public/icons', { recursive: true });

async function generateIcons() {
  const source = 'public/icon.png';
  
  // Standard Icons
  await sharp(source).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/icons/icon-192x192.png');
  await sharp(source).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/icons/icon-512x512.png');
  await sharp(source).resize(180, 180, { fit: 'contain', background: { r: 0, g: 66, b: 41, alpha: 1 } }).png().toFile('public/icons/apple-touch-icon.png');

  // Maskable Icons with Theme Padding
  const inner512 = await sharp(source).resize(380, 380, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 66, b: 41, alpha: 1 } } })
    .composite([{ input: inner512, gravity: 'center' }])
    .png()
    .toFile('public/icons/icon-maskable-512x512.png');
}
generateIcons();
```

---

## 📜 2. WEB APP MANIFEST (`src/app/manifest.ts`)

```typescript
// src/app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nama Lembaga / Brand",
    short_name: "Nama Pendek",
    description: "Deskripsi lengkap aplikasi...",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#004229",
    lang: "id",
    categories: ["government", "finance", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
```

---

## ⚙️ 3. LIGHTWEIGHT & SECURE SERVICE WORKER (`public/sw.js`)

```javascript
// public/sw.js
const CACHE_NAME = 'app-cache-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Only handle GET
  if (request.method !== 'GET') return;

  // 2. Strict Security: Never cache admin, api, login, or external auth
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/accept-invite') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('google.com')
  ) {
    return;
  }

  // 3. HTML Navigation -> Network First with Offline Page Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return (await caches.match(OFFLINE_URL)) || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // 4. Static Assets -> Cache First with Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons') ||
    url.pathname.startsWith('/images') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          fetch(request).then((res) => {
            if (res.status === 200) caches.open(CACHE_NAME).then((c) => c.put(request, res));
          }).catch(() => {});
          return cached;
        }
        return fetch(request).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        });
      })
    );
  }
});
```

---

## 🔌 4. PWA REGISTRATION COMPONENT (`src/components/pwa/PwaRegister.tsx`)

Mencegah hydration mismatch dengan mendaftarkan Service Worker hanya di client-side:

```tsx
// src/components/pwa/PwaRegister.tsx
"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" || window.location.hostname === "localhost")
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("PWA Registered:", reg.scope))
          .catch((err) => console.warn("PWA Reg Failed:", err));
      });
    }
  }, []);

  return null;
}
```

---

## 🔒 5. OFFLINE FALLBACK PAGE (`src/app/offline/page.tsx`)

```tsx
// src/app/offline/page.tsx
import OfflineClient from "@/components/OfflineClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koneksi Terputus (Offline)",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
```

---

## 🛡️ 6. KEAMANAN & BATASAN KETAT

1. **DILARANG** melakukan cache data mustahik, data muzaki, atau laporan keuangan internal.
2. **DILARANG** melakukan cache respons mutasi (POST, PUT, DELETE, PATCH).
3. **DILARANG** menyimpan session cookie atau Supabase auth token di dalam CacheStorage.
4. **Wajib** menambahkan `/offline` pada `disallow` di `/robots.txt` agar mesin pencari tidak mengindeks halaman fallback offline.
