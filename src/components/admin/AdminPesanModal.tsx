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
        <div className="space-y-6">
            <div className="bg-surface-container-lowest p-4 rounded-lg space-y-2 text-body-md">
                <p><strong>Dari:</strong> {data.name} ({data.email || '-'})</p>
                <p><strong>Nomor Telepon:</strong> {data.phone || '-'}</p>
                <p><strong>Jenis:</strong> <Badge variant="secondary">{getTypeLabel(data.type)}</Badge></p>
                <p><strong>Tanggal Masuk:</strong> {format(new Date(data.created_at), "dd MMMM yyyy, HH:mm", { locale: id })} WIT</p>
            </div>
            
            <h3 className="text-lg font-semibold border-b border-surface-variant pb-2">Subjek: {data.subject}</h3>

            <div className="p-4 bg-surface-container-low rounded-lg whitespace-pre-wrap">
                {data.message}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdate} className="pt-4 border-t border-surface-variant flex justify-between items-end">
                <div className="w-1/3">
                    <label
                        htmlFor="status"
                        className="block text-body-md font-medium mb-1"
                    >
                        Perbarui Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
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
