// src/components/admin/AdminTeamModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FileUploadInput } from "../ui/FileUploadInput";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type TeamMemberItem = Database["public"]["Tables"]["team_members"]["Row"];

interface AdminTeamModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editId: string | null;
}

// Initial form state
const initialFormState = {
  name: "",
  position: "",
  bio: "",
  photo_url: "",
  sort_order: 100, // Default sort order
  is_active: true,
};

export default function AdminTeamModal({
  open,
  onClose,
  editId,
}: AdminTeamModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  // Load data for editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchMember = async () => {
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setError("Gagal memuat data anggota tim: " + error.message);
        } else if (data) {
          const fetchedData = data as TeamMemberItem;
          setForm({
            ...fetchedData,
            bio: fetchedData.bio || "",
            photo_url: fetchedData.photo_url || "",
            sort_order: fetchedData.sort_order || initialFormState.sort_order, // Handle null sort_order
          });
        }
        setLoading(false);
      };
      fetchMember();
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

    const dataToSave = { ...form };

    let result;

    if (editId) {
      result = await (supabase
        .from("team_members") as any)
        .update(dataToSave)
        .eq("id", editId);
    } else {
      result = await (supabase.from("team_members") as any).insert(dataToSave);
    }

    if (result.error) {
      setError("Gagal menyimpan anggota tim: " + result.error.message);
    } else {
      onClose(true); // Close and signal refetch
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={editId ? `Edit Anggota: ${form.name}` : "Tambah Anggota Baru"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {loading && <p className="text-primary">Memuat data...</p>}
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Name & Position */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-body-md font-medium mb-1">
                    Nama Anggota
                </label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="position" className="block text-body-md font-medium mb-1">
                    Jabatan
                </label>
                <Input
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>
        
        {/* Bio (Textarea) */}
        <div>
          <label
            htmlFor="bio"
            className="block text-body-md font-medium mb-1"
          >
            Bio Singkat (Deskripsi)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="flex min-h-[100px] w-full rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant px-3.5 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
          />
        </div>

        {/* Photo Upload & Preview */}
        <FileUploadInput
          label="Foto Anggota / Pimpinan"
          value={form.photo_url}
          onChange={(url) => setForm((prev) => ({ ...prev, photo_url: url }))}
          folder="team"
          acceptType="image"
          helperText="Upload foto profil pimpinan (.jpg, .png, .webp) atau masukkan URL gambar."
        />

        {/* Sort Order */}
        <div>
          <label
            htmlFor="sort_order"
            className="block text-body-md font-medium mb-1"
          >
            Urutan Tampilan
          </label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={handleChange}
            required
          />
        </div>

        {/* Is Active Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-body-md">
            Anggota Aktif (Ditampilkan di Publik)
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
                : "Tambah Anggota"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
