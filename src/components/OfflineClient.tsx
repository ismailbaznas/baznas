// src/components/OfflineClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export default function OfflineClient() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[75dvh] flex items-center justify-center bg-background px-4 py-16 font-jakarta">
      <div className="max-w-lg w-full text-center space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-surface-variant/50 dark:border-outline/10 shadow-xl">
        {/* Logo & Offline Icon Badge */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shadow-inner">
            <WifiOff className="w-10 h-10 text-[#075C3B] dark:text-[#8cd6ac]" />
          </div>
          <span className="text-[#075C3B] dark:text-[#8cd6ac] font-bold text-xs uppercase tracking-widest bg-[#075C3B]/10 px-3.5 py-1.5 rounded-full">
            Mode Offline
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white leading-tight">
            Koneksi Internet Terputus
          </h1>
          <p className="text-sm text-[#5B6470] dark:text-zinc-300 leading-relaxed max-w-md mx-auto">
            Halaman ini tidak dapat dimuat karena perangkat Anda sedang tidak terhubung ke jaringan internet. Silakan periksa koneksi Wi-Fi atau data seluler Anda dan coba kembali.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center gap-2 bg-[#075C3B] hover:bg-[#004229] text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-surface-variant/80 dark:border-zinc-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-primary dark:text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Help Info */}
        <div className="pt-4 border-t border-surface-variant/30 dark:border-zinc-800 text-xs text-[#5B6470] dark:text-zinc-400">
          <p>
            Perlu bantuan mendesak? Hubungi kantor BAZNAS Boven Digoel via WhatsApp di{" "}
            <span className="font-semibold text-primary dark:text-[#ffe088]">+62 812 3456 7890</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
