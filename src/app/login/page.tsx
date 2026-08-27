// src/app/login/page.tsx

import { redirect } from "next/navigation";
import LoginFormClient from "@/components/auth/LoginFormClient";
import { createServerSupabase } from "@/lib/supabase";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = createServerSupabase();

  // Check if the user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If logged in, redirect to the admin dashboard
    redirect("/admin");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-container-lowest">
      <LoginFormClient />
    </div>
  );
}
