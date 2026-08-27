import { createServerClient } from "@supabase/ssr";

// Utility function to create a Supabase client that can read the user's cookie session
// Use this for secure, authenticated data fetching in Server Components
export function getSupabaseServerClient(cookieStore: any) {
  // Create a server-side client that can read cookies for the user session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Can only set cookies in a Server Action or Route Handler
          }
        },
        remove: (name: string, options: any) => {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Can only set cookies in a Server Action or Route Handler
          }
        },
      },
    }
  );
}