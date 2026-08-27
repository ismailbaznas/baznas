// src/app/admin/program/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { cookies } from "next/headers";
import AdminProgramClient from "@/components/admin/AdminProgramClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminProgramPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("program.read");

  // 2. Setup pagination
  const currentPage = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = createServerSupabase();

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

  const { data: programs, count: totalItems, error } = await query;

  if (error) {
    console.error("Error fetching programs:", error.message);
    // In a real app, handle error gracefully. For now, pass empty array.
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  // 4. Fetch Categories (used for filtering/modal)
  // Reusing news categories as program categories for simplicity and schema compliance
  const { data: categories } = await supabase.from("categories").select("*");

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
