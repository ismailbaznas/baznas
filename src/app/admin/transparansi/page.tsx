// src/app/admin/transparansi/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminDocumentClient from "@/components/admin/AdminDocumentClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("dokumentasi.read");

  // 2. Setup pagination & params (Next.js 16 async searchParams)
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1");
  const search = resolvedParams.search || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createServerSupabase();

  // 3. Initial Data Fetch (Documents + Total Count)
  let query = supabase
    .from("documents")
    .select("*", { count: "exact" })
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });

  // Apply search filter (example: search in title or description)
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: documents, count: totalItems, error } = await query;

  if (error) {
    console.error("Error fetching documents:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;

  // The 'type' filter values are hardcoded based on the schema:
  const documentTypes = [
    { label: "Laporan Penghimpunan", value: "laporan_penghimpunan" },
    { label: "Laporan Penyaluran", value: "laporan_penyaluran" },
    { label: "Laporan Tahunan", value: "laporan_tahunan" },
    { label: "Dokumen Publik Lain", value: "dokumen_publik" },
  ];

  return (
    <AdminDocumentClient
      initialDocuments={documents || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
      documentTypes={documentTypes}
    />
  );
}
