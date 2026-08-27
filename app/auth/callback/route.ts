// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// This is a Route Handler (Next.js API route)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: (name) => cookieStore.get(name)?.value,
            // set and remove must be handled differently in a Route Handler context
            set: (name, value, options) => {
                // Ensure options are correctly applied
                cookieStore.set(name, value, options);
            },
            remove: (name, options) => {
                // Ensure options are correctly applied
                cookieStore.set(name, '', options);
            },
          },
        }
      );

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful login, redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Handle error or missing code by redirecting to login
  return NextResponse.redirect(new URL('/login', request.url));
}