// src/app/admin/profile/page.tsx

import { getRbacUser } from "@/lib/rbac/server";
import { redirect } from "next/navigation";
import AdminProfileClient from "@/components/admin/AdminProfileClient";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getRbacUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AdminProfileClient
      initialEmail={user.email}
      initialName={user.name || ""}
      initialRole={user.role}
    />
  );
}
