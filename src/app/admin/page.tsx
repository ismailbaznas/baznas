// src/app/admin/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { Info, Users, Newspaper, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Required for dynamic behavior
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Guard 1: SSR permission check
  // We only check for login here, as the full list of permissions is in the layout.
  // The dashboard itself is generally accessible to anyone who passed the layout check.
  const user = await guardAdminPage("user.read"); 

  return (
    <div className="space-y-8">
      <h1 className="text-headline-lg font-space-grotesk text-primary">
        Dasbor Admin
      </h1>

      <div className="bg-primary/10 border-l-4 border-primary text-primary-dark p-4 rounded-lg flex space-x-3">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p className="text-body-md">
          Selamat datang, {user.name || user.email}. Anda saat ini memegang peran 
          <span className="font-semibold text-primary"> {user.role}</span>.
          <br />
          Ini adalah implementasi BAZNAS Boven Digoel dengan arsitektur Kemenhaj (Next.js 16 + Supabase SSR + RBAC 3-lapis).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Card 1: Content Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-surface-variant">
          <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <span>Konten Publik</span>
          </h2>
          <p className="text-3xl font-bold">0</p>
          <p className="text-on-surface-variant">Berita & Program Terdaftar</p>
          <Button variant="outline-gold" size="sm" className="mt-4">
            Lihat Berita
          </Button>
        </div>

        {/* Placeholder Card 2: User Access */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-surface-variant">
          <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Manajemen Pengguna</span>
          </h2>
          <p className="text-3xl font-bold">1</p>
          <p className="text-on-surface-variant">Admin Aktif</p>
          <Button variant="outline-gold" size="sm" className="mt-4">
            Kelola Pengguna
          </Button>
        </div>

        {/* Placeholder Card 3: New Messages */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-surface-variant">
          <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Pesan Masuk</span>
          </h2>
          <p className="text-3xl font-bold text-status-warning">0</p>
          <p className="text-on-surface-variant">Pesan Baru dari Publik</p>
          <Button variant="outline-gold" size="sm" className="mt-4">
            Lihat Pesan
          </Button>
        </div>
      </div>
    </div>
  );
}
