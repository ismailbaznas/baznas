// src/app/admin/page.tsx

import { getRbacUser } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Info, 
  Users, 
  Newspaper, 
  MessageSquare, 
  HeartHandshake, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Layers,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getRbacUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabase();

  // Fetch real-time aggregate counts in parallel
  const [
    { count: newsCount },
    { count: programCount },
    { count: usersCount },
    { count: newMessagesCount },
    { count: newBantuanCount },
    { count: docsCount }
  ] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }),
    supabase.from("admin_users").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("mustahik_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("documents").select("*", { count: "exact", head: true })
  ]);

  const totalContent = (newsCount || 0) + (programCount || 0);

  return (
    <div className="space-y-8 font-jakarta">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
            Dasbor Utama
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Ringkasan data operasional dan konten resmi BAZNAS Kabupaten Boven Digoel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-surface-variant/60 dark:border-zinc-700 bg-white dark:bg-[#181818] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pengaturan Situs</span>
          </Link>
        </div>
      </div>

      {/* Greeting Banner */}
      <div className="bg-[#075C3B]/10 dark:bg-[#075C3B]/20 border-l-4 border-[#075C3B] p-4 rounded-xl flex items-start sm:items-center space-x-3">
        <Info className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-on-surface leading-relaxed">
          Selamat datang kembali, <span className="font-bold text-[#075C3B] dark:text-[#8cd6ac]">{user.name || user.email}</span>. Anda mengelola sistem sebagai peran{" "}
          <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-[#D4AF37]/20 text-[#a08124] dark:text-[#ffe088] border border-[#D4AF37]/30">
            {user.role || "Admin"}
          </span>.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Permohonan Mustahik Baru */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-surface-variant/50 dark:border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">
                Permohonan Baru
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac]">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#004229] dark:text-white font-playfair">
              {newBantuanCount || 0}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Permohonan bantuan masuk</p>
          </div>
          <Link
            href="/admin/bantuan"
            className="mt-5 text-xs font-bold text-[#075C3B] dark:text-[#8cd6ac] hover:underline inline-flex items-center gap-1"
          >
            <span>Kelola Permohonan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Pesan Masuk Baru */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-surface-variant/50 dark:border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">
                Pesan / Pengaduan
              </span>
              <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#1F2937] dark:text-white font-playfair">
              {newMessagesCount || 0}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Pesan publik belum dibaca</p>
          </div>
          <Link
            href="/admin/pesan"
            className="mt-5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Lihat Pesan Masuk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Konten Berita & Program */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-surface-variant/50 dark:border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">
                Konten Publik
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Newspaper className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#1F2937] dark:text-white font-playfair">
              {totalContent}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {newsCount || 0} Berita · {programCount || 0} Program
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href="/admin/berita"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Berita</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/admin/program"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Program</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Dokumen & Transparansi */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-surface-variant/50 dark:border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">
                Dokumen Publik
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#1F2937] dark:text-white font-playfair">
              {docsCount || 0}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Laporan ZIS terpublikasi</p>
          </div>
          <Link
            href="/admin/transparansi"
            className="mt-5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Kelola Transparansi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-variant/50 dark:border-outline/10 p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <span>Akses Cepat Pengelolaan</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/berita"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <Newspaper className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Berita</span>
          </Link>
          <Link
            href="/admin/program"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <Layers className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Program</span>
          </Link>
          <Link
            href="/admin/bantuan"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <HeartHandshake className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Permohonan</span>
          </Link>
          <Link
            href="/admin/transparansi"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <FileText className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Transparansi</span>
          </Link>
          <Link
            href="/admin/team"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <Users className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Pimpinan</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-[#075C3B]/5 dark:hover:bg-[#8cd6ac]/10 rounded-xl border border-surface-variant/40 dark:border-outline/10 text-center transition-all group"
          >
            <Settings className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-on-surface block">Pengaturan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
