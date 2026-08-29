// src/app/admin/users/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  // Guard 1: Check read permission
  const user = await guardAdminPage("user.manage");

  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const search = resolvedParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Fetch users and roles data using service role client to bypass RLS
  const supabase = await createServerSupabase();

  // Fetch all users
  let query = supabase
    .from("admin_users")
    .select("*, roles(name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.range(offset, offset + PAGE_SIZE - 1);
  
  // Parallel fetch: users + count and roles
  const [{ data: users, count: totalItems, error }, { data: roles }] = await Promise.all([
    query,
    supabase.from("roles").select("*")
  ]);

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
