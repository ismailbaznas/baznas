// src/app/api/mustahik/route.ts

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

// POST /api/mustahik - Submit public mustahik application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nik, district, phone, category, notes } = body;
    
    if (!name || !nik || !district || !phone || !category || !notes) {
      return NextResponse.json({ error: "Semua kolom wajib diisi." }, { status: 400 });
    }

    // Use secure server-side Service Role Client to insert application safely.
    // This allows public insert without exposing keys or compromising security.
    const supabase = createServiceRoleClient();
    
    const { error } = await (supabase.from("mustahik_applications") as any).insert({
      name: String(name),
      nik: String(nik),
      district: String(district),
      phone: String(phone),
      category: String(category),
      notes: String(notes),
      status: "new"
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: "Gagal menyimpan pengajuan: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Pengajuan bantuan Anda berhasil dikirim!" });

  } catch (e: any) {
    console.error("API Error:", e);
    return NextResponse.json({ error: "Permintaan tidak valid: " + e.message }, { status: 400 });
  }
}
