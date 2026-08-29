// src/app/api/mustahik/[id]/route.ts

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/server-supabase";
import { PermissionId } from "@/types/rbac";
import { requirePermission } from "@/lib/rbac/server";

const REQUIRED_UPDATE_PERMISSION: PermissionId = "contact_messages.update";
const REQUIRED_DELETE_PERMISSION: PermissionId = "contact_messages.delete";

export const dynamic = "force-dynamic";

// PUT /api/mustahik/[id] - Update mustahik application status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authCheck = await requirePermission(REQUIRED_UPDATE_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  try {
    const body = await request.json();
    const status = body?.status;
    if (!status) {
      return NextResponse.json({ error: "Status wajib diisi." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { error } = await (supabase.from("mustahik_applications") as any)
      .update({ status: String(status), updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: "Gagal memperbaharui status: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Status permohonan berhasil diperbaharui!" });

  } catch (e: any) {
    console.error("API Error:", e);
    return NextResponse.json({ error: "Permintaan tidak valid: " + e.message }, { status: 400 });
  }
}

// DELETE /api/mustahik/[id] - Delete mustahik application
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Fallback to update permission if delete isn't explicitly configured, but standard RBAC has contact_messages.delete
  const authCheck = await requirePermission(REQUIRED_DELETE_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await (supabase.from("mustahik_applications") as any)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      return NextResponse.json({ error: "Gagal menghapus permohonan: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Permohonan berhasil dihapus!" });

  } catch (e: any) {
    console.error("API Error:", e);
    return NextResponse.json({ error: "Permintaan tidak valid: " + e.message }, { status: 400 });
  }
}
