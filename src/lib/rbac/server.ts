// src/lib/rbac/server.ts
// Contains server-side functions for authentication and authorization (Guard 1 & 2)

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PermissionId, RBACUser } from "@/types/rbac";
import { createServerSupabase } from "../supabase";
import { Database } from "@/types/database.types"; // Ensure Database type is imported if needed, but not strictly required here
import { SUPERADMIN_PERMISSIONS } from "./constants";

// --- CORE RBAC USER RESOLVER ---

/**
 * Resolves the RBACUser object from the current session using server-side SQL/RPC.
 * Fetches user data, including role and computed permissions.
 * @returns RBACUser object or null if not authenticated/authorized.
 */
export async function getRbacUser(): Promise<RBACUser | null> {
  const supabase = createServerSupabase();

  // Check auth session
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // Call RPC to get RBAC details (role, permissions, etc.)
  const { data: rbacData, error } = await supabase.rpc("get_rbac_user", {
    user_email: authUser.email!,
  } as any);

  if (error || !rbacData) {
    // If RPC fails (e.g., user is authenticated but not in admin_users table), return base user
    console.error("RPC get_rbac_user failed:", error);
    return {
      id: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata.full_name || authUser.email!,
      role: null,
      permissions: [],
      isSuperAdmin: false,
    };
  }

  // Assuming rbacData is the single row returned by the RPC
  const user: any = rbacData;
  const isSuperAdmin = user.role === "superadmin";

  return {
    id: authUser.id,
    email: authUser.email!,
    name: user.name || authUser.user_metadata.full_name || authUser.email!,
    role: user.role,
    permissions: user.permissions || [],
    isSuperAdmin: isSuperAdmin,
  };
}

// --- GUARD 1 (SSR Page Wrapper) ---

/**
 * Ensures the user is authenticated and has the required permission to view an Admin page.
 * Redirects to /login if unauthenticated or /admin (dashboard) if unauthorized.
 * @param requiredPermission The permission ID required (e.g., 'berita.read').
 * @returns The authenticated RBACUser object.
 */
export async function guardAdminPage(
  requiredPermission: PermissionId
): Promise<RBACUser> {
  const user = await getRbacUser();

  if (!user) {
    // Unauthenticated: Redirect to login
    redirect("/login");
  }

  const [module, action] = requiredPermission.split(".") as [string, string];

  // Bypass for superadmin
  if (user.isSuperAdmin) {
    return user;
  }

  // Special case: /admin/profile is accessible to all logged-in admins
  if (module === "profile" && user.role) {
    return user;
  }
  
  // Check required permission
  if (!user.permissions.includes(requiredPermission)) {
    // Unauthorized: Redirect to admin dashboard
    redirect("/admin");
  }

  return user;
}

// --- GUARD 2 (API Route) ---

/**
 * Ensures the user is authenticated and has the required permission for an API action.
 * Returns a NextResponse object with status 401 or 403 on failure.
 * @param requiredPermission The permission ID required (e.g., 'berita.update').
 * @returns The authenticated RBACUser object or null if authorization failed.
 */
export async function requirePermission(
  requiredPermission: PermissionId
): Promise<RBACUser | NextResponse> {
  const user = await getRbacUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Bypass for superadmin
  if (user.isSuperAdmin) {
    return user;
  }

  // Check required permission
  if (!user.permissions.includes(requiredPermission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}

// @ts-ignore
import { NextRequest } from "next/server"; // Import NextRequest for type hint

/**
 * Ensures the user has at least one of the required permissions for an API action.
 * @param requiredPermissions Array of required permission IDs.
 * @returns The authenticated RBACUser object or null if authorization failed.
 */
export async function requireAnyPermission(
  requiredPermissions: PermissionId[]
): Promise<RBACUser | NextResponse> {
  const user = await getRbacUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.isSuperAdmin) {
    return user;
  }

  const hasPermission = requiredPermissions.some((id) =>
    user.permissions.includes(id)
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
