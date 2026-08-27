// src/components/auth/LoginFormClient.tsx

"use client";

import React, { useState } from "react";
import { Lock, Mail, LogIn, AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/Input"; // Placeholder for Input component

export default function LoginFormClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Successful login, redirect to admin page
      redirect("/admin");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-2xl border border-surface-variant">
      <h1 className="text-3xl font-space-grotesk font-bold text-center text-primary glow-gold">
        BAZNAS BVD Admin
      </h1>
      <p className="text-center text-on-surface-variant">
        Masuk ke Panel Administrasi Konten
      </p>

      {error && (
        <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-body-md">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-body-md font-medium text-on-surface">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
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

        <div>
          <label htmlFor="password" className="text-body-md font-medium text-on-surface">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
          <Link href="/reset-password" className="text-sm text-primary hover:underline mt-1 block text-right">
            Lupa Password?
          </Link>
        </div>

        <Button type="submit" className="w-full space-x-2" disabled={loading}>
          <LogIn className="w-5 h-5" />
          <span>{loading ? "Memproses..." : "Masuk"}</span>
        </Button>
      </form>
    </div>
  );
}
