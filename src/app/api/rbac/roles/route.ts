// src/app/api/rbac/roles/route.ts
// API route for CRUD operations on Roles

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/server";
import { PermissionId, Role } from "@/types/rbac";
import { createServiceRoleClient } from "@/lib/server-supabase";

const REQUIRED_PERMISSION: PermissionId = "role.manage";

export const dynamic = "force-dynamic";

// GET /api/rbac/roles - Fetch all roles
export async function GET(request: Request) {
  // Guard 2: Check read permission (role.manage is used for all role operations)
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const supabase = createServiceRoleClient(); // Use service role to bypass RLS on system tables

  const { data: roles, error } = await supabase.from("roles").select("*").order("is_system", {ascending: false}).order("name", {ascending: true});

  if (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }

  return NextResponse.json(roles);
}

// POST /api/rbac/roles - Create new role
export async function POST(request: Request) {
  // Guard 2: Check write permission
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const newRole: Role = await request.json();
  const supabase = createServiceRoleClient();

  // Validate: ensure ID is provided and is not empty
  if (!newRole.id) {
    return NextResponse.json({ error: "Role ID is required." }, { status: 400 });
  }

  const { error } = await (supabase.from("roles") as any).insert(newRole);

  if (error) {
    console.error("Error creating role:", error);
    return NextResponse.json({ error: "Failed to create role: " + error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Role created successfully" });
}

// PUT /api/rbac/roles - Update existing role
export async function PUT(request: Request) {
  // Guard 2: Check write permission
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const updatedRole: Partial<Role> = await request.json();
  const supabase = createServiceRoleClient();

  // Validate: ensure ID is provided
  if (!updatedRole.id) {
    return NextResponse.json({ error: "Role ID is required for update." }, { status: 400 });
  }

  const { error } = await (supabase.from("roles") as any).update(updatedRole).eq("id", updatedRole.id);

  if (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role: " + error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Role updated successfully" });
}

// DELETE /api/rbac/roles - Delete role
export async function DELETE(request: Request) {
  // Guard 2: Check delete permission
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const { id } = await request.json();
  const supabase = createServiceRoleClient();

  // Validate: ensure ID is provided
  if (!id) {
    return NextResponse.json({ error: "Role ID is required for deletion." }, { status: 400 });
  }
  
  // Prevent deleting system roles (superadmin, admin)
  const { data: roleData, error: fetchError } = await supabase.from("roles").select("is_system").eq("id", id).single();
  if (fetchError || (roleData as { is_system: boolean })?.is_system) {
    return NextResponse.json({ error: "Cannot delete system roles." }, { status: 403 });
  }

  const { error } = await supabase.from("roles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json({ error: "Failed to delete role: " + error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Role deleted successfully" });
}
