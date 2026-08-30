// src/types/rbac.ts

export type PermissionId = string;

export interface Permission {
  id: PermissionId; // e.g., 'berita.read'
  module: string;   // e.g., 'berita'
  action: string;   // e.g., 'read'
  name: string;
}

export interface Module {
  name: string;
  permissions: readonly string[];
}

export interface Role {
  id: string; // e.g., 'superadmin', 'editor'
  name: string;
  description: string;
  permission_ids: PermissionId[];
  is_system: boolean;
}

export interface RBACUser {
  id: string;
  email: string;
  name: string | null;
  role: string | null; // Role ID
  permissions: PermissionId[];
  isSuperAdmin: boolean;
  avatar_url?: string | null;
}
