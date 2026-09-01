// src/components/user/UserDashboardClient.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  LayoutDashboard, 
  Calculator, 
  HeartHandshake, 
  FileText, 
  PhoneCall,
  UserCheck,
  Save,
  KeyRound,
  Chrome
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";

interface UserDashboardClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string | null;
    avatar_url: string | null;
    provider?: string;
    created_at?: string;
  };
}

export default function UserDashboardClient({ user }: UserDashboardClientProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  // State for Name update
  const [name, setName] = useState(user.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameResult, setNameResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // State for Password update
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isGoogleUser = user.provider === "google" || user.avatar_url?.includes("googleusercontent.com");
  const isStaffOrAdmin = Boolean(user.role);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingName(true);
    setNameResult(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_name",
          name: name.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui nama");

      setNameResult({ type: "success", message: data.message });
      router.refresh();
    } catch (err: any) {
      setNameResult({ type: "error", message: err.message });
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordResult({ type: "error", message: "Kata sandi minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordResult({ type: "error", message: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    setSavingPassword(true);
    setPasswordResult(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_password",
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui kata sandi");

      setPasswordResult({ type: "success", message: data.message });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordResult({ type: "error", message: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const userInitial = (user.name || user.email || "A").charAt(0).toUpperCase();

  return (
    <div className="bg-[#fbf9f4] dark:bg-[#051808] min-h-[100dvh] py-12 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-surface-variant/40 dark:border-zinc-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#004229]/10 dark:bg-emerald-500/20 text-[#004229] dark:text-[#8cd6ac] border-2 border-[#004229]/20 dark:border-[#8cd6ac]/30 flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0 shadow-sm overflow-hidden">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name || "Foto Profil"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-playfair font-bold text-[#1F2937] dark:text-white">
                  {user.name || "Pengguna BAZNAS"}
                </h1>
                {isStaffOrAdmin ? (
                  <Badge variant="default" className="text-[11px] uppercase tracking-wider">
                    Staff / {user.role}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[11px] uppercase tracking-wider">
                    Tamu / Masyarakat Umum
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#5B6470] dark:text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isStaffOrAdmin && (
              <Link
                href="/admin"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#075C3B] hover:bg-[#004229] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Buka Panel Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Informational Banner for Guest Users */}
        {!isStaffOrAdmin && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3.5 text-emerald-900 dark:text-emerald-200">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-bold">Selamat Datang di Portal Akun BAZNAS Kabupaten Boven Digoel</p>
              <p className="text-emerald-800 dark:text-emerald-300/80 leading-relaxed">
                Akun Anda terdaftar sebagai <strong>Masyarakat / Tamu</strong>. Anda dapat mengelola profil pribadi dan mengakses kemudahan seluruh layanan Zakat, Infak, Sedekah, serta permohonan bantuan secara online.
              </p>
            </div>
          </div>
        )}

        {/* Main Grid: Profile Settings & Quick Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Management & Password (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Card 1: Edit Name Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-surface-variant/40 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-surface-variant/30 dark:border-zinc-800 pb-4">
                <User className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac]" />
                <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#1F2937] dark:text-white">
                  Informasi Profil
                </h2>
              </div>

              {nameResult && (
                <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold ${
                  nameResult.type === "success" 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                    : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/40"
                }`}>
                  {nameResult.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span>{nameResult.message}</span>
                </div>
              )}

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="emailDisplay" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Alamat Email (Akun)
                  </label>
                  <Input
                    id="emailDisplay"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-slate-100 dark:bg-zinc-800/60 cursor-not-allowed opacity-75"
                  />
                  <p className="text-[11px] text-[#5B6470] dark:text-zinc-500 mt-1">
                    Alamat email terikat secara permanen dengan akun autentikasi Anda.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingName}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingName ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Card 2: Security & Password */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-surface-variant/40 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-surface-variant/30 dark:border-zinc-800 pb-4">
                <KeyRound className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac]" />
                <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#1F2937] dark:text-white">
                  Keamanan & Kata Sandi
                </h2>
              </div>

              {isGoogleUser ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-surface-variant/40 dark:border-zinc-700 flex items-start gap-3">
                  <Chrome className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1 text-on-surface">
                    <p className="font-bold">Masuk Menggunakan Google OAuth</p>
                    <p className="text-on-surface-variant leading-relaxed">
                      Akun Anda terhubung secara aman dengan akun Google. Pengelolaan kata sandi dan autentikasi multi-faktor ditangani langsung melalui Google Account Anda.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {passwordResult && (
                    <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold ${
                      passwordResult.type === "success" 
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                        : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/40"
                    }`}>
                      {passwordResult.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span>{passwordResult.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider mb-2">
                        Kata Sandi Baru
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#1F2937] dark:text-zinc-300 uppercase tracking-wider mb-2">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Ulangi kata sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="default"
                        disabled={savingPassword}
                        className="w-full sm:w-auto gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{savingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>

          {/* Right Column: Quick Services & Support (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-surface-variant/40 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-playfair text-lg font-bold text-[#1F2937] dark:text-white">
                Layanan Cepat BAZNAS
              </h3>

              <div className="space-y-3">
                <Link
                  href="/layanan#kalkulator"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#075C3B] dark:text-[#8cd6ac] flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors">
                      Kalkulator Zakat Online
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Hitung zakat penghasilan & zakat maal
                    </p>
                  </div>
                </Link>

                <Link
                  href="/layanan#bantuan"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Pengajuan Bantuan Mustahik
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Formulir santunan sosial dhuafa
                    </p>
                  </div>
                </Link>

                <Link
                  href="/transparansi"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Laporan & Transparansi
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Unduh laporan keuangan resmi (PDF)
                    </p>
                  </div>
                </Link>

                <Link
                  href="/kontak"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Kontak & Konsultasi
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Kirim pesan pertanyaan ke tim amil
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Office Contact Info Box */}
            <div className="bg-[#004229] dark:bg-[#08240e] text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-emerald-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-xs uppercase tracking-widest">Layanan Umat</h4>
              </div>
              <p className="text-xs leading-relaxed text-white/80">
                Punya pertanyaan mengenai penyaluran zakat atau status permohonan bantuan Anda? Tim kami siap melayani Anda di kantor sekretariat BAZNAS Boven Digoel, Tanah Merah.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e9c349] text-[#241a00] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <span>Chat WhatsApp Resmi</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
