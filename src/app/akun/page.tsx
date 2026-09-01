// src/app/akun/page.tsx
// Server Component for the Guest / User Portal Dashboard

import { createServerSupabase } from "@/lib/server-supabase";
import { getRbacUser } from "@/lib/rbac/server";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/user/UserDashboardClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akun Saya",
  description: "Portal akun pengguna dan layanan publik BAZNAS Kabupaten Boven Digoel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AkunPage() {
  const supabase = await createServerSupabase();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const rbacUser = await getRbacUser();

  const userData = {
    id: authUser.id,
    email: authUser.email || "",
    name: rbacUser?.name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Pengguna",
    role: rbacUser?.role || null,
    avatar_url: rbacUser?.avatar_url || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
    provider: authUser.app_metadata?.provider || "email",
    created_at: authUser.created_at,
  };

  return <UserDashboardClient user={userData} />;
}
