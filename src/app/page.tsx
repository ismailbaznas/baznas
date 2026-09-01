// src/app/page.tsx
// Server Component - Ultra Fast Single View Query with Graceful Fallback

import { createServerSupabase } from "@/lib/server-supabase";
import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
    description: SITE_CONFIG.description,
    url: "/",
  },
};

export default async function HomePage() {
  const supabase = await createServerSupabase();

  // 1. PRIMARY: Fetch from PostgreSQL Unified View (1 Single Database Request)
  const { data: viewData, error: viewError } = await (supabase
    .from("view_homepage_data" as any) as any)
    .select("*")
    .maybeSingle();

  if (!viewError && viewData) {
    const payload = viewData as any;
    const settings = (payload.settings as Record<string, string>) || {};
    const transparencyStats = payload.transparency_stats || {};

    return (
      <HomeClient 
        news={payload.news || []} 
        programs={payload.programs || []} 
        settings={settings}
        transparencyStats={transparencyStats}
        recentDocuments={payload.recent_documents || []}
      />
    );
  }

  // 2. FALLBACK: Parallel Multi-Table Query (if view is not yet created in Supabase SQL editor)
  const [
    { data: newsData },
    { data: programData },
    { data: currentSettings },
    { data: transparencyStatsData },
    { data: recentDocs }
  ] = await Promise.all([
    // 1. Fetch recent news (pruned: no heavy HTML content)
    supabase
      .from("news")
      .select("id, title, slug, published_at, thumbnail_url, categories(name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
    // 2. Fetch recent programs
    supabase
      .from("programs")
      .select("id, title, slug, image_url, description, categories(name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
    // 3. Fetch all site settings
    supabase
      .from("site_settings")
      .select("*"),
    // 4. Fetch transparency statistics
    supabase
      .from("transparency_stats")
      .select("*"),
    // 5. Fetch recent public documents
    supabase
      .from("documents")
      .select("id, title, document_url, type, year")
      .eq("is_public", true)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const transparencyStats = transparencyStatsData?.reduce((acc: any, item: any) => {
    acc[item.key] = {
      label: item.label,
      value: item.value,
      sub_label: item.sub_label
    };
    return acc;
  }, {} as Record<string, { label: string; value: string; sub_label: string }>) || {};

  // Unpack settings to a simple key-value string dictionary
  const settingsMap = currentSettings?.reduce((acc: Record<string, string>, setting: any) => {
    acc[setting.key] = setting.value && typeof setting.value === "object" && "value" in setting.value 
      ? String(setting.value.value) 
      : String(setting.value);
    return acc;
  }, {} as Record<string, string>) || {};

  return (
    <HomeClient 
      news={newsData || []} 
      programs={programData || []} 
      settings={settingsMap}
      transparencyStats={transparencyStats}
      recentDocuments={recentDocs || []}
    />
  );
}
