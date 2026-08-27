// src/app/api/auth/callback/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server-supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login page with an error message
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}