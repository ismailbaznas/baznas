// src/app/api/health/route.ts
// Supabase Keep-Alive Health Endpoint for Vercel Cron Jobs

import { NextResponse } from "next/server";
import { createPublicServerSupabase } from "@/lib/server-supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = createPublicServerSupabase();

    // Perform a lightweight 1-row query to keep Supabase active
    const { data, error } = await (supabase
      .from("site_settings") as any)
      .select("key")
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          message: "Database ping returned error",
          error: error.message,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
        { 
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          }
        }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        message: "Supabase database is active and connected",
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    const duration = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "error",
        message: err?.message || "Internal server error during health ping",
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  }
}
