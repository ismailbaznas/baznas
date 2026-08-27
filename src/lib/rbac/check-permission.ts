// src/lib/rbac/check-permission.ts

import { PermissionId, RBACUser } from "@/types/rbac";
import { SUPERADMIN_PERMISSIONS } from "./constants";

/**
 * Checks if a user has a specific permission.
 * Superadmin always bypasses this check.
 * @param user The user object (from context/server)
 * @param permissionId The required permission ID (e.g., 'berita.read')
 * @returns boolean
 */
export function checkPermission(
  user: RBACUser | null | undefined,
  permissionId: PermissionId
): boolean {
  if (!user) {
    return false;
  }

  // Superadmin bypasses all checks
  if (user.isSuperAdmin) {
    return true;
  }

  return user.permissions.includes(permissionId);
}

/**
 * Checks if a user has at least one of the required permissions.
 * @param user The user object
 * @param permissionIds An array of required permission IDs
 * @returns boolean
 */
export function hasAnyPermission(
  user: RBACUser | null | undefined,
  permissionIds: PermissionId[]
): boolean {
  if (!user) {
    return false;
  }

  // Superadmin bypasses all checks
  if (user.isSuperAdmin) {
    return true;
  }

  return permissionIds.some((id) => user.permissions.includes(id));
}

/**
 * Filters a list of permissions based on the user's role.
 * Useful for filtering admin menus/UIs.
 * @param user The user object
 * @param permissionIds An array of permission IDs to filter
 * @returns An array of permissions the user actually has
 */
export function filterOwnedPermissions(
  user: RBACUser | null | undefined,
  permissionIds: PermissionId[]
): PermissionId[] {
  if (!user) {
    return [];
  }

  if (user.isSuperAdmin) {
    return permissionIds;
  }

  return permissionIds.filter((id) => user.permissions.includes(id));
}
