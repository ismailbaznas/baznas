"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Gavel, 
  Scale, 
  CheckCircle, 
  Award, 
  Eye, 
  Wallet, 
  ArrowUpRight, 
  Users, 
  Inbox, 
  Search, 
  Calendar, 
  Filter, 
  ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  description: string | null;
  document_url: string;
  type: string;
  year: number | null;
  created_at: string;
}

interface TransparansiClientProps {
  documents: DocumentItem[];
  stats?: Record<string, { value: string; sub_label: string }>;
}

const FALLBACK_DOCUMENTS: DocumentItem[] = [
  {
    id: "fb-doc-1",
    title: "Laporan Tahunan BAZNAS Boven Digoel 2026",
    description: "Rincian menyeluruh aktivitas penghimpunan, penyaluran, dan laporan keuangan auditan sepanjang tahun 2026.",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "laporan_tahunan",
    year: 2026,
    created_at: "2026-12-31T00:00:00Z"
  },
  {
    id: "fb-doc-2",
    title: "Laporan Penyaluran ZIS Semester II 2026",
    description: "Dokumentasi pendistribusian dana Zakat, Infak, dan Sedekah ke distrik-distrik pelosok Boven Digoel.",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "laporan_penyaluran",
    year: 2026,
    created_at: "2026-12-15T00:00:00Z"
  },
  {
    id: "fb-doc-3",
    title: "Laporan Penghimpunan ZIS Semester I 2026",
    description: "Ikhtisar penerimaan dana dari para muzaki individu, korporat, dan lembaga mitra BAZNAS Boven Digoel.",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "laporan_penghimpunan",
    year: 2026,
    created_at: "2026-06-30T00:00:00Z"
  },
  {
    id: "fb-doc-4",
    title: "Laporan Keuangan Auditan (WTP) Buku 2025",
    description: "Laporan keuangan resmi tahun 2025 yang telah diaudit oleh KAP independen dengan opini Wajar Tanpa Pengecualian.",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "laporan_tahunan",
    year: 2025,
    created_at: "2025-12-31T00:00:00Z"
  },
  {
    id: "fb-doc-5",
    title: "Rencana Kerja & Anggaran Tahunan (RKAT) 2025",
    description: "Kerangka rencana kerja taktis dan sasaran anggaran penghimpunan serta penyaluran ZIS untuk tahun 2025.",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "dokumen_publik",
    year: 2025,
    created_at: "2025-01-10T00:00:00Z"
  }
];

const DOCUMENT_TYPES_MAP: Record<string, string> = {
  laporan_tahunan: "Laporan Tahunan",
  laporan_penghimpunan: "Laporan Penghimpunan",
  laporan_penyaluran: "Laporan Penyaluran",
  dokumen_publik: "Dokumen Publik",
  all: "Semua Kategori"
};

export default function TransparansiClient({ documents, stats }: TransparansiClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedCategoryYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Merge database documents with fallbacks if there are no or very few database items
  const activeDocuments = useMemo(() => {
    if (documents.length === 0) {
      return FALLBACK_DOCUMENTS;
    }
    
    // Merge: prioritize database documents, but if they are less than 5, add fallbacks to make a rich interface
    const merged = [...documents];
    if (documents.length < 5) {
      FALLBACK_DOCUMENTS.forEach(dummy => {
        const isDuplicate = documents.some(doc => doc.title.toLowerCase() === dummy.title.toLowerCase());
        if (!isDuplicate) {
          merged.push(dummy);
        }
      });
    }
    return merged;
  }, [documents]);

  // Extract all unique years available in the documents for the sorting/filter list dynamically
  const availableYears = useMemo(() => {
    const years = activeDocuments
      .map(doc => doc.year)
      .filter((y): y is number => y !== null);
    
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    return uniqueYears.map(String);
  }, [activeDocuments]);

  // Filter documents based on Search Query, selected Year, and selected Type/Category
  const filteredDocuments = useMemo(() => {
    return activeDocuments.filter(doc => {
      // 1. Search filter
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 2. Year filter
      const matchesYear = selectedYear === "all" || String(doc.year) === selectedYear;
      
      // 3. Category/Type filter
      const matchesType = selectedType === "all" || doc.type === selectedType;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [activeDocuments, searchQuery, selectedYear, selectedType]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryYear("all");
    setSelectedType("all");
  };

  // Find the most recent uploaded document from database, or fall back to the first item in activeDocuments
  const latestDocument = useMemo(() => {
    if (documents && documents.length > 0) {
      return [...documents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    }
    return activeDocuments[0] || null;
  }, [documents, activeDocuments]);

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
          <span className="text-[#D4AF37] dark:text-[#ffe088] font-jakarta text-xs md:text-sm font-bold uppercase tracking-widest bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10 px-4 py-1.5 rounded-full">
            Akuntabilitas & Kepercayaan
          </span>
          <h1 className="font-playfair font-bold text-4xl md:text-5xl lg:text-6xl text-primary dark:text-white leading-[1.1] tracking-tight">
            Transparansi adalah Amanah
          </h1>
          <p className="font-jakarta text-base md:text-lg text-[#5B6470] dark:text-slate-300 leading-relaxed max-w-xl">
            Setiap rupiah yang Anda amanahkan kepada BAZNAS Kabupaten Boven Digoel dikelola secara profesional, akuntabel, dan transparan sesuai dengan syariat Islam dan peraturan perundang-undangan nasional.
          </p>
          <div className="pt-2">
            <a 
              href={latestDocument ? latestDocument.document_url : "#laporan"}
              target={latestDocument ? "_blank" : undefined}
              rel={latestDocument ? "noopener noreferrer" : undefined}
              className="bg-[#075C3B] text-white hover:bg-[#004229] dark:bg-[#8cd6ac] dark:text-[#002112] dark:hover:bg-[#a8f3c7] font-jakarta font-bold text-sm py-4 px-8 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              Unduh Laporan Terakhir
              <Download className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-[320px] md:h-[450px] lg:h-[500px] relative rounded-2xl overflow-hidden shadow-md border border-surface-variant/40 dark:border-outline/10 group">
          <Image 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP0dlPARimEyjxn6vZMByHUtT__uNNBwgEo2aNjk7vo3J44rrAzsEPRb0SGT_ukBqNR-6HozErWRZYZ--gBP4MEalnout8xXnPKRp9GBnshfBRxJc_FLQiPhr-ef0eZ6EUYhjGMy1zBWnFlUIAH_LSZvMsZ-_R4V5mQfTtQbG0PWo772wK3xsChToG_IzKBYx0FHaXWC6ei62nR76nZyBKbCAGnLAd4lcXplWSdY9JRlVIOihHV5ke" 
            alt="Transparansi Pengelolaan Zakat" 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </section>

      {/* Financial Highlights (Trust Strip - Laporan Kinerja 2026) */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 md:py-20 border-y border-surface-variant/40 dark:border-outline/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-primary dark:text-white mb-4">
              Laporan Kinerja Keuangan
            </h2>
            <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Ringkasan realisasi pengumpulan dan penyaluran dana Zakat, Infak, dan Sedekah (ZIS) Boven Digoel sepanjang tahun anggaran berjalan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-surface-variant/50 dark:border-outline/10 hover:shadow-md transition-shadow duration-300 flex flex-col items-center shadow-sm animate-fadeIn">
              <div className="w-14 h-14 rounded-xl bg-[#004229]/5 dark:bg-[#8cd6ac]/10 flex items-center justify-center mb-6 text-[#075C3B] dark:text-[#8cd6ac]">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="font-playfair font-bold text-3xl md:text-4xl text-[#1F2937] dark:text-white mb-2 tracking-tight">
                {stats?.dana_dihimpun?.value || "Rp 2,45 Miliar"}
              </h3>
              <p className="font-jakarta font-bold text-xs text-[#D4AF37] dark:text-[#ffe088] uppercase tracking-widest mb-1">
                Dana Dihimpun
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {stats?.dana_dihimpun?.sub_label || "Tahun 2026"}
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-surface-variant/50 dark:border-outline/10 hover:shadow-md transition-shadow duration-300 flex flex-col items-center shadow-sm animate-fadeIn">
              <div className="w-14 h-14 rounded-xl bg-[#004229]/5 dark:bg-[#8cd6ac]/10 flex items-center justify-center mb-6 text-[#075C3B] dark:text-[#8cd6ac]">
                <ArrowUpRight className="w-7 h-7" />
              </div>
              <h3 className="font-playfair font-bold text-3xl md:text-4xl text-[#1F2937] dark:text-white mb-2 tracking-tight">
                {stats?.dana_disalurkan?.value || "Rp 2,30 Miliar"}
              </h3>
              <p className="font-jakarta font-bold text-xs text-[#D4AF37] dark:text-[#ffe088] uppercase tracking-widest mb-1">
                Dana Disalurkan
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {stats?.dana_disalurkan?.sub_label || "Tahun 2026"}
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-surface-variant/50 dark:border-outline/10 hover:shadow-md transition-shadow duration-300 flex flex-col items-center shadow-sm animate-fadeIn">
              <div className="w-14 h-14 rounded-xl bg-[#004229]/5 dark:bg-[#8cd6ac]/10 flex items-center justify-center mb-6 text-[#075C3B] dark:text-[#8cd6ac]">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-playfair font-bold text-3xl md:text-4xl text-[#1F2937] dark:text-white mb-2 tracking-tight">
                {stats?.mustahik_terlayani?.value || "4.850 Jiwa"}
              </h3>
              <p className="font-jakarta font-bold text-xs text-[#D4AF37] dark:text-[#ffe088] uppercase tracking-widest mb-1">
                Mustahik Terlayani
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {stats?.mustahik_terlayani?.sub_label || "Tahun 2026"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Repository (Transparency Panel - Re-designed to be Full Width with Stateful Filters) */}
      <section id="laporan" className="max-w-[1320px] mx-auto px-6 md:px-12 py-16 md:py-24 border-b border-surface-variant/40 dark:border-outline/10">
        
        {/* Intro Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 items-center">
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-primary dark:text-white">
              Arsip Laporan Resmi
            </h2>
            <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 leading-relaxed">
              Sebagai bentuk pertanggungjawaban publik dan keterbukaan informasi kepada muzaki, BAZNAS Kabupaten Boven Digoel secara berkala mempublikasikan laporan keuangan dan laporan kinerja operasional. Seluruh laporan keuangan telah melalui proses audit independen demi integritas dan akurasi data.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#075C3B] dark:text-[#8cd6ac]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-jakarta text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Status Audit</span>
              </div>
              <p className="font-jakarta text-[11px] text-[#5B6470] dark:text-slate-400 leading-relaxed">
                Opini <span className="font-bold text-[#075C3B]">WTP</span> oleh Kantor Akuntan Publik Independen tahun buku 2026.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#075C3B] dark:text-[#8cd6ac]">
                <Gavel className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-jakarta text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Audit Syariah</span>
              </div>
              <p className="font-jakarta text-[11px] text-[#5B6470] dark:text-slate-400 leading-relaxed">
                Kepatuhan Syariah <span className="font-bold text-[#075C3B]">100% Sesuai Syariat</span> dari Kementerian Agama.
              </p>
            </div>
          </div>
        </div>

        {/* Stateful Filters Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-60" />
              <input 
                type="text"
                placeholder="Cari nama laporan atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 font-jakarta text-xs outline-none dark:text-white"
              />
            </div>

            {/* Right: Year Selector Dropdown & Filter Quick Reset */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold font-jakarta text-on-surface-variant uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#075C3B] dark:text-[#8cd6ac]" />
                Urut Tahun:
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedCategoryYear(e.target.value)}
                className="rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-2.5 font-jakarta text-xs outline-none dark:text-white appearance-none pr-8 relative min-w-[130px]"
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Tahun {year}
                  </option>
                ))}
              </select>

              {(searchQuery !== "" || selectedYear !== "all" || selectedType !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-800 dark:text-red-400 font-jakarta border border-red-200 dark:border-red-900/40 rounded-lg px-3 py-2.5 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-variant/40 dark:border-outline/10">
            {Object.entries(DOCUMENT_TYPES_MAP).map(([key, label]) => {
              const isActive = selectedType === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={cn(
                    "text-xs font-bold font-jakarta px-4 py-2 rounded-full border transition-all duration-200",
                    isActive 
                      ? "bg-[#004229] border-[#004229] text-white dark:bg-[#8cd6ac] dark:border-[#8cd6ac] dark:text-[#002112]"
                      : "bg-[#F8F6F1] border-surface-variant/40 text-[#5B6470] hover:bg-surface-container hover:text-[#004229] dark:bg-slate-800 dark:border-outline/10 dark:text-slate-300"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stateful Grid of Filtered Documents */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-variant/50 dark:border-outline/10 p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-800/40 transition-all duration-300 shadow-sm group"
              >
                <div className="space-y-4">
                  {/* Top card row */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#075C3B]/10 text-[#075C3B] dark:bg-[#8cd6ac]/15 dark:text-[#8cd6ac] flex items-center justify-center shrink-0 group-hover:bg-[#075C3B] group-hover:text-white dark:group-hover:bg-[#8cd6ac] dark:group-hover:text-[#002112] transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="bg-[#D4AF37]/10 text-[#8c690f] dark:text-[#ffe088] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded font-jakarta">
                      Tahun {doc.year || "Publik"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="font-playfair font-bold text-lg text-[#1F2937] dark:text-white leading-tight group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors line-clamp-2">
                      {doc.title}
                    </h4>
                    <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-400 leading-relaxed line-clamp-2">
                      {doc.description || "Laporan resmi terenkripsi untuk transparansi pengelolaan dana zakat, infak, dan sedekah BAZNAS Boven Digoel."}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Row */}
                <div className="pt-4 border-t border-surface-variant/40 dark:border-outline/10 mt-6 flex items-center justify-between">
                  <span className="font-jakarta text-[10px] font-bold text-on-surface-variant uppercase opacity-70">
                    {DOCUMENT_TYPES_MAP[doc.type] || "Laporan"}
                  </span>
                  <a 
                    href={doc.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#075C3B] dark:text-[#8cd6ac] font-jakarta hover:underline"
                  >
                    Unduh PDF
                    <Download className="w-3.5 h-3.5 animate-pulse" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-outline-variant/60 max-w-xl mx-auto shadow-sm space-y-4">
            <Inbox className="w-12 h-12 text-on-surface-variant mx-auto opacity-70" />
            <h3 className="font-playfair text-xl font-bold text-on-surface">Tidak Ada Dokumen Cocok</h3>
            <p className="font-jakarta text-sm text-on-surface-variant px-6 max-w-md mx-auto">
              Maaf, dokumen dengan kriteria pencarian "{searchQuery || "tersebut"}" pada kategori ini tidak ditemukan. Silakan reset filter pencarian Anda.
            </p>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#075C3B] hover:underline font-jakarta"
            >
              Kembali ke Semua Laporan
            </button>
          </div>
        )}
      </section>

      {/* Institutional seals & Commitment (Re-designed Background: Different from Emerald Footer) */}
      <section className="bg-[#F8F6F1] dark:bg-slate-950 text-[#1F2937] dark:text-white py-16 md:py-24 border-t border-surface-variant/40 dark:border-outline/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-primary dark:text-white">
              Komitmen Kelembagaan Kami
            </h2>
            <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              Kami berdiri di atas pilar amanah dan kepatuhan syariah yang kokoh, mengabdi seutuhnya demi kemaslahatan masyarakat Boven Digoel.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { title: "Diaudit Syariah", desc: "Sesuai prinsip kepatuhan syariat Islam.", icon: Scale },
              { title: "Akuntabel", desc: "Dapat dipertanggungjawabkan publik sepenuhnya.", icon: ShieldCheck },
              { title: "Profesional", desc: "Dikelola oleh amil profesional yang bersertifikasi.", icon: Award },
              { title: "Transparan", desc: "Akses informasi keuangan terbuka luas untuk publik.", icon: Eye }
            ].map((seal, index) => {
              const Icon = seal.icon;
              return (
                <div key={index} className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] dark:border-[#ffe088] bg-white dark:bg-slate-900 flex items-center justify-center text-[#D4AF37] dark:text-[#ffe088] hover:scale-105 transition-transform duration-300 shadow-md">
                    <Icon className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-[#004229] dark:text-white">
                    {seal.title}
                  </h3>
                  <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-400 max-w-[180px]">
                    {seal.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}