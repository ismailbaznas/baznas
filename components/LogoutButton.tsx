'use client'

import { createClientSupabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // Redirect to the homepage after logout
    router.refresh(); // Refresh to clear the session context
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="ml-auto flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 transition-colors"
    >
      {loading ? 'Keluar...' : 'Logout'}
    </button>
  );
}