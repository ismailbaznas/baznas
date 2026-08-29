// src/app/page.tsx
// Server Component

import { createServerSupabase } from "@/lib/server-supabase";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createServerSupabase();

  // Execute all 5 queries in parallel via Promise.all (no waterfall)
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
