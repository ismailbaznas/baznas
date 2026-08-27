// src/components/admin/AdminProgramModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type ProgramItem = Database["public"]["Tables"]["programs"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];

interface AdminProgramModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editId: string | null;
  categories: Category[];
}

// Initial form state
const initialFormState = {
  title: "",
  slug: "",
  description: "",
  category_id: "",
  image_url: "",
  is_active: true,
};

export default function AdminProgramModal({
  open,
  onClose,
  editId,
  categories,
}: AdminProgramModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  // Load data for editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchProgram = async () => {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setError("Gagal memuat data program: " + error.message);
        } else if (data) {
          const fetchedData = data as ProgramItem;
          setForm({
            ...fetchedData,
            slug: fetchedData.slug || "", // Handle null slug
            category_id: fetchedData.category_id || "",
            description: fetchedData.description || "",
            image_url: fetchedData.image_url || "",
          });
        }
        setLoading(false);
      };
      fetchProgram();
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

  const handleSlugify = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove all non-word chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with single dash
      .replace(/^-+|-+$/g, ""); // Remove dashes from start/end
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSave = {
      ...form,
      // Ensure category_id is null if empty string
      category_id: form.category_id || null,
    };

    let result;

    if (editId) {
      result = await (supabase
        .from("programs") as any)
        .update(dataToSave)
        .eq("id", editId);
    } else {
      result = await (supabase.from("programs") as any).insert(dataToSave);
    }

    if (result.error) {
      setError("Gagal menyimpan program: " + result.error.message);
    } else {
      onClose(true); // Close and signal refetch
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={editId ? `Edit Program: ${form.title}` : "Buat Program Baru"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {loading && <p className="text-primary">Memuat data...</p>}
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-body-md font-medium mb-1">
            Nama Program
          </label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={(e) => {
              handleChange(e);
              handleSlugify(e.target.value);
            }}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-body-md font-medium mb-1">
            Slug (URL)
          </label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            title="Slug harus dalam format kebab-case (huruf kecil dan angka, dipisahkan tanda hubung)"
          />
          <p className="text-sm text-on-surface-variant mt-1">
            Contoh: program-peduli-pendidikan
          </p>
        </div>

        {/* Description (Simple Textarea) */}
        <div>
          <label
            htmlFor="description"
            className="block text-body-md font-medium mb-1"
          >
            Deskripsi Program
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className={cn(
                "flex min-h-[80px] w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              )}
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image_url"
            className="block text-body-md font-medium mb-1"
          >
            URL Gambar Program
          </label>
          <Input
            id="image_url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </div>

        {/* Category & Active */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category_id"
              className="block text-body-md font-medium mb-1"
            >
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-body-md ml-2">
                Program Aktif
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
                : "Buat Program"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
