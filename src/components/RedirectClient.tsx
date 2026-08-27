// src/components/RedirectClient.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectClient() {
  const router = useRouter();
  useEffect(() => {
    // router.replace is more stable than router.push for breaking redirect loops.
    router.replace('/admin'); 
  }, [router]);

  return <div className="text-on-surface">Mengalihkan ke Admin...</div>;
}
