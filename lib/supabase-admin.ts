// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

// Supabase client using the Service Role Key (Admin)
// This client bypasses Row Level Security (RLS) and must ONLY be used on the server, 
// preferably inside Server Actions or Route Handlers.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // We throw an error only if we are about to use the client.
  // This is a minimal check to remind the developer.
  console.warn("Missing Supabase admin environment variables. Data manipulation will fail.");
}

export const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
});
