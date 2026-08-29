// src/components/admin/AdminPesanModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type MessageItem = Database["public"]["Tables"]["contact_messages"]["Row"];

interface AdminPesanModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  messageId: string | null;
}

const MESSAGE_STATUSES = [
    { value: "new", label: "Baru" },
    { value: "in_progress", label: "Diproses" },
    { value: "closed", label: "Selesai" },
];

export default function AdminPesanModal({
  open,
  onClose,
  messageId,
}: AdminPesanModalProps) {
  const [data, setData] = useState<MessageItem | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = getSupabaseBrowser();

  // Load data
  useEffect(() => {
    if (messageId && open) {
      setLoading(true);
      const fetchMessage = async () => {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .eq("id", messageId)
          .single();

        if (error) {
          setError("Gagal memuat data pesan: " + error.message);
          setData(null);
        } else if (data) {
          const fetchedData = data as MessageItem;
          setData(fetchedData);
          setStatus(fetchedData.status);
        }
        setLoading(false);
      };
      fetchMessage();
    } else if (open) {
      setData(null);
      setError(null);
    }
  }, [messageId, open, supabase]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    setError(null);

    const { error } = await (supabase
        .from("contact_messages") as any)
        .update({ status })
        .eq("id", data.id);

    if (error) {
        setError("Gagal memperbarui status: " + error.message);
    } else {
        onClose(true); // Close and signal refetch
    }
    setSaving(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
        case 'konsultasi': return "Konsultasi Zakat";
        case 'pengaduan': return "Pengaduan";
        case 'umum': return "Umum";
        default: return type;
    }
  }

  if (!open || !messageId) return null;

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={`Lihat Pesan Masuk`}
      size="lg"
    >
      {loading && <p className="text-primary">Memuat data...</p>}
      {error && (
        <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6 font-jakarta">
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 space-y-2.5 text-sm">
                <div><strong className="text-on-surface">Dari:</strong> <span className="text-on-surface-variant ml-1">{data.name} ({data.email || '-'})</span></div>
                <div><strong className="text-on-surface">Nomor Telepon:</strong> <span className="text-on-surface-variant font-mono ml-1">{data.phone || '-'}</span></div>
                <div className="flex items-center"><strong className="text-on-surface">Jenis Pesan:</strong> <Badge variant="secondary" className="ml-2">{getTypeLabel(data.type)}</Badge></div>
                <div><strong className="text-on-surface">Tanggal Masuk:</strong> <span className="text-on-surface-variant ml-1">{format(new Date(data.created_at), "dd MMMM yyyy, HH:mm", { locale: id })} WIT</span></div>
            </div>
            
            <h3 className="text-base font-bold border-b border-surface-variant/40 dark:border-zinc-800 pb-3 text-[#004229] dark:text-[#8cd6ac]">Subjek: {data.subject}</h3>

            <div className="p-5 bg-slate-50 dark:bg-zinc-800/40 border border-surface-variant/30 dark:border-zinc-800 rounded-2xl whitespace-pre-wrap text-sm text-on-surface leading-relaxed">
                {data.message}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdate} className="pt-4 border-t border-surface-variant/40 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="w-full sm:w-1/2">
                    <label
                        htmlFor="status"
                        className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5"
                    >
                        Perbarui Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-surface-variant/60 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-on-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
                        disabled={saving}
                    >
                        {MESSAGE_STATUSES.map((stat) => (
                            <option key={stat.value} value={stat.value}>
                                {stat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" disabled={saving} className="space-x-2">
                    <span>
                    {saving
                        ? "Menyimpan..."
                        : "Simpan Status"}
                    </span>
                </Button>
            </form>
        </div>
      )}
    </Modal>
  );
}
