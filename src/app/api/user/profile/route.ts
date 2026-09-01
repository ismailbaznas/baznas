// src/app/api/user/profile/route.ts
// API route for authenticated users (both Guests and Admins) to manage their profile & password

import { NextResponse } from "next/server";
import { createServerSupabase, createServiceRoleClient } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser || !authUser.email) {
      return NextResponse.json({ error: "Sesi login tidak valid atau telah berakhir." }, { status: 401 });
    }

    const body = await request.json();
    const { action, name, newPassword, confirmPassword } = body;

    const serviceClient = createServiceRoleClient();

    // ACTION 1: UPDATE NAME
    if (action === "update_name") {
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Nama lengkap tidak boleh kosong." }, { status: 400 });
      }

      const trimmedName = name.trim();

      // Update in auth.users user_metadata
      const { error: metaError } = await (serviceClient.auth.admin as any).updateUserById(authUser.id, {
        user_metadata: {
          ...authUser.user_metadata,
          full_name: trimmedName,
        },
      });

      if (metaError) {
        console.error("Auth metadata update error:", metaError);
      }

      // Update in public.admin_users if the record exists
      const { error: dbError } = await (serviceClient.from("admin_users") as any)
        .update({
          name: trimmedName,
          last_active_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (dbError) {
        console.warn("Notice: admin_users update skipped or non-existent:", dbError.message);
      }

      return NextResponse.json({
        success: true,
        message: "Nama lengkap berhasil diperbarui.",
        name: trimmedName,
      });
    }

    // ACTION 2: UPDATE PASSWORD
    if (action === "update_password") {
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return NextResponse.json({ error: "Kata sandi baru minimal 6 karakter." }, { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "Konfirmasi kata sandi tidak cocok." }, { status: 400 });
      }

      // Update user password via admin API
      const { error: passError } = await (serviceClient.auth.admin as any).updateUserById(authUser.id, {
        password: newPassword,
      });

      if (passError) {
        console.error("Password update error:", passError);
        return NextResponse.json({ error: "Gagal memperbarui kata sandi: " + passError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Kata sandi Anda berhasil diperbarui.",
      });
    }

    return NextResponse.json({ error: "Aksi tidak valid." }, { status: 400 });
  } catch (err: any) {
    console.error("User profile API error:", err);
    return NextResponse.json({ error: err.message || "Terjadi kesalahan internal server." }, { status: 500 });
  }
}
