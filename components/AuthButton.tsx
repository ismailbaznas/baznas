// components/AuthButton.tsx
'use client';

import { createClientSupabaseClient } from '@/lib/supabase-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AuthButton() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        router.refresh();
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/');
    setLoading(false);
  };

  if (loading) {
    return <div className="ml-4 px-4 py-2 border rounded-full text-sm text-gray-500 bg-gray-100 animate-pulse">Memuat...</div>;
  }

  if (session) {
    // Logged in: Show Logout Button
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        Logout Admin
      </button>
    );
  } else {
    // Not logged in: Show Login Button
    return (
      <Link
        href="/login"
        className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-baznas-green hover:bg-baznas-green-dark transition-colors"
      >
        Login Admin
      </Link>
    );
  }
}
