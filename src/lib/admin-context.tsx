"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { PermissionId, RBACUser } from "@/types/rbac";
import { checkPermission, hasAnyPermission } from "./rbac/check-permission";

/**
 * Empty/Default RBACUser object for unauthenticated state.
 */
const DEFAULT_RBAC_USER: RBACUser = {
  id: "",
  email: "",
  name: null,
  role: null,
  permissions: [],
  isSuperAdmin: false,
};

interface AdminContextType {
  user: RBACUser;
  can: (module: string, action: string) => boolean;
  hasAny: (permissions: PermissionId[]) => boolean;
  setUser: (user: RBACUser) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Provides the current authenticated user object and RBAC helper functions
 * (can(), hasAny()) to all Client Components in the admin section.
 */
export function AdminProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: RBACUser;
}) {
  const [user, setUser] = useState<RBACUser>(initialUser);

  // Memoize the core permission check functions
  const contextValue = useMemo(() => {
    const can = (module: string, action: string) =>
      checkPermission(user, `${module}.${action}` as PermissionId);
    
    const hasAny = (permissions: PermissionId[]) => 
      hasAnyPermission(user, permissions);

    return { user, can, hasAny, setUser };
  }, [user]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

/**
 * Hook to access the current Admin user and RBAC helpers.
 */
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
