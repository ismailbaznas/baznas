// src/app/layanan/page.tsx

import LayananClient from "@/components/LayananClient";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Layanan Zakat & Bantuan",
  description:
    "Layanan hitung zakat online dengan kalkulator nisab terkini dan formulir permohonan bantuan mustahik BAZNAS Kabupaten Boven Digoel.",
  alternates: {
    canonical: "/layanan",
  },
  openGraph: {
    title: "Layanan Zakat & Bantuan — BAZNAS Kabupaten Boven Digoel",
    description:
      "Layanan hitung zakat online dengan kalkulator nisab terkini dan formulir permohonan bantuan mustahik BAZNAS Kabupaten Boven Digoel.",
    url: "/layanan",
  },
};

export default function LayananPage() {
    const breadcrumbJsonLd = getBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Layanan", url: "/layanan" },
    ]);

    return (
        <>
            <JsonLd data={breadcrumbJsonLd} />
            <LayananClient />
        </>
    );
}