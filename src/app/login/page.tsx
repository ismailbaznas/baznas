// src/app/login/page.tsx

import { redirect } from "next/navigation";
import LoginFormClient from "@/components/auth/LoginFormClient";
import { getRbacUser } from "@/lib/rbac/server";
import type { Metadata } from "next";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk Akun & Administrator",
  description: "Portal masuk akun pengguna, staf, dan pengurus BAZNAS Kabupaten Boven Digoel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const user = await getRbacUser();

  if (user) {
    if (user.role) {
      redirect("/admin");
    } else {
      redirect("/akun");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#fbf9f4] dark:bg-[#051808] p-4">
      <LoginFormClient />
    </div>
  );
}
