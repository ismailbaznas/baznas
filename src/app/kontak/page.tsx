// src/app/kontak/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import ContactFormClient from "@/components/ContactFormClient";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description:
    "Hubungi kantor BAZNAS Kabupaten Boven Digoel di Tanah Merah, Papua Selatan. Alamat lengkap, nomor telepon, WhatsApp, email, dan rekening resmi zakat.",
  alternates: {
    canonical: "/kontak",
  },
  openGraph: {
    title: "Kontak & Lokasi — BAZNAS Kabupaten Boven Digoel",
    description:
      "Hubungi kantor BAZNAS Kabupaten Boven Digoel di Tanah Merah, Papua Selatan. Alamat lengkap, nomor telepon, WhatsApp, email, dan rekening resmi zakat.",
    url: "/kontak",
  },
};

export default async function ContactPage() {
    const supabase = await createServerSupabase();

    // Fetch site settings and bank accounts in parallel
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
      { name: "Kontak", url: "/kontak" },
    ]);

    return (
        <>
            <JsonLd data={breadcrumbJsonLd} />
            <ContactFormClient 
                settings={settingsMap} 
                initialBankAccounts={accountsRes.data || []} 
            />
        </>
    );
}
