// src/components/rbac/Can.tsx

"use client";

import { useAdmin } from "@/lib/admin-context";
import { PermissionId } from "@/types/rbac";
import { cn } from "@/lib/utils";

/**
 * Conditionally renders children based on whether the user has the required permission(s).
 *
 * @param required The required permission ID (e.g., 'berita.create')
 * @param requiredAny An array of permission IDs; renders if user has at least one of them.
 * @param fallback The content to render if the permission check fails (defaults to null).
 * @param className Optional class names for the wrapper div.
 * @returns ReactNode or null.
 */
export function Can({
  required,
  requiredAny,
  fallback = null,
  className,
  children,
}: {
  required?: PermissionId;
  requiredAny?: PermissionId[];
  fallback?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const { user, can, hasAny } = useAdmin();

  let hasPermission = false;

  if (user.isSuperAdmin) {
    hasPermission = true;
  } else if (required) {
    // Check single required permission
    const [module, action] = required.split(".");
    hasPermission = can(module, action);
  } else if (requiredAny) {
    // Check if user has at least one of the permissions
    hasPermission = hasAny(requiredAny);
  }

  if (hasPermission) {
    return <div className={cn(className)}>{children}</div>;
  }

  return fallback;
}
