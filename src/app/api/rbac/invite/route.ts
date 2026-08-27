// src/app/api/rbac/invite/route.ts
// API route to invite a new user via Supabase Auth

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/server";
import { PermissionId } from "@/types/rbac";
import { createServiceRoleClient } from "@/lib/server-supabase";

const REQUIRED_PERMISSION: PermissionId = "user.manage";

export const dynamic = "force-dynamic";

// POST /api/rbac/invite - Invite new user and create admin_users entry
export async function POST(request: Request) {
  // Guard 2: Check write permission
  const authCheck = await requirePermission(REQUIRED_PERMISSION);
  if (authCheck instanceof NextResponse) {
    return authCheck;
  }

  const { email, name, role } = await request.json();
  const supabase = createServiceRoleClient();

  if (!email || !role || !name) {
    return NextResponse.json({ error: "Email, name, and role are required." }, { status: 400 });
  }

  // 1. Invite user via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name },
    redirectTo: `${process.env.NEXT_PUBLIC_ADMIN_URL}/accept-invite`,
  });

  if (authError) {
    console.error("Supabase Auth Error:", authError);
    return NextResponse.json({ error: "Failed to invite user: " + authError.message }, { status: 500 });
  }
  
  // 2. Create entry in admin_users table (Bypass RLS using service role client)
  const { error: dbError } = await (supabase.from("admin_users") as any).insert({
      id: authData.user.id,
      email: authData.user.email,
      name: name,
      role: role,
  });

  if (dbError) {
    // If DB insert fails, the Auth user is created but not linked.
    console.error("DB Insert Error (user still invited):", dbError);
    // Note: In a production app, we would attempt to delete the auth user here.
    return NextResponse.json({ error: "User invited, but failed to link role: " + dbError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User invited and role linked successfully" });
}
