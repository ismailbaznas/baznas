// src/lib/rbac/constants.ts

import { Module, Permission, PermissionId, Role } from "@/types/rbac";

// --- MODULE DEFINITIONS (BAZNAS Boven Digoel Scope) ---

// Permissions needed for each module (CRUD pattern)
const CRUD_PERMISSIONS = ["create", "read", "update", "delete"] as const;

export const BAZNAS_MODULES = {
  // Public Content Management
  berita: {
    name: "Berita & Artikel",
    permissions: CRUD_PERMISSIONS,
  },
  program: {
    name: "Program",
    permissions: CRUD_PERMISSIONS,
  },
  dokumentasi: {
    name: "Transparansi & Dokumen",
    permissions: CRUD_PERMISSIONS,
  },
  agenda: {
    name: "Agenda",
    permissions: CRUD_PERMISSIONS,
  },
  team_members: {
    name: "Pimpinan/Struktur",
    permissions: CRUD_PERMISSIONS,
  },
  contact_messages: {
    name: "Pesan Masuk (Kontak/Pengaduan)",
    permissions: ["read", "update", "delete"] as const, // Cannot 'create' via admin
  },

  // System/Settings
  settings: {
    name: "Pengaturan Situs",
    permissions: ["read", "update"] as const,
  },

  // User Management (Admin only)
  user: {
    name: "Manajemen Pengguna",
    permissions: ["manage"] as const, // 'manage' = CRUD users, roles, and permissions
  },
  role: {
    name: "Manajemen Role",
    permissions: ["manage"] as const,
  },
  permission: {
    name: "Katalog Permission",
    permissions: ["manage"] as const,
  },
} as const satisfies Record<string, Module>;

// --- PERMISSION AND ROLE SEEDING ---

export const ALL_PERMISSIONS: Permission[] = Object.entries(BAZNAS_MODULES).flatMap(
  ([moduleKey, module]) =>
    module.permissions.map((action) => ({
      id: `${moduleKey}.${action}` as PermissionId,
      module: moduleKey,
      action: action,
      name: `${module.name}: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    }))
);

export const SUPERADMIN_PERMISSIONS = ALL_PERMISSIONS.map(p => p.id);
export const ALL_PERMISSION_IDS = SUPERADMIN_PERMISSIONS; // Alias for clarity
export const READ_ONLY_PERMISSIONS = ALL_PERMISSIONS.filter(p => p.action === "read").map(p => p.id);

export const SEED_ROLES: Role[] = [
  {
    id: "superadmin",
    name: "Super Admin",
    description: "Akses penuh ke semua modul, termasuk manajemen pengguna dan peran. Bypass RLS.",
    permission_ids: SUPERADMIN_PERMISSIONS,
    is_system: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Akses read-only ke semua modul konten.",
    permission_ids: READ_ONLY_PERMISSIONS,
    is_system: true,
  },
  {
    id: "editor",
    name: "Editor Konten",
    description: "Mengelola konten berita dan program.",
    permission_ids: [
      "berita.create",
      "berita.read",
      "berita.update",
      "berita.delete",
      "program.create",
      "program.read",
      "program.update",
      "program.delete",
      "agenda.create",
      "agenda.read",
      "agenda.update",
      "agenda.delete",
    ] as PermissionId[],
    is_system: false,
  },
];
