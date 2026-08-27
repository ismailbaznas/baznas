// src/components/AdminLayoutClient.tsx

"use client";

import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";
import { LogOut, Home, Users, Settings, Newspaper, Calendar, FileText, Package, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const AdminSidebar = () => {
  const { user, can } = useAdmin();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // Call the dedicated API route for server-side sign out
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    // The API route handles the actual redirect to /login
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
      href: "/admin/users",
      label: "Manajemen Pengguna",
      icon: Users,
      permission: "user.manage",
    },
    {
      href: "/admin/settings",
      label: "Pengaturan Situs",
      icon: Settings,
      permission: "settings.read",
    },
  ].filter(item => !item.permission || can(item.permission.split('.')[0], item.permission.split('.')[1]));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-container-lowest border-r border-surface-variant p-4">
      <div className="text-xl font-space-grotesk font-bold text-primary mb-6">
        BAZNAS BVD Admin
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 p-2 rounded-lg text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors",
              // isActive logic would go here
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-surface-variant">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-on-surface-variant truncate">{user.name || user.email}</span>
            <ThemeToggle />
        </div>
        <Button variant="outline" className="w-full justify-start space-x-2" onClick={handleLogout} disabled={loading}>
          <LogOut className="w-4 h-4" />
          <span>{loading ? "Keluar..." : "Keluar"}</span>
        </Button>
      </div>
    </aside>
  );
};


export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
