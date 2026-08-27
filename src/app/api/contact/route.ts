// src/app/api/contact/route.ts

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

// POST /api/contact - Submit public contact message
export async function POST(request: Request) {
  const { name, email, phone, subject, message, type } = await request.json();
  
  if (!name || !subject || !message || !type) {
    return NextResponse.json({ error: "Nama, Subjek, Pesan, dan Jenis pesan wajib diisi." }, { status: 400 });
  }

  // To guarantee public contact message submission succeeds without forcing public users to log in,
  // we use the secure server-side Service Role Client. This bypasses RLS safely on the server side
  // while preventing any public client-side exposure of the service role key.
  const supabase = createServiceRoleClient();
  
  const { error } = await (supabase.from("contact_messages") as any).insert({
    name,
    email,
    phone,
    subject,
    message,
    type,
    status: 'new',
  });

  if (error) {
    console.error("Supabase Insert Error:", error);
    return NextResponse.json({ error: "Gagal mengirim pesan: " + error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Pesan Anda berhasil dikirim!" });
}
