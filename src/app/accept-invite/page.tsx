// src/app/accept-invite/page.tsx
// This page is the Supabase redirect target for setting a new user's password.

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function AcceptInvitePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Memverifikasi undangan...');
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const processInvitation = async () => {
      // The session info (access_token, refresh_token) is usually present in the URL hash
      // Supabase handles the session creation automatically when redirected here.

      // Check if session is established
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setMessage('Verifikasi berhasil! Mengalihkan ke halaman login...');
        // Wait a moment and redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError('Gagal memproses undangan. Tautan mungkin telah kedaluwarsa atau tidak valid.');
      }
    };

    processInvitation();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-lowest p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-2xl border border-surface-variant text-center">
        <h1 className="text-3xl font-space-grotesk font-bold text-primary">
          Penerimaan Undangan
        </h1>
        {error ? (
          <div className="flex flex-col items-center text-status-danger space-y-2">
            <AlertTriangle className="w-8 h-8" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-on-surface space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
