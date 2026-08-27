// src/app/admin/roles/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/supabase";
import { ALL_PERMISSION_IDS } from "@/lib/rbac/constants";
import { cookies } from "next/headers";
import AdminRolesClient from "@/components/admin/AdminRolesClient";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  // Guard 1: Check read permission
  const user = await guardAdminPage("role.manage");
  
  // Fetch initial roles data using service role client to bypass RLS on system tables
  const supabase = createServerSupabase();

  const { data: roles, error } = await supabase.from("roles").select("*").order("is_system", {ascending: false}).order("name", {ascending: true});

  if (error) {
    console.error("Error fetching roles:", error.message);
  }

  return (
    <AdminRolesClient
      initialRoles={roles || []}
      user={user}
      allPermissions={ALL_PERMISSION_IDS}
    />
  );
}
