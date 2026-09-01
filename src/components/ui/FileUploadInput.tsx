// src/components/ui/FileUploadInput.tsx

"use client";

import React, { useState, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  X, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "news" | "programs" | "team" | "transparansi" | "settings";
  acceptType?: "image" | "pdf";
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export function FileUploadInput({
  label,
  value,
  onChange,
  folder,
  acceptType = "image",
  placeholder,
  helperText,
  className,
}: FileUploadInputProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = getSupabaseBrowser();

  const isPdf = acceptType === "pdf";
  const acceptedFileTypes = isPdf
    ? "application/pdf,.pdf"
    : "image/jpeg,image/png,image/webp,image/gif,image/avif,.jpg,.jpeg,.png,.webp,.gif,.avif";

  const maxMB = isPdf ? 10 : 5;

  // Handle file selection & upload
  const processFile = async (file: File) => {
    setError(null);

    // 1. Validate file type
    if (isPdf) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Format berkas harus PDF (.pdf)");
        return;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
      if (!validTypes.includes(file.type) && !/\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name)) {
        setError("Format gambar harus JPEG, PNG, WebP, GIF, atau AVIF");
        return;
      }
    }

    // 2. Validate file size
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Ukuran berkas melebihi batas maksimal ${maxMB} MB`);
      return;
    }

    setUploading(true);

    try {
      // Create a clean filename
      const ext = file.name.split(".").pop()?.toLowerCase() || (isPdf ? "pdf" : "png");
      const cleanBaseName = file.name
        .substring(0, file.name.lastIndexOf("."))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 30);
      const filePath = `public/${folder}/${Date.now()}_${cleanBaseName}.${ext}`;

      // Upload to Supabase Storage bucket 'baznas'
      const { data, error: uploadError } = await supabase.storage
        .from("baznas")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // Detailed error message if bucket issue
        if (uploadError.message.includes("not found") || uploadError.message.includes("Bucket")) {
          setError(
            "Bucket 'baznas' belum dibuat di Supabase Storage. Menggunakan mode URL Manual sebagai cadangan."
          );
          setActiveTab("url");
        } else {
          setError(`Gagal mengunggah berkas: ${uploadError.message}`);
        }
        setUploading(false);
        return;
      }

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("baznas")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
        setError(null);
      } else {
        setError("Gagal mengambil URL publik berkas.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat mengunggah berkas.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
        {/* Mode Selector Tabs */}
        <div className="flex rounded-lg bg-surface-variant/40 dark:bg-surface-variant/20 p-0.5 border border-surface-variant/60">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              activeTab === "upload"
                ? "bg-white dark:bg-surface-variant text-[#075C3B] dark:text-[#8cd6ac] shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Berkas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={cn(
              "flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              activeTab === "url"
                ? "bg-white dark:bg-surface-variant text-[#075C3B] dark:text-[#8cd6ac] shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>URL Manual</span>
          </button>
        </div>
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Tab Content 1: Upload File */}
      {activeTab === "upload" && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-white dark:bg-surface-variant/40 text-center",
            dragActive
              ? "border-[#075C3B] bg-[#075C3B]/5 dark:bg-[#075C3B]/10 scale-[1.01]"
              : "border-surface-variant/80 dark:border-surface-variant/60 hover:border-[#075C3B]/60 dark:hover:border-[#8cd6ac]/60 hover:bg-slate-50 dark:hover:bg-surface-variant/60",
            uploading && "pointer-events-none opacity-80"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2 py-3">
              <Loader2 className="w-8 h-8 text-[#075C3B] dark:text-[#8cd6ac] animate-spin" />
              <p className="text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac]">
                Mengunggah berkas ke Supabase Storage...
              </p>
              <p className="text-[11px] text-on-surface-variant">Folder: public/{folder}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 py-2">
              <div className="p-2.5 rounded-full bg-[#075C3B]/10 text-[#075C3B] dark:bg-[#8cd6ac]/10 dark:text-[#8cd6ac]">
                {isPdf ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">
                  Klik untuk pilih {isPdf ? "dokumen PDF" : "gambar"} atau tarik & lepas di sini
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  {isPdf
                    ? `Format: PDF (Maks. ${maxMB} MB)`
                    : `Format: JPG, PNG, WebP, GIF, AVIF (Maks. ${maxMB} MB)`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: URL Manual */}
      {activeTab === "url" && (
        <div>
          <div className="relative flex items-center">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || (isPdf ? "https://example.com/laporan.pdf" : "https://example.com/gambar.jpg")}
              className="flex h-10 w-full rounded-xl border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant px-3.5 py-2 pr-10 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-2.5 text-on-surface-variant hover:text-status-danger p-1"
                title="Hapus URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-xs text-status-danger bg-status-danger/10 p-2.5 rounded-lg border border-status-danger/30">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-[11px] text-on-surface-variant">{helperText}</p>
      )}

      {/* PREVIEW CONTAINER */}
      {value && (
        <div className="mt-2 rounded-xl border border-surface-variant/80 dark:border-surface-variant/50 bg-slate-50 dark:bg-surface-variant/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center space-x-1.5 text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Preview Berkas Terpasang</span>
            </span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-status-danger hover:underline flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus Berkas</span>
            </button>
          </div>

          {/* Preview for PDF */}
          {isPdf ? (
            <div className="flex items-center justify-between p-2.5 bg-white dark:bg-surface-variant/80 rounded-lg border border-surface-variant/60">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {value.split("/").pop() || "Dokumen PDF"}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">{value}</p>
                </div>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs font-medium text-[#075C3B] dark:text-[#8cd6ac] hover:underline flex-shrink-0 ml-2"
              >
                <span>Buka PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            /* Preview for Image */
            <div className="relative group rounded-lg overflow-hidden border border-surface-variant/60 bg-white dark:bg-surface-variant/80">
              <div className="relative aspect-video w-full max-h-[180px] bg-slate-100 dark:bg-surface-variant/50 flex items-center justify-center overflow-hidden">
                {/* Standard img tag for immediate preview compatibility */}
                {/* eslint-disable-next-html-element-suppression */}
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback on broken image link
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="p-2 flex items-center justify-between text-xs text-on-surface-variant bg-white dark:bg-surface-variant border-t border-surface-variant/40">
                <span className="truncate max-w-[70%] font-mono text-[11px]" title={value}>
                  {value}
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 font-medium text-[#075C3B] dark:text-[#8cd6ac] hover:underline"
                >
                  <span>Lihat Penuh</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
