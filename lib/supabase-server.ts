import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Utility function to create a Supabase client that can read the user's cookie session
// Use this for secure, authenticated data fetching in Server Components
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  // Create a server-side client that can read cookies for the user session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `set` method is only available in a Server Action or Route Handler.
            // For Server Components, we only need `get`.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Same as set
          }
        },
      },
    }
  );
}