// src/components/admin/AdminBantuanModal.tsx

"use client";

import React, { useState } from "react";
import { X, Check, XCircle, Trash2, Calendar, Phone, MapPin, User, FileText, Bookmark } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

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

interface AdminBantuanModalProps {
  application: MustahikApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canUpdate: boolean;
  canDelete: boolean;
}

export default function AdminBantuanModal({
  application,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  canUpdate,
  canDelete,
}: AdminBantuanModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!isOpen || !application) return null;

  const handleUpdateStatus = async (status: string) => {
    setLoading(true);
    await onStatusChange(application.id, status);
    setLoading(false);
    onClose();
  };

  const handleDeleteClick = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setLoading(true);
    await onDelete(application.id);
    setLoading(false);
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">Baru</span>;
      case "verified":
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded">Terverifikasi</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded">Ditolak</span>;
      case "done":
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">Selesai</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded">{status}</span>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "kesehatan": return "Boven Digoel Sehat (Kesehatan)";
      case "pendidikan": return "Boven Digoel Cerdas (Pendidikan)";
      case "ekonomi": return "Boven Digoel Mandiri (Ekonomi)";
      case "sosial": return "Boven Digoel Peduli (Sosial)";
      case "keagamaan": return "Boven Digoel Taqwa (Keagamaan)";
      default: return cat;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-jakarta animate-fade-in">
      <div className="bg-white dark:bg-surface border border-surface-variant/40 dark:border-surface-variant/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-surface-variant/40 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-playfair text-xl font-bold text-primary dark:text-white">
              Detail Permohonan Bantuan
            </h3>
            {getStatusBadge(application.status)}
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:bg-slate-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          
          {/* Identity Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nama Mustahik</p>
                <p className="text-sm font-semibold text-on-surface">{application.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">No. NIK KTP</p>
                <p className="text-sm font-semibold text-on-surface tracking-wider font-mono">{application.nik}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">No. Telepon / HP</p>
                <p className="text-sm font-semibold text-on-surface font-mono">{application.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#075C3B] dark:text-[#8cd6ac] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Domisili / Distrik</p>
                <p className="text-sm font-semibold text-on-surface">{application.district}</p>
              </div>
            </div>
          </div>

          {/* Program & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                Kategori Program
              </p>
              <p className="text-sm font-semibold text-[#075C3B] dark:text-[#8cd6ac]">
                {getCategoryLabel(application.category)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                Tanggal Pengajuan
              </p>
              <p className="text-sm font-medium text-on-surface">
                {new Date(application.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })} WIT
              </p>
            </div>
          </div>

          {/* Notes Block */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Uraian / Alasan Permohonan
            </h4>
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 text-sm text-on-surface whitespace-pre-line leading-relaxed">
              {application.notes}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-surface-variant/40 dark:border-zinc-800 flex flex-wrap gap-3 items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          
          {/* Delete action */}
          <div>
            {canDelete && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteClick}
                disabled={loading}
                className="space-x-1.5 text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteConfirm ? "Yakin Hapus?" : "Hapus"}</span>
              </Button>
            )}
            {deleteConfirm && (
              <Button 
                variant="ghost" 
                onClick={() => setDeleteConfirm(false)}
                disabled={loading}
                className="ml-2 text-xs font-bold font-jakarta text-slate-500 hover:text-slate-700"
              >
                Batal
              </Button>
            )}
          </div>

          {/* Status update actions */}
          <div className="flex gap-2">
            {canUpdate && application.status === "new" && (
              <>
                <Button 
                  onClick={() => handleUpdateStatus("rejected")} 
                  disabled={loading}
                  variant="outline"
                  className="space-x-1 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 text-xs"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak</span>
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus("verified")} 
                  disabled={loading}
                  className="space-x-1 bg-[#D4AF37] hover:bg-[#b0912d] text-white border-[#D4AF37] text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Verifikasi</span>
                </Button>
              </>
            )}

            {canUpdate && application.status === "verified" && (
              <Button 
                onClick={() => handleUpdateStatus("done")} 
                disabled={loading}
                className="space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 text-xs"
              >
                <Check className="w-4 h-4" />
                <span>Tandai Selesai</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="text-xs"
            >
              Tutup
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}