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
  // Check if the user is authenticated at all (Guard 1 - Part 1)
  const user = await getRbacUser(); // Call without cookies

  // If no user object is found (unauthenticated), redirect to login page.
  if (!user) {
    redirect("/login");
  }

  // The guardAdminPage is usually called in the specific page.tsx for permission check.
  // Here, we just ensure the user is logged in and pass the initial user data to the client.

  return (
    <AdminProvider initialUser={user}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProvider>
  );
}
