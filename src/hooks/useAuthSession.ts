// src/hooks/useAuthSession.ts

import { getSupabaseBrowser } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  const fetchRole = async (email?: string | null) => {
    if (!email) {
      setRole(null);
      return;
    }
    try {
      const { data } = await supabase.rpc("get_rbac_user", {
        user_email: email,
      } as any);
      const userRole = data && (data as any[])[0]?.role;
      setRole(userRole || null);
    } catch {
      setRole(null);
    }
  };

  useEffect(() => {
    // Initial fetch
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser?.email) {
        fetchRole(currentUser.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u?.email) {
          await fetchRole(u.email);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  return { 
    user, 
    role, 
    isAdmin: Boolean(role), 
    loading, 
    handleLogout, 
    isLoggedIn: !!user 
  };
}
