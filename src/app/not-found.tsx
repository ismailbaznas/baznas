// src/app/not-found.tsx
import Link from "next/link";
import { ArrowLeft, Home, Compass, Newspaper, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan (404)",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center bg-background px-4 py-16 font-jakarta">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="text-[#075C3B] dark:text-[#8cd6ac] font-bold text-sm uppercase tracking-widest bg-[#075C3B]/10 px-4 py-1.5 rounded-full inline-block">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-primary dark:text-white">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-[#5B6470] dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            Mohon maaf, halaman yang Anda tuju tidak dapat ditemukan atau mungkin telah dipindahkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
          <Link
            href="/"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#075C3B]/10 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary dark:text-white group-hover:text-[#075C3B] transition-colors">
                Beranda Utama
              </div>
              <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                Kembali ke halaman utama
              </div>
            </div>
          </Link>

          <Link
            href="/program"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#075C3B]/10 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary dark:text-white group-hover:text-[#075C3B] transition-colors">
                Program ZIS
              </div>
              <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                Lihat 5 pilar program
              </div>
            </div>
          </Link>

          <Link
            href="/kabar"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#075C3B]/10 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac] shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary dark:text-white group-hover:text-[#075C3B] transition-colors">
                Kabar & Berita
              </div>
              <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                Informasi & aktivitas terkini
              </div>
            </div>
          </Link>

          <Link
            href="/layanan"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#075C3B]/10 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary dark:text-white group-hover:text-[#075C3B] transition-colors">
                Layanan Zakat
              </div>
              <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                Kalkulator & permohonan
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#075C3B] hover:bg-[#004229] text-white px-6 py-3 rounded-lg text-sm font-semibold shadow transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
