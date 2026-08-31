// src/app/login/page.tsx

import { redirect } from "next/navigation";
import LoginFormClient from "@/components/auth/LoginFormClient";
import { createServerSupabase } from "@/lib/server-supabase";
import RedirectClient from "@/components/RedirectClient";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createServerSupabase();

  // Check if the user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If logged in, use client component to force a clean, client-side navigation
    return <RedirectClient />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fbf9f4] dark:bg-[#051808] p-4">
      <LoginFormClient />
    </div>
  );
}
