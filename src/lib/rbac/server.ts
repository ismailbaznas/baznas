// src/lib/rbac/server.ts
// Contains server-side functions for authentication and authorization (Guard 1 & 2)

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PermissionId, RBACUser } from "@/types/rbac";
import { createServerSupabase } from "../server-supabase";
import { Database } from "@/types/database.types"; // Ensure Database type is imported if needed, but not strictly required here
import { SUPERADMIN_PERMISSIONS } from "./constants";

// --- CORE RBAC USER RESOLVER ---

/**
 * Resolves the RBACUser object from the current session using server-side SQL/RPC.
 * Fetches user data, including role and computed permissions.
 * @returns RBACUser object or null if not authenticated/authorized.
 */
export async function getRbacUser(): Promise<RBACUser | null> {
  const supabase = await createServerSupabase();

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

  const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;

  if (error || !rbacData || (rbacData as any[]).length === 0) {
    // If RPC fails (error) or user is not found in admin_users (empty array), return base user
    if (error) console.error("RPC get_rbac_user failed:", error);
    return {
      id: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.full_name || authUser.email!,
      role: null,
      permissions: [],
      isSuperAdmin: false,
      avatar_url: avatarUrl,
    };
  }

  // Get the first user record from the array
  const user: any = rbacData[0];
  const isSuperAdmin = user.role === "superadmin";

  return {
    id: authUser.id,
    email: authUser.email!,
    name: user.name || authUser.user_metadata?.full_name || authUser.email!,
    role: user.role,
    permissions: user.permissions || [],
    isSuperAdmin: isSuperAdmin,
    avatar_url: avatarUrl,
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

  // SECURITY GUARD: Guest / Non-admin users cannot access admin pages
  if (!user.role) {
    redirect("/akun");
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
    redirect("/");
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
