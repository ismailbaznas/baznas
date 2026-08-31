// src/app/offline/page.tsx
import OfflineClient from "@/components/OfflineClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koneksi Terputus (Offline)",
  description: "Halaman penanganan koneksi offline BAZNAS Kabupaten Boven Digoel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
