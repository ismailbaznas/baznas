// src/app/admin/users/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  // Guard 1: Check read permission
  const user = await guardAdminPage("user.manage");

  const currentPage = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Fetch users and roles data using service role client to bypass RLS
  const supabase = createServerSupabase();

  // Fetch all users
  let query = supabase
    .from("admin_users")
    .select("*, roles(name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.range(offset, offset + PAGE_SIZE - 1);
  
  const { data: users, count: totalItems, error } = await query;
  
  // Fetch all roles for the user modal
  const { data: roles } = await supabase.from("roles").select("*");

  if (error) {
    console.error("Error fetching admin users:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  return (
    <AdminUsersClient
      initialUsers={users || []}
      initialRoles={roles || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
    />
  );
}
