// src/components/auth/LoginFormClient.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock, Mail, LogIn, AlertTriangle, Chrome } from "lucide-react";
import { Button } from "../ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/Input"; // Placeholder for Input component

export default function LoginFormClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();
  const router = useRouter();

  const checkUserRoleAndRedirect = async (userEmail?: string | null) => {
    if (!userEmail) {
      router.push("/akun");
      return;
    }
    try {
      const { data: rbacData } = await supabase.rpc("get_rbac_user", {
        user_email: userEmail,
      } as any);
      const role = rbacData && (rbacData as any[])[0]?.role;
      if (role) {
        router.push("/admin");
      } else {
        router.push("/akun");
      }
    } catch {
      router.push("/akun");
    }
  };

  // Listen for auth change and redirect
  useEffect(() => {
    // Initial check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        checkUserRoleAndRedirect(session.user.email);
      }
    });

    // Listener for sign in events from OAuth popup
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        checkUserRoleAndRedirect(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await supabase.auth.getSession();
      await new Promise((resolve) => setTimeout(resolve, 300));
      await checkUserRoleAndRedirect(data.user?.email || email);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    // Initiates the OAuth flow with explicit redirect to our callback endpoint
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/api/auth/callback",
      },
    });

    if (error) {
      setError(error.message);
    }
    // Note: No need to set loading to false here, as the page will redirect
  };

  return (
    <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-[#08240e] rounded-3xl shadow-xl border border-surface-variant/40 dark:border-[#0f4018] font-jakarta">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Image 
            src="/images/logo-header.png" 
            alt="BAZNAS Kabupaten Boven Digoel" 
            width={160}
            height={64}
            priority
            className="h-16 w-auto object-contain rounded-md"
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-primary dark:text-white">
            Masuk ke Akun
          </h1>
          <p className="text-xs text-[#5B6470] dark:text-zinc-400 mt-1">
            Portal Layanan Pengguna & Administrator BAZNAS Kabupaten Boven Digoel
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-60" />
            <Input
              id="email"
              type="email"
              placeholder="admin@baznasbvd.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-60" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full space-x-2 bg-[#075C3B] hover:bg-[#004229] dark:bg-[#8cd6ac] dark:text-[#002112] text-white py-3 font-bold text-sm rounded-xl mt-2" 
          disabled={loading}
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? "Memproses..." : "Masuk dengan Email"}</span>
        </Button>
      </form>

      <div className="flex items-center space-x-3 my-4">
        <hr className="flex-grow border-t border-surface-variant/50 dark:border-zinc-800" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6470] dark:text-zinc-500">ATAU</span>
        <hr className="flex-grow border-t border-surface-variant/50 dark:border-zinc-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-[#1F2937] dark:text-white border border-surface-variant/60 dark:border-zinc-700 py-3 px-4 font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Login Pakai Google</span>
      </button>

      <div className="pt-4 border-t border-surface-variant/40 dark:border-zinc-800 text-center">
        <Link 
          href="/" 
          className="text-xs text-[#5B6470] dark:text-zinc-400 hover:text-[#004229] dark:hover:text-[#8cd6ac] font-semibold transition-colors inline-flex items-center gap-1"
        >
          <span>← Kembali ke Halaman Utama</span>
        </Link>
      </div>
    </div>
  );
}
