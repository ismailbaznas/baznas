// src/components/AdminLayoutClient.tsx

"use client";

import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  Home, 
  Users, 
  Settings, 
  Newspaper, 
  Calendar, 
  FileText, 
  Package, 
  MessageSquare, 
  Key, 
  UserCheck, 
  Menu, 
  X, 
  ClipboardCheck,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dasbor Admin",
  "/admin/berita": "Kelola Berita & Artikel",
  "/admin/program": "Kelola Program",
  "/admin/agenda": "Kelola Agenda Kegiatan",
  "/admin/transparansi": "Transparansi & Laporan ZIS",
  "/admin/pesan": "Pesan Masuk & Konsultasi",
  "/admin/bantuan": "Permohonan Bantuan Mustahik",
  "/admin/team": "Struktur Kepengurusan & Pimpinan",
  "/admin/users": "Manajemen Pengguna",
  "/admin/roles": "Manajemen Peran & Hak Akses",
  "/admin/settings": "Pengaturan Situs",
  "/admin/profile": "Pengaturan Profil",
};

const AdminSidebar = ({ mobileOpen = false, onClose }: AdminSidebarProps) => {
  const { user, can } = useAdmin();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Navigation items filtered by RBAC permissions
  const navItems = [
    {
      href: "/admin",
      label: "Dasbor Utama",
      icon: Home,
      permission: null,
    },
    {
      href: "/admin/berita",
      label: "Berita & Artikel",
      icon: Newspaper,
      permission: "berita.read",
    },
    {
      href: "/admin/program",
      label: "Program Penyaluran",
      icon: Package,
      permission: "program.read",
    },
    {
      href: "/admin/bantuan",
      label: "Permohonan Bantuan",
      icon: ClipboardCheck,
      permission: "contact_messages.read",
    },
    {
      href: "/admin/transparansi",
      label: "Transparansi & Laporan",
      icon: FileText,
      permission: "dokumentasi.read",
    },
    {
      href: "/admin/pesan",
      label: "Pesan & Pengaduan",
      icon: MessageSquare,
      permission: "contact_messages.read",
    },
    {
      href: "/admin/agenda",
      label: "Agenda Kegiatan",
      icon: Calendar,
      permission: "agenda.read",
    },
    {
      href: "/admin/team",
      label: "Pimpinan & Tim",
      icon: UserCheck,
      permission: "team_members.read",
    },
    {
      href: "/admin/users",
      label: "Manajemen Pengguna",
      icon: Users,
      permission: "user.manage",
    },
    {
      href: "/admin/roles",
      label: "Hak Akses & Peran",
      icon: Key,
      permission: "role.manage",
    },
    {
      href: "/admin/settings",
      label: "Pengaturan Situs",
      icon: Settings,
      permission: "settings.read",
    },
  ].filter(item => !item.permission || can(item.permission.split('.')[0], item.permission.split('.')[1]));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#004229] dark:bg-[#041d0a] text-white p-5 select-none font-jakarta">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
            <Image 
              src="/images/logo-baznas.png" 
              alt="Logo BAZNAS Kabupaten Boven Digoel" 
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-playfair text-xl font-bold tracking-tight text-white block leading-none">
              BAZNAS
            </span>
            <span className="text-[11px] text-[#ffe088] font-semibold tracking-wider uppercase block mt-1">
              Boven Digoel
            </span>
          </div>
        </Link>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                active
                  ? "bg-white/15 text-white font-bold border-l-4 border-[#D4AF37] shadow-sm translate-x-0.5"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 shrink-0 transition-transform duration-200",
                active ? "text-[#ffe088]" : "text-white/60 group-hover:text-white group-hover:scale-110"
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Panel */}
      <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
        <Link 
          href="/admin/profile" 
          onClick={onClose}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-3 group"
          title="Buka Pengaturan Profil Saya"
        >
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#ffe088] font-bold text-xs shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name || user.email || "Foto Profil"}
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
                unoptimized
              />
            ) : (
              (user.name || user.email || "A").charAt(0).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#ffe088] transition-colors">
              {user.name || user.email}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#ffe088] font-medium mt-0.5 capitalize">
              <ShieldCheck className="w-3 h-3 text-[#ffe088]" />
              {user.role || "Admin"}
            </span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/30 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loading ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-72 h-screen sticky top-0 shrink-0 z-40 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Modal Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onClose} 
          />
          <aside className="relative w-72 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const currentTitle = PAGE_TITLES[pathname] || "Admin Dashboard";

  return (
    <div className="flex min-h-screen bg-[#fbf9f4] dark:bg-[#051808] font-jakarta antialiased selection:bg-[#075C3B] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopAppBar Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#08240e]/90 backdrop-blur border-b border-surface-variant/40 dark:border-[#0f3d17] px-4 sm:px-8 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-primary dark:text-white truncate">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Link to Public Website */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary dark:hover:text-white px-3 py-1.5 rounded-lg border border-surface-variant/50 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              title="Buka Website Publik di Tab Baru"
            >
              <span>Lihat Situs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Dark/Light Mode Toggle */}
            <ThemeToggle />

            {/* User Pill */}
            <Link 
              href="/admin/profile"
              className="flex items-center gap-2 pl-2 border-l border-surface-variant/40 dark:border-zinc-800 hover:opacity-85 transition-opacity group"
              title="Buka Pengaturan Profil Saya"
            >
              <div className="w-8 h-8 rounded-full bg-[#075C3B]/10 dark:bg-emerald-500/20 text-primary dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-jakarta group-hover:scale-105 transition-transform border border-[#075C3B]/20 overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || user.email || "Foto Profil"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full"
                    unoptimized
                  />
                ) : (
                  (user.name || user.email || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-on-surface leading-none truncate max-w-[120px] group-hover:text-primary dark:group-hover:text-white transition-colors">
                  {user.name || user.email}
                </p>
                <span className="text-[10px] text-on-surface-variant font-medium capitalize">
                  {user.role || "Admin"}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 bg-[#fbf9f4] dark:bg-[#051808] text-on-surface">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
