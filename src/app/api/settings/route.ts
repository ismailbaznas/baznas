// src/app/api/settings/route.ts

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/server-supabase";
import { PermissionId } from "@/types/rbac";
import { requirePermission } from "@/lib/rbac/server";

const REQUIRED_PERMISSION: PermissionId = "settings.update";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
    const authCheck = await requirePermission(REQUIRED_PERMISSION);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        const dataToUpsert = await request.json();
        const supabase = createServiceRoleClient();

        // Perform upsert (update or insert) operation
        const { error } = await (supabase.from("site_settings") as any).upsert(dataToUpsert);

        if (error) {
            console.error("Supabase Upsert Error:", error);
            return NextResponse.json({ error: "Gagal menyimpan pengaturan: " + error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Pengaturan berhasil disimpan." });

    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Permintaan tidak valid: " + e.message }, { status: 400 });
    }
}
