// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();

  // Check if a session exists before logging out
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }
  
  // Respond with a redirect instruction that the client component can follow
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/login",
    },
  });
}
