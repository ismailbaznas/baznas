// src/components/AdminLayoutClient.tsx

"use client";

import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";
import { LogOut, Home, Users, Settings, Newspaper, Calendar, FileText, Package, MessageSquare, Key, UserCheck, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ mobileOpen = false, onClose }: AdminSidebarProps) => {
  const { user, can } = useAdmin();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setLoading(true);
    // Call the dedicated API route for server-side sign out
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    // The API route handles the actual redirect to /login
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Navigation items filtered by permission
  const navItems = [
    {
      href: "/admin",
      label: "Dasbor",
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
      label: "Program",
      icon: Package,
      permission: "program.read",
    },
    {
      href: "/admin/agenda",
      label: "Agenda",
      icon: Calendar,
      permission: "agenda.read",
    },
    {
      href: "/admin/transparansi",
      label: "Dokumen Transparansi",
      icon: FileText,
      permission: "dokumentasi.read",
    },
    {
      href: "/admin/pesan",
      label: "Pesan Masuk",
      icon: MessageSquare,
      permission: "contact_messages.read",
    },
    {
      href: "/admin/team",
      label: "Struktur Organisasi",
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
      label: "Manajemen Peran",
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
    <div className="flex flex-col h-full bg-surface-container-lowest p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-space-grotesk font-bold text-primary">
          BAZNAS BVD Admin
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      <nav className="flex-grow space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center space-x-3 p-2.5 rounded-lg text-on-surface hover:bg-primary/5 hover:text-primary transition-all",
              isActive(item.href) && "bg-primary-container text-on-primary-container font-semibold shadow-sm"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-surface-variant">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-on-surface-variant truncate font-medium max-w-[140px]">
              {user.name || user.email}
            </span>
            <ThemeToggle />
        </div>
        <Button variant="outline" className="w-full justify-start space-x-2 border-surface-variant text-status-danger hover:bg-status-danger/10 hover:border-status-danger/30" onClick={handleLogout} disabled={loading}>
          <LogOut className="w-4 h-4" />
          <span>{loading ? "Keluar..." : "Keluar"}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-surface-variant h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
          <aside className="relative w-64 h-full flex flex-col bg-surface-container-lowest border-r border-surface-variant shadow-2xl z-10 animate-in slide-in-from-left duration-250">
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Floating Menu Button on Mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 md:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}
