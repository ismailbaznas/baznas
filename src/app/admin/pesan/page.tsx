// src/app/admin/pesan/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { cookies } from "next/headers";
import AdminPesanClient from "@/components/admin/AdminPesanClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

// Pagination constants
const PAGE_SIZE = 10;

export default async function AdminPesanPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; type?: string };
}) {
  // 1. Guard 1: Check read permission
  const user = await guardAdminPage("contact_messages.read");

  // 2. Setup pagination
  const currentPage = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const typeFilter = searchParams.type || "";
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createServerSupabase();

  // 3. Initial Data Fetch (Messages + Total Count)
  let query = supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply search filter (name, subject, message)
  if (search) {
    query = query.or(`name.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`);
  }
  
  // Apply type filter
  if (typeFilter) {
    query = query.eq('type', typeFilter);
  }

  // Apply pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: messages, count: totalItems, error } = await query;

  if (error) {
    console.error("Error fetching contact messages:", error.message);
  }

  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 0;
  
  // Hardcoded types based on schema
  const messageTypes = [
    { label: "Konsultasi", value: "konsultasi" },
    { label: "Pengaduan", value: "pengaduan" },
    { label: "Umum", value: "umum" },
  ];

  return (
    <AdminPesanClient
      initialMessages={messages || []}
      totalItems={totalItems || 0}
      totalPages={totalPages}
      currentPage={currentPage}
      search={search}
      pageSize={PAGE_SIZE}
      user={user}
      messageTypes={messageTypes}
    />
  );
}
