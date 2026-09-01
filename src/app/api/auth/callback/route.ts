// src/app/api/auth/callback/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server-supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (explicitNext) {
        return NextResponse.redirect(`${origin}${explicitNext}`);
      }

      // Intelligently check role: Staff/Admin -> /admin, Guest/Tamu -> /akun
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: rbacData } = await supabase.rpc("get_rbac_user", {
          user_email: user.email,
        } as any);

        const role = rbacData && (rbacData as any[])[0]?.role;
        if (role) {
          return NextResponse.redirect(`${origin}/admin`);
        }
      }

      // Default destination for guests/tamu
      return NextResponse.redirect(`${origin}/akun`);
    }
  }

  // Return the user to login page with an error message
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}