// src/app/admin/layout.tsx

import AdminLayoutClient from "@/components/AdminLayoutClient";
import { AdminProvider } from "@/lib/admin-context";
import { getRbacUser } from "@/lib/rbac/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Panel Admin — BAZNAS Kabupaten Boven Digoel",
    template: "%s — Admin BAZNAS BVD",
  },
  description: "Panel manajemen konten dan administrasi BAZNAS Kabupaten Boven Digoel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the user is authenticated (Guard 1 - Part 1)
  const user = await getRbacUser();

  // If no user object is found (unauthenticated), redirect to login page.
  if (!user) {
    redirect("/login");
  }

  // SECURITY GUARD: If user has no assigned staff/admin role (guest/tamu), redirect to user dashboard
  if (!user.role) {
    redirect("/akun");
  }

  return (
    <AdminProvider initialUser={user}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProvider>
  );
}
