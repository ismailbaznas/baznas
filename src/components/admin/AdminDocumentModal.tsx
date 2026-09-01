// src/components/admin/AdminDocumentModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FileUploadInput } from "../ui/FileUploadInput";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type DocumentItem = Database["public"]["Tables"]["documents"]["Row"];

interface AdminDocumentModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editId: string | null;
}

const documentTypes = [
  { label: "Laporan Penghimpunan", value: "laporan_penghimpunan" },
  { label: "Laporan Penyaluran", value: "laporan_penyaluran" },
  { label: "Laporan Tahunan", value: "laporan_tahunan" },
  { label: "Dokumen Publik Lain", value: "dokumen_publik" },
];

// Initial form state
const initialFormState = {
  title: "",
  description: "",
  document_url: "",
  type: "laporan_penghimpunan",
  year: new Date().getFullYear(),
  is_public: true,
};

export default function AdminDocumentModal({
  open,
  onClose,
  editId,
}: AdminDocumentModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  // Load data for editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchDocument = async () => {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setError("Gagal memuat data dokumen: " + error.message);
        } else if (data) {
          const fetchedData = data as DocumentItem;
          setForm({
            ...fetchedData,
            document_url: fetchedData.document_url || "",
            description: fetchedData.description || "",
            year: fetchedData.year || new Date().getFullYear(),
          });
        }
        setLoading(false);
      };
      fetchDocument();
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
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? parseInt(value) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSave = {
      ...form,
    };

    let result;

    if (editId) {
      result = await (supabase
        .from("documents") as any)
        .update(dataToSave)
        .eq("id", editId);
    } else {
      result = await (supabase.from("documents") as any).insert(dataToSave);
    }

    if (result.error) {
      setError("Gagal menyimpan dokumen: " + result.error.message);
    } else {
      onClose(true); // Close and signal refetch
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={editId ? `Edit Dokumen: ${form.title}` : "Unggah Dokumen Baru"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {loading && <p className="text-primary">Memuat data...</p>}
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-body-md font-medium mb-1">
            Judul Dokumen
          </label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Description (Textarea) */}
        <div>
          <label
            htmlFor="description"
            className="block text-body-md font-medium mb-1"
          >
            Deskripsi Singkat
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="flex min-h-[80px] w-full rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant px-3.5 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
          />
        </div>

        {/* Dokumen PDF Upload & Preview */}
        <FileUploadInput
          label="Dokumen Berkas Transparansi (PDF)"
          value={form.document_url}
          onChange={(url) => setForm((prev) => ({ ...prev, document_url: url }))}
          folder="transparansi"
          acceptType="pdf"
          helperText="Upload file laporan format PDF (.pdf) atau masukkan URL dokumen publik."
        />


        {/* Type & Year */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="type"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1"
            >
              Jenis Dokumen
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant text-on-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-body-md font-medium mb-1"
            >
              Tahun
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Is Public Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={form.is_public}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_public" className="text-body-md">
            Tampilkan ke Publik (Transparansi)
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="space-x-2">
            <span>
              {loading
                ? "Menyimpan..."
                : editId
                ? "Simpan Perubahan"
                : "Unggah Dokumen"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
