// src/app/admin/program/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminProgramClient from "@/components/admin/AdminProgramClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("program.read");

  // 2. Setup pagination & params (Next.js 16 async searchParams)
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const search = resolvedParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createServerSupabase();

  // 3. Initial Data Fetch (Programs + Total Count)
  let query = supabase
    .from("programs")
    .select("*, categories(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply search filter (example: search in title or description)
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  // Parallel fetch: programs + count and categories
  const [{ data: programs, count: totalItems, error }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("*")
  ]);

  if (error) {
    console.error("Error fetching programs:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  return (
    <AdminProgramClient
      initialPrograms={programs || []}
      initialCategories={categories || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
    />
  );
}
