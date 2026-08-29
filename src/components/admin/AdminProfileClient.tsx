// src/components/admin/AdminProfileClient.tsx

"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Save, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2 
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AdminProfileClientProps {
  initialEmail: string;
  initialName: string;
  initialRole: string | null;
}

export default function AdminProfileClient({
  initialEmail,
  initialName,
  initialRole,
}: AdminProfileClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Update Name
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameMessage({ type: "error", text: "Nama lengkap tidak boleh kosong." });
      return;
    }

    setSavingName(true);
    setNameMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui nama");
      }

      setNameMessage({ type: "success", text: "Nama lengkap Anda berhasil diperbarui!" });
      router.refresh();
    } catch (err: any) {
      setNameMessage({ type: "error", text: err.message || "Terjadi kesalahan sistem." });
    } finally {
      setSavingName(false);
    }
  };

  // 2. Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (password.length < 6) {
      setPasswordMessage({ type: "error", text: "Kata sandi minimal 6 karakter." });
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    setSavingPassword(true);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setPasswordMessage({ type: "success", text: "Kata sandi akun Anda berhasil diubah!" });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Gagal mengubah kata sandi." });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 font-jakarta">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
          Pengaturan Profil
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Kelola informasi nama akun dan kredensial keamanan Anda di sistem BAZNAS Boven Digoel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 shadow-sm text-center">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-full bg-[#004229]/10 dark:bg-[#8cd6ac]/15 border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#004229] dark:text-[#8cd6ac] text-2xl font-bold font-playfair shadow-md">
              {(name || initialEmail || "A").charAt(0).toUpperCase()}
            </div>

            <h2 className="font-playfair text-xl font-bold text-[#004229] dark:text-white mt-4 truncate">
              {name || "Pengguna BAZNAS"}
            </h2>
            <p className="text-xs text-on-surface-variant truncate mt-0.5">
              {initialEmail}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#a08124] dark:text-[#ffe088] text-xs font-bold capitalize">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{initialRole || "Belum Ada Peran"}</span>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-variant/40 dark:border-zinc-800 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Status Akun</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Metode Login</span>
                <span className="font-semibold text-on-surface">Google / Email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Update Name */}
          <div className="bg-white dark:bg-[#181818] p-6 sm:p-8 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-variant/40 dark:border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-[#075C3B]/10 dark:bg-[#8cd6ac]/15 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white">
                  Perbarui Nama Lengkap
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Nama ini akan ditampilkan pada dasbor dan riwayat aktivitas sistem.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Email Akun
                </label>
                <div className="relative">
                  <Input 
                    type="email" 
                    value={initialEmail} 
                    disabled 
                    className="bg-slate-50 dark:bg-zinc-800/60 text-slate-500 dark:text-zinc-400 cursor-not-allowed pl-9 text-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 italic">
                  Email akun terhubung ke identitas login dan tidak dapat diubah sembarangan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Masukkan nama lengkap Anda" 
                  required
                  className="text-xs sm:text-sm"
                />
              </div>

              {nameMessage && (
                <div className={cn(
                  "p-3.5 rounded-xl text-xs flex items-center gap-2 border",
                  nameMessage.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                )}>
                  {nameMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{nameMessage.text}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={savingName || !name.trim()}
                className="w-full sm:w-auto"
              >
                {savingName ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan Nama
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Card 2: Update Password */}
          <div className="bg-white dark:bg-[#181818] p-6 sm:p-8 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-variant/40 dark:border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white">
                  Ubah Kata Sandi
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Gunakan kata sandi yang kuat dengan kombinasi minimal 6 karakter.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Minimal 6 karakter" 
                    minLength={6}
                    required
                    className="pr-10 text-xs sm:text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Ulangi kata sandi baru" 
                    minLength={6}
                    required
                    className="pr-10 text-xs sm:text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordMessage && (
                <div className={cn(
                  "p-3.5 rounded-xl text-xs flex items-center gap-2 border",
                  passwordMessage.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                )}>
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={savingPassword || !password || !confirmPassword}
                variant="outline"
                className="w-full sm:w-auto hover:bg-[#004229] hover:text-white"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengubah Kata Sandi...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Ubah Kata Sandi
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
