// src/app/api/admin/profile/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase, createServiceRoleClient } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser || !authUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama lengkap tidak boleh kosong" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const serviceClient = createServiceRoleClient();

    // 1. Update name in public.admin_users
    const { error: dbError } = await (serviceClient
      .from("admin_users") as any)
      .update({ 
        name: trimmedName,
        last_active_at: new Date().toISOString()
      })
      .eq("email", authUser.email);

    if (dbError) {
      console.error("Error updating admin_users:", dbError);
      return NextResponse.json({ error: "Gagal memperbarui profil di database" }, { status: 500 });
    }

    // 2. Update metadata in auth.users
    try {
      await (serviceClient.auth.admin as any).updateUserById(authUser.id, {
        user_metadata: {
          ...authUser.user_metadata,
          full_name: trimmedName,
        },
      });
    } catch (metaErr) {
      console.warn("Could not update auth user metadata:", metaErr);
    }

    return NextResponse.json({ 
      success: true, 
      name: trimmedName,
      message: "Profil nama berhasil diperbarui" 
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: err.message || "Terjadi kesalahan internal" }, { status: 500 });
  }
}
