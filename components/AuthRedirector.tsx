// components/AuthRedirector.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      // Redirect to the correct handler immediately on the client side
      // The code parameter is automatically passed via query string
      router.replace('/auth/callback');
    }
  }, [code, router]);

  // Render nothing, just handle the redirect
  return null;
}