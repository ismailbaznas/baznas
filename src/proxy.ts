// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// List of paths that should be excluded from session refresh
const excludedPaths = [
  // Static assets and Next.js internal paths
  "_next",
  "favicon.ico",
  "manifest.webmanifest",
  "robots.txt",
  // Public API routes that do not need session refresh
  // "api/public/", 
];

export async function proxy(request: NextRequest) {
  // Exclude assets
  if (excludedPaths.some(path => request.nextUrl.pathname.includes(path))) {
    return NextResponse.next();
  }

  try {
    // Create a Supabase client configured to read and write cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Refresh the session and update the cookies
    await supabase.auth.getUser();

  } catch (e) {
    // If the error is a session refresh failure, it will be logged by Supabase client internally.
    // We can ignore the error here.
  }

  // Clone the request headers and set the updated cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Set response headers to update cookies in the browser
  request.cookies.getAll().forEach(cookie => {
    // Only set cookies modified by the Supabase client
    if (cookie.name.startsWith("sb-") || cookie.name.startsWith("auth-")) {
      response.cookies.set(cookie);
    }
  });

  return response;
}

// Rename middleware to config for Next.js 16 Proxy usage
export const config = {
  matcher: [
    // Include all paths except static files and API routes that handle their own auth
    "/((?!_next|favicon.ico|manifest|robots|api|.*\\.).*)",
  ],
};
