// src/app/layanan/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
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

export default async function LayananPage() {
    const supabase = await createServerSupabase();

    // Fetch site settings and active bank accounts in parallel
    const [settingsRes, accountsRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("bank_accounts").select("*").eq("status", "active").order("created_at", { ascending: true })
    ]);

    const settingsMap = settingsRes.data?.reduce((acc: Record<string, string>, setting: any) => {
        acc[setting.key] = setting.value && typeof setting.value === "object" && "value" in setting.value 
            ? String(setting.value.value) 
            : String(setting.value);
        return acc;
    }, {} as Record<string, string>) || {};

    const breadcrumbJsonLd = getBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Layanan", url: "/layanan" },
    ]);

    return (
        <>
            <JsonLd data={breadcrumbJsonLd} />
            <LayananClient 
                bankAccounts={accountsRes.data || []} 
                settings={settingsMap} 
            />
        </>
    );
}