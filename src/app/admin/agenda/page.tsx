// src/app/admin/agenda/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminAgendaClient from "@/components/admin/AdminAgendaClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("agenda.read");

  // 2. Setup pagination & params (Next.js 16 async searchParams)
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const search = resolvedParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createServerSupabase();

  // 3. Initial Data Fetch (Agendas + Total Count)
  let query = supabase
    .from("agendas")
    .select("*", { count: "exact" })
    .order("start_time", { ascending: false });

  // Apply search filter (example: search in title or description)
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: agendas, count: totalItems, error } = await query;

  if (error) {
    console.error("Error fetching agendas:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  return (
    <AdminAgendaClient
      initialAgendas={agendas || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
    />
  );
}
