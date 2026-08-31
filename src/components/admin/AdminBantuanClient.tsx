// src/components/admin/AdminBantuanClient.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Inbox, 
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const AdminBantuanModal = dynamic(() => import("./AdminBantuanModal"), { ssr: false });

interface MustahikApplication {
  id: string;
  name: string;
  nik: string;
  district: string;
  phone: string;
  category: string;
  notes: string;
  status: string;
  created_at: string;
}

interface AdminBantuanClientProps {
  initialApplications: MustahikApplication[];
  user: RBACUser;
}

const CATEGORIES_MAP: Record<string, string> = {
  kesehatan: "Boven Digoel Sehat (Kesehatan)",
  pendidikan: "Boven Digoel Cerdas (Pendidikan)",
  ekonomi: "Boven Digoel Mandiri (Ekonomi)",
  sosial: "Boven Digoel Peduli (Sosial)",
  keagamaan: "Boven Digoel Taqwa (Keagamaan)"
};

export default function AdminBantuanClient({
  initialApplications,
  user,
}: AdminBantuanClientProps) {
  const router = useRouter();
  const { can } = useAdmin();
  const [applications, setApplications] = useState<MustahikApplication[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Synchronize local state whenever server props update (e.g. after router.refresh())
  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);
  
  // Modal State
  const [selectedApp, setSelectedApp] = useState<MustahikApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status Alerts
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canUpdate = can("contact_messages", "update");
  const canDelete = can("contact_messages", "delete");

  // Filter Logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.nik.includes(search) ||
      app.district.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search);
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle status update fetch
  const handleStatusChange = async (id: string, newStatus: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/mustahik/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbaharui status.");
      }

      setSuccess("Status permohonan berhasil diperbaharui.");
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    }
  };

  // Handle delete fetch
  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/mustahik/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus permohonan.");
      }

      setSuccess("Permohonan berhasil dihapus.");
      setApplications(prev => prev.filter(app => app.id !== id));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30">Baru</span>;
      case "verified":
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">Terverifikasi</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/30">Ditolak</span>;
      case "done":
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">Selesai</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded dark:bg-slate-800/40 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{status}</span>;
    }
  };

  const openDetails = (app: MustahikApplication) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white tracking-tight">
            Permohonan Bantuan Mustahik
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Total {applications.length} pengajuan santunan sosial, beasiswa, dan modal usaha dhuafa.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-xs font-semibold">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-surface-variant/40 dark:border-surface-variant/80 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input 
            placeholder="Cari berdasarkan nama, NIK, distrik, telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant text-on-surface px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#075C3B]"
            >
              <option value="all">Semua Status</option>
              <option value="new">Baru (Belum Verifikasi)</option>
              <option value="verified">Terverifikasi</option>
              <option value="done">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant text-on-surface px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#075C3B]"
          >
            <option value="all">Semua Kategori Program</option>
            {Object.entries(CATEGORIES_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-surface rounded-2xl border border-slate-200/90 dark:border-[#0f4018] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse font-jakarta">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-[#0c3514] border-b-2 border-slate-200 dark:border-[#0f4018]">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">Mustahik</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">NIK / HP</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">Domisili</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">Program Bantuan</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300">Tanggal Masuk</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#0f4018]">
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-slate-200 dark:border-[#0f4018] hover:bg-slate-50/80 dark:hover:bg-[#0c3514]/60 transition-colors">
                  <td className="p-4 font-semibold text-on-surface">{app.name}</td>
                  <td className="p-4 space-y-0.5">
                    <p className="text-xs font-semibold text-on-surface-variant tracking-wider">{app.nik}</p>
                    <p className="text-xs text-on-surface-variant opacity-80">{app.phone}</p>
                  </td>
                  <td className="p-4 text-on-surface-variant">{app.district}</td>
                  <td className="p-4 text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac]">
                    {CATEGORIES_MAP[app.category] || app.category}
                  </td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4 text-xs text-on-surface-variant">
                    {new Date(app.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        onClick={() => openDetails(app)} 
                        size="icon" 
                        variant="ghost"
                        className="text-[#075C3B] hover:bg-[#075C3B]/10 p-1.5"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-on-surface-variant space-y-4">
                    <Inbox className="w-12 h-12 text-on-surface-variant mx-auto opacity-60" />
                    <p className="text-sm font-semibold">Tidak Ada Permohonan Bantuan</p>
                    <p className="text-xs opacity-75 max-w-sm mx-auto">
                      Belum ada data pengajuan bantuan sosial atau mustahik terdaftar yang cocok dengan filter aktif.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AdminBantuanModal 
        application={selectedApp}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApp(null);
        }}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}