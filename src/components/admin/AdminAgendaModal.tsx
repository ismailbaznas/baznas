// src/components/admin/AdminAgendaModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type AgendaItem = Database["public"]["Tables"]["agendas"]["Row"];

interface AdminAgendaModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editId: string | null;
}

const formatDbToInput = (dbTime: string | null | undefined): string => {
    if (!dbTime) return "";
    // format to 'YYYY-MM-DDTHH:MM' for datetime-local input
    return format(new Date(dbTime), "yyyy-MM-dd'T'HH:mm");
};

// Initial form state
const initialFormState = {
  title: "",
  description: "",
  start_time: formatDbToInput(new Date().toISOString()),
  end_time: "",
  location: "",
  status: "scheduled",
  is_public: true,
};

const AGENDA_STATUSES = [
    { value: "scheduled", label: "Terjadwal" },
    { value: "ongoing", label: "Sedang Berlangsung" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
];

export default function AdminAgendaModal({
  open,
  onClose,
  editId,
}: AdminAgendaModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  // Load data for editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchAgenda = async () => {
        const { data, error } = await supabase
          .from("agendas")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setError("Gagal memuat data agenda: " + error.message);
        } else if (data) {
          const fetchedData = data as AgendaItem;
          setForm({
            ...fetchedData,
            description: fetchedData.description || "",
            location: fetchedData.location || "",
            start_time: formatDbToInput(fetchedData.start_time),
            end_time: formatDbToInput(fetchedData.end_time),
          });
        }
        setLoading(false);
      };
      fetchAgenda();
    } else if (open) {
      // Reset form for creation
      setForm(initialFormState);
      setError(null);
    }
  }, [editId, open, supabase]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSave = {
      ...form,
      // Convert input strings (datetime-local format) back to ISO strings (UTC) for Supabase
      start_time: new Date(form.start_time).toISOString(),
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
    };

    let result;

    if (editId) {
      result = await (supabase
        .from("agendas") as any)
        .update(dataToSave)
        .eq("id", editId);
    } else {
      result = await (supabase.from("agendas") as any).insert(dataToSave);
    }

    if (result.error) {
      setError("Gagal menyimpan agenda: " + result.error.message);
    } else {
      onClose(true); // Close and signal refetch
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={editId ? `Edit Agenda: ${form.title}` : "Buat Agenda Baru"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {loading && <p className="text-primary">Memuat data...</p>}
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Title & Location */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="title" className="block text-body-md font-medium mb-1">
                    Nama Kegiatan
                </label>
                <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-body-md font-medium mb-1">
                    Lokasi
                </label>
                <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>
        
        {/* Description (Textarea) */}
        <div>
          <label
            htmlFor="description"
            className="block text-body-md font-medium mb-1"
          >
            Deskripsi/Detail Kegiatan
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={cn(
                "flex min-h-[80px] w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              )}
          />
        </div>

        {/* Start & End Time */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label
                    htmlFor="start_time"
                    className="block text-body-md font-medium mb-1"
                >
                    Waktu Mulai
                </label>
                <Input
                    id="start_time"
                    name="start_time"
                    type="datetime-local"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="end_time"
                    className="block text-body-md font-medium mb-1"
                >
                    Waktu Selesai (Opsional)
                </label>
                <Input
                    id="end_time"
                    name="end_time"
                    type="datetime-local"
                    value={form.end_time}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* Status & Public */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label
                    htmlFor="status"
                    className="block text-body-md font-medium mb-1"
                >
                    Status Kegiatan
                </label>
                <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                >
                    {AGENDA_STATUSES.map((stat) => (
                        <option key={stat.value} value={stat.value}>
                            {stat.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-end pb-2">
                <input
                    id="is_public"
                    name="is_public"
                    type="checkbox"
                    checked={form.is_public}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_public" className="text-body-md ml-2">
                    Tampilkan ke Publik
                </label>
            </div>
        </div>


        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="space-x-2">
            <span>
              {loading
                ? "Menyimpan..."
                : editId
                ? "Simpan Perubahan"
                : "Buat Agenda"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
