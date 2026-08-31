// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import { createPublicServerSupabase } from "@/lib/server-supabase";

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/program`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kabar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transparansi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const supabase = createPublicServerSupabase();

    // Fetch published news and active programs in parallel
    const [newsRes, programsRes] = await Promise.all([
      supabase
        .from("news")
        .select("slug, updated_at, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
      supabase
        .from("programs")
        .select("slug, updated_at, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

    const newsRoutes: MetadataRoute.Sitemap = ((newsRes.data as any[]) || []).map((item: any) => ({
      url: `${baseUrl}/kabar/${item.slug}`,
      lastModified: new Date(item.updated_at || item.published_at || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const programRoutes: MetadataRoute.Sitemap = ((programsRes.data as any[]) || []).map((item: any) => ({
      url: `${baseUrl}/program/${item.slug}`,
      lastModified: new Date(item.updated_at || item.created_at || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...programRoutes, ...newsRoutes];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    return staticRoutes;
  }
}
