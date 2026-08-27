// src/app/page.tsx
// Server Component
import { createServerSupabase } from "@/lib/server-supabase";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createServerSupabase();

  // Fetch recent news
  const { data: newsData } = await supabase
    .from("news")
    .select("id, title, slug, published_at, thumbnail_url")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  // Fetch recent programs
  const { data: programData } = await supabase
    .from("programs")
    .select("id, title, slug, image_url, description")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <HomeClient news={newsData || []} programs={programData || []} />
  );
}
