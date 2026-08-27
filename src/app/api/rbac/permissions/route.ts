// src/app/api/rbac/permissions/route.ts
// API route to get the list of all available permissions (required by AdminRolesModal)

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/server";
import { Permission, PermissionId, Role, RBACUser } from "@/types/rbac";
import { ALL_PERMISSIONS } from "@/lib/rbac/constants";

// Required permission: permission.manage (Superadmin only feature)
const REQUIRED_PERMISSION: PermissionId = "permission.manage";

export const dynamic = "force-dynamic";

// GET /api/rbac/permissions
export async function GET(request: Request) {
  // Check permission (Guard 2: API Route)
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  // Return the static list of all defined permissions
  // In a complex app, this might fetch from a DB table, but here it's static constants.
  return NextResponse.json(ALL_PERMISSIONS);
}
