// src/app/admin/team/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { cookies } from "next/headers";
import AdminTeamClient from "@/components/admin/AdminTeamClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("team_members.read");

  // 2. Setup pagination
  const currentPage = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createServerSupabase();

  // 3. Initial Data Fetch (Team Members + Total Count)
  let query = supabase
    .from("team_members")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  // Apply search filter (example: search in name or position)
  if (search) {
    query = query.or(`name.ilike.%${search}%,position.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: team, count: totalItems, error } = await query;

  if (error) {
    console.error("Error fetching team members:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  return (
    <AdminTeamClient
      initialTeam={team || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
    />
  );
}
