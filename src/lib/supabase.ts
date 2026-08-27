// src/lib/supabase.ts

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { Database } from "../types/database.types"; // Assuming this will be generated later
import { cookies } from "next/headers";

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

/**
 * Creates a Supabase client instance for use in Server Components/Server Actions.
 * Handles session cookies automatically by accessing `cookies()` dynamically.
 * @returns SupabaseClient
 */
export function createServerSupabase() {
  // We import cookies dynamically to avoid "next/headers" evaluation in non-server contexts
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `set` method is not supported in Server Components. We rely on the proxy for session refresh.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", options);
          } catch (error) {
            // Ignored
          }
        },
      },
      // Using Anon Key here; for Admin API routes, use createServiceRoleClient
    }
  );
}

/**
 * Creates a Supabase client for Server Component/Server Actions using the Service Role Key.
 * Bypasses RLS and should only be used in secure server environments.
 * @returns SupabaseClient (Service Role)
 */
export function createServiceRoleClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
        }
    });
}
