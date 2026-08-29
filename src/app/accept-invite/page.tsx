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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbf9f4] dark:bg-[#121212] p-4 font-jakarta">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-[#181818] rounded-3xl shadow-xl border border-surface-variant/40 dark:border-zinc-800 text-center">
        <h1 className="text-2xl md:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
          Penerimaan Undangan
        </h1>
        {error ? (
          <div className="flex flex-col items-center text-red-600 dark:text-red-400 space-y-2 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30">
            <AlertTriangle className="w-8 h-8" />
            <p className="text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-on-surface space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#075C3B] dark:text-[#8cd6ac]" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
