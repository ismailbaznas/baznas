// src/app/api/rbac/users/route.ts
// API route for CRUD operations on Admin Users

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/server";
import { PermissionId } from "@/types/rbac";
import { createServiceRoleClient } from "@/lib/server-supabase";

const REQUIRED_PERMISSION: PermissionId = "user.manage";

export const dynamic = "force-dynamic";

// PUT /api/rbac/users - Update existing user (name/role)
export async function PUT(request: Request) {
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const { id, name, role } = await request.json();
  const supabase = createServiceRoleClient();

  if (!id || !role || !name) {
    return NextResponse.json({ error: "ID, name, and role are required for update." }, { status: 400 });
  }
  
  // Update admin_users table (Bypass RLS using service role client)
  const { error: dbError } = await (supabase.from("admin_users") as any)
    .update({ name, role })
    .eq("id", id);

  if (dbError) {
    console.error("DB Update Error:", dbError);
    return NextResponse.json({ error: "Failed to update user role/name: " + dbError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User updated successfully" });
}

// DELETE /api/rbac/users - Delete user
export async function DELETE(request: Request) {
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const { id } = await request.json();
  const supabase = createServiceRoleClient();

  if (!id) {
    return NextResponse.json({ error: "User ID is required for deletion." }, { status: 400 });
  }

  // 1. Delete user from Supabase Auth (cascades to admin_users table via foreign key)
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (authError) {
    console.error("Auth Delete Error:", authError);
    return NextResponse.json({ error: "Failed to delete user: " + authError.message }, { status: 500 });
  }

  // If Auth delete succeeds, the cascade trigger handles the admin_users entry.

  return NextResponse.json({ message: "User deleted successfully" });
}
