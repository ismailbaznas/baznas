// src/app/admin/page.tsx

import { getRbacUser } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { redirect } from "next/navigation";
import ExecutiveDashboardClient from "@/components/admin/ExecutiveDashboardClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getRbacUser();

  if (!user) {
    redirect("/login");
  }

  // SECURITY GUARD: If user has no staff/admin role (guest/tamu), redirect to user dashboard
  if (!user.role) {
    redirect("/akun");
  }

  const supabase = await createServerSupabase();

  // Fetch real-time aggregate counts in parallel
  const [
    { count: newsCount },
    { count: programCount },
    { count: usersCount },
    { count: newMessagesCount },
    { count: totalMessagesCount },
    { count: newBantuanCount },
    { count: approvedBantuanCount },
    { count: totalBantuanCount },
    { count: docsCount }
  ] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }),
    supabase.from("admin_users").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("mustahik_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("mustahik_applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("mustahik_applications").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true })
  ]);

  const counts = {
    newsCount: newsCount || 0,
    programCount: programCount || 0,
    usersCount: usersCount || 0,
    newMessagesCount: newMessagesCount || 0,
    totalMessagesCount: totalMessagesCount || 0,
    newBantuanCount: newBantuanCount || 0,
    approvedBantuanCount: approvedBantuanCount || 0,
    totalBantuanCount: totalBantuanCount || 0,
    docsCount: docsCount || 0,
  };

  return (
    <ExecutiveDashboardClient
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      counts={counts}
    />
  );
}
