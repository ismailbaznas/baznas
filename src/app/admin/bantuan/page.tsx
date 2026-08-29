// src/app/admin/bantuan/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminBantuanClient from "@/components/admin/AdminBantuanClient";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBantuanPage() {
  // Guard: Check contact_messages.read permission for mustahik applications view
  const user = await guardAdminPage("contact_messages.read");

  const supabase = await createServerSupabase();

  // Fetch mustahik applications from database
  const { data: applications, error } = await supabase
    .from("mustahik_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mustahik applications:", error);
    return (
      <div className="p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto mb-4" />
        <h1 className="text-2xl font-playfair font-bold text-[#ba1a1a]">Gagal Memuat Permohonan</h1>
        <p className="text-body-md text-on-surface-variant">Terjadi kesalahan kueri database: {error.message}</p>
      </div>
    );
  }

  const applicationsList = (applications || []) as any[];

  return (
    <AdminBantuanClient 
      initialApplications={applicationsList}
      user={user}
    />
  );
}
