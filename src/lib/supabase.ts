// src/lib/supabase.ts

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types"; // Assuming this will be generated later

/**
 * Singleton for the Supabase browser client (for use in client components for mutations)
 * @returns SupabaseClient
 */
export function getSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      storageKey: "baznas-bvd",
    },
  });

  return client as SupabaseClient<Database>;
}




