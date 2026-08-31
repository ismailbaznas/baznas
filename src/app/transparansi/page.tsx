// src/app/transparansi/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import TransparansiClient from "@/components/TransparansiClient";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Transparansi & Laporan",
  description:
    "Laporan keuangan, statistik penghimpunan dan penyaluran ZIS, serta dokumen publik resmi terverifikasi BAZNAS Kabupaten Boven Digoel.",
  alternates: {
    canonical: "/transparansi",
  },
  openGraph: {
    title: "Transparansi & Laporan — BAZNAS Kabupaten Boven Digoel",
    description:
      "Laporan keuangan, statistik penghimpunan dan penyaluran ZIS, serta dokumen publik resmi terverifikasi BAZNAS Kabupaten Boven Digoel.",
    url: "/transparansi",
  },
};

export default async function TransparansiPage() {
    const supabase = await createServerSupabase();

    // Fetch documents and stats in parallel
    const [
        { data: documents, error },
        { data: statsData }
    ] = await Promise.all([
        supabase
            .from("documents")
            .select(`id, title, description, document_url, type, year, created_at`)
            .eq("is_public", true)
            .order("year", { ascending: false })
            .order("created_at", { ascending: false }),
        supabase
            .from("transparency_stats")
            .select("*")
    ]);

    const documentsList = (documents || []) as any[];

    // Map fetched stats to a direct key-value object
    const statsMap = statsData?.reduce((acc: any, item: any) => {
        acc[item.key] = {
            value: item.value,
            sub_label: item.sub_label
        };
        return acc;
    }, {} as Record<string, { value: string; sub_label: string }>) || {};

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto mb-4" />
                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-red-600 dark:text-red-400">Gagal Memuat Dokumen</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data transparansi. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    const breadcrumbJsonLd = getBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Transparansi & Laporan", url: "/transparansi" },
    ]);

    return (
        <>
            <JsonLd data={breadcrumbJsonLd} />
            <TransparansiClient documents={documentsList} stats={statsMap} />
        </>
    );
}
