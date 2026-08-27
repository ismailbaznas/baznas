// src/lib/supabase.ts

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/database.types";

let supabaseBrowser: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Singleton for the Supabase browser client (for use in client components for mutations)
 * @returns SupabaseClient
 */
export function getSupabaseBrowser() {
  if (supabaseBrowser) {
    return supabaseBrowser;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  supabaseBrowser = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  
  return supabaseBrowser;
}



