// src/components/admin/AdminBeritaModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Database } from "@/types/database.types";
import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type NewsItem = Database["public"]["Tables"]["news"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];

interface AdminBeritaModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editId: string | null;
  categories: Category[];
}

// Initial form state
const initialFormState = {
  title: "",
  slug: "",
  content: "",
  category_id: "",
  published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  is_published: false,
  thumbnail_url: "",
};

export default function AdminBeritaModal({
  open,
  onClose,
  editId,
  categories,
}: AdminBeritaModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  // Load data for editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchNews = async () => {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          setError("Gagal memuat data berita: " + error.message);
        } else if (data) {
          const fetchedData = data as NewsItem;
          setForm({
            ...fetchedData,
            slug: fetchedData.slug || "", // Handle null slug
            content: fetchedData.content || "", // Handle null content
            category_id: fetchedData.category_id || "",
            thumbnail_url: fetchedData.thumbnail_url || "", // Handle null thumbnail_url
            // Format datetime-local input
            published_at: format(
              new Date(fetchedData.published_at),
              "yyyy-MM-dd'T'HH:mm"
            ),
          });
        }
        setLoading(false);
      };
      fetchNews();
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
      // Convert published_at string back to a valid Date object or string for Supabase
      published_at: new Date(form.published_at).toISOString(),
    };

    let result;

    if (editId) {
      result = await (supabase
        .from("news") as any)
        .update(dataToSave)
        .eq("id", editId);
    } else {
      result = await (supabase.from("news") as any).insert(dataToSave);
    }

    if (result.error) {
      setError("Gagal menyimpan berita: " + result.error.message);
    } else {
      onClose(true); // Close and signal refetch
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={editId ? `Edit Berita: ${form.title}` : "Buat Berita Baru"}
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
            Judul
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
            Contoh: berita-terbaru-baznas
          </p>
        </div>

        {/* Content (Simple Textarea for now) */}
        <div>
          <label
            htmlFor="content"
            className="block text-body-md font-medium mb-1"
          >
            Konten (HTML/Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className="flex min-h-[120px] w-full rounded-xl border border-surface-variant/60 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] px-3.5 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label
            htmlFor="thumbnail_url"
            className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1"
          >
            URL Thumbnail
          </label>
          <Input
            id="thumbnail_url"
            name="thumbnail_url"
            value={form.thumbnail_url}
            onChange={handleChange}
          />
        </div>

        {/* Category & Published At */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category_id"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1"
            >
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-surface-variant/60 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-on-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="published_at"
              className="block text-body-md font-medium mb-1"
            >
              Tanggal Terbit
            </label>
            <Input
              id="published_at"
              name="published_at"
              type="datetime-local"
              value={form.published_at}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Is Published Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            checked={form.is_published}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_published" className="text-body-md">
            Terbitkan Sekarang
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
                : "Buat Berita"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
