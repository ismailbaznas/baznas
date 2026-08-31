// src/components/admin/ExecutiveDashboardClient.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  HeartHandshake,
  MessageSquare,
  FileText,
  Newspaper,
  Layers,
  Settings,
  Filter,
  RotateCcw,
  MapPin,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  X
} from "lucide-react";

interface ExecutiveDashboardProps {
  user: {
    name?: string | null;
    email: string;
    role?: string | null;
  };
  counts: {
    newsCount: number;
    programCount: number;
    usersCount: number;
    newMessagesCount: number;
    totalMessagesCount: number;
    newBantuanCount: number;
    approvedBantuanCount: number;
    totalBantuanCount: number;
    docsCount: number;
  };
}

// Initial Data for Visualizations
const PILAR_PROGRAM_DATA = [
  { label: "BAZNAS Cerdas (Pendidikan)", realisasi: 680, target: 800, percentage: 85.0, color: "#38bdf8" }, // Cyan
  { label: "BAZNAS Sehat (Kesehatan)", realisasi: 520, target: 650, percentage: 80.0, color: "#10b981" },   // Emerald
  { label: "BAZNAS Peduli (Kemanusiaan)", realisasi: 450, target: 500, percentage: 90.0, color: "#f59e0b" }, // Gold/Amber
  { label: "BAZNAS Mandiri (Ekonomi)", realisasi: 420, target: 500, percentage: 84.0, color: "#a855f7" },   // Purple
  { label: "BAZNAS Taqwa (Dakwah)", realisasi: 230, target: 300, percentage: 76.6, color: "#ec4899" },      // Pink
];

const TOP_DISTRIK_DATA = [
  { distrik: "Mandobo (Tanah Merah)", nominal: 680, mustahik: 1240 },
  { distrik: "Jair (Getentiri)", nominal: 520, mustahik: 980 },
  { distrik: "Mindiptana", nominal: 380, mustahik: 750 },
  { distrik: "Waropko", nominal: 240, mustahik: 490 },
  { distrik: "Subur", nominal: 180, mustahik: 360 },
  { distrik: "Iniyandit", nominal: 150, mustahik: 310 },
  { distrik: "Kouh", nominal: 130, mustahik: 270 },
  { distrik: "Kombut", nominal: 110, mustahik: 230 },
  { distrik: "Ninati", nominal: 95, mustahik: 190 },
  { distrik: "Sesnuk", nominal: 85, mustahik: 160 },
];

export default function ExecutiveDashboardClient({ user, counts }: ExecutiveDashboardProps) {
  // Filter drawer state
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedDistrik, setSelectedDistrik] = useState("semua");
  const [selectedJenisDana, setSelectedJenisDana] = useState("semua");
  const [selectedStatus, setSelectedStatus] = useState("semua");

  const totalContent = counts.newsCount + counts.programCount;

  const handleResetFilter = () => {
    setSelectedYear("2026");
    setSelectedDistrik("semua");
    setSelectedJenisDana("semua");
    setSelectedStatus("semua");
  };

  return (
    <div className="space-y-6 font-jakarta transition-colors duration-300">
      
      {/* 1. Header Command Center Title & Toolbar (Adaptive Light/Dark Deep Emerald) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#004229] via-[#075C3B] to-[#004229] dark:from-[#051808] dark:via-[#08240e] dark:to-[#051808] text-white p-6 rounded-3xl border border-[#075C3B]/30 dark:border-[#0f4018] shadow-lg dark:shadow-xl relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 dark:bg-[#075C3B]/30 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-[#D4AF37]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-[#ffe088] dark:bg-emerald-500/20 dark:text-emerald-300 border border-white/20 dark:border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] dark:bg-emerald-400 animate-ping" />
              Executive Command Center
            </span>
            <span className="text-xs text-white/80 dark:text-emerald-300/80 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#ffe088] dark:text-[#D4AF37]" />
              Data Real-Time: {selectedYear}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white tracking-tight pt-1">
            Dasbor Utama & Ringkasan Eksekutif
          </h1>
          <p className="text-xs text-white/90 dark:text-slate-300 max-w-2xl leading-relaxed">
            Pemantauan real-time penghimpunan, penyaluran 5 pilar, permohonan mustahik, dan akuntabilitas BAZNAS Kab. Boven Digoel.
          </p>
        </div>

        {/* Top Controls */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 dark:bg-[#0c3514] dark:hover:bg-[#10441a] text-white border border-white/20 dark:border-[#134d1e] shadow-sm transition-all"
          >
            <Filter className="w-4 h-4 text-[#ffe088] dark:text-[#D4AF37]" />
            <span>Filter Data</span>
            {(selectedDistrik !== "semua" || selectedJenisDana !== "semua" || selectedStatus !== "semua") && (
              <span className="w-2 h-2 rounded-full bg-[#ffe088] dark:bg-[#D4AF37]" />
            )}
          </button>

          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#a08124] text-[#004229] dark:bg-[#075C3B] dark:hover:bg-[#004229] dark:text-white shadow-md transition-all active:scale-[0.98]"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Columns Bento Row - Adaptive Light & Dark Deep Emerald) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Dana Dihimpun */}
        <div className="bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-5 rounded-2xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              Total Dana Dihimpun
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#075C3B] dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#004229] dark:text-white font-playfair tracking-tight">
            Rp 2.450 M
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="inline-flex items-center font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12,4%
            </span>
            <span className="text-slate-500 dark:text-slate-400">vs tahun lalu</span>
          </div>
        </div>

        {/* Card 2: Total Realisasi Penyaluran */}
        <div className="bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-5 rounded-2xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              Realisasi Penyaluran
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 dark:bg-[#D4AF37]/20 dark:text-[#ffe088] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#004229] dark:text-white font-playfair tracking-tight">
            Rp 2.300 M
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="inline-flex items-center font-bold text-amber-800 dark:text-[#ffe088] bg-amber-100 dark:bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
              93,8%
            </span>
            <span className="text-slate-500 dark:text-slate-400">pagu target RKAT</span>
          </div>
        </div>

        {/* Card 3: Total Mustahik Terlayani */}
        <div className="bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-5 rounded-2xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              Penerima Manfaat
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#004229] dark:text-white font-playfair tracking-tight">
            4.850 Jiwa
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="inline-flex items-center font-bold text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 15,2%
            </span>
            <span className="text-slate-500 dark:text-slate-400">penerima aktif</span>
          </div>
        </div>

        {/* Card 4: Permohonan Bantuan */}
        <div className="bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-5 rounded-2xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              Permohonan Mustahik
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#004229] dark:text-white font-playfair tracking-tight">
            {counts.newBantuanCount} Baru
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{counts.totalBantuanCount} total permohonan</span>
          </div>
        </div>

        {/* Card 5: Wilayah Terjangkau */}
        <div className="bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-5 rounded-2xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              Cakupan Wilayah
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#004229] dark:text-white font-playfair tracking-tight">
            20 Distrik
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="text-purple-700 dark:text-purple-300 font-semibold">Kabupaten Boven Digoel</span>
          </div>
        </div>
      </div>

      {/* 3. Main Bento Grid Visualizer Section (Adaptive Deep Dark Green) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Bento Item 1: Line / Area SVG Chart - Tren Realisasi 5 Tahun (6 Kolom) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm dark:shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#075C3B] dark:text-emerald-400" />
                  <span>Tren Realisasi & Target ZIS</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pertumbuhan realisasi anggaran 5 tahun (dalam Miliar Rupiah)</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="w-3 h-0.5 bg-[#075C3B] dark:bg-emerald-400 rounded" /> Realisasi
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-3 h-0.5 bg-[#D4AF37] rounded border border-dashed" /> Target
                </span>
              </div>
            </div>

            {/* SVG Visualizer Chart */}
            <div className="h-56 w-full pt-4 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                {/* Background Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" className="dark:stroke-[#0f4018]" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" className="dark:stroke-[#0f4018]" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" className="dark:stroke-[#0f4018]" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-[#134d1e]" />

                {/* Y-Axis Labels */}
                <text x="5" y="35" className="fill-slate-500 dark:fill-slate-400" fontSize="10">2.5 M</text>
                <text x="5" y="85" className="fill-slate-500 dark:fill-slate-400" fontSize="10">2.0 M</text>
                <text x="5" y="135" className="fill-slate-500 dark:fill-slate-400" fontSize="10">1.5 M</text>

                {/* Gradient Fill under Realisasi */}
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#075C3B" stopOpacity="0.3" className="dark:stop-color-emerald-400" />
                    <stop offset="100%" stopColor="#075C3B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Target Line (Dashed Gold) */}
                <path
                  d="M 50 140 L 150 105 L 250 80 L 350 60 L 450 45"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Area Fill for Realisasi */}
                <path
                  d="M 50 165 L 150 122 L 250 95 L 350 72 L 450 60 L 450 190 L 50 190 Z"
                  fill="url(#emeraldGradient)"
                />

                {/* Realisasi Line */}
                <path
                  d="M 50 165 L 150 122 L 250 95 L 350 72 L 450 60"
                  fill="none"
                  stroke="#075C3B"
                  strokeWidth="3"
                  className="dark:stroke-emerald-400"
                />

                {/* Point Markers & Tooltips */}
                {[
                  { x: 50, y: 165, year: "2022", val: "1.25 M" },
                  { x: 150, y: 122, year: "2023", val: "1.68 M" },
                  { x: 250, y: 95, year: "2024", val: "1.95 M" },
                  { x: 350, y: 72, year: "2025", val: "2.18 M" },
                  { x: 450, y: 60, year: "2026", val: "2.30 M" },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="5" className="fill-[#075C3B] dark:fill-emerald-400 stroke-white dark:stroke-[#051808]" strokeWidth="2" />
                    <text x={pt.x} y="198" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 font-bold" fontSize="11">
                      {pt.year}
                    </text>
                    <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="fill-[#075C3B] dark:fill-cyan-400 font-bold" fontSize="10">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#0f4018] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Capaian pertumbuhan rata-rata: <strong className="text-[#075C3B] dark:text-emerald-400">+14.2% / tahun</strong></span>
            <Link href="/admin/transparansi" className="text-[#075C3B] dark:text-[#ffe088] font-bold hover:underline flex items-center gap-1">
              Rincian Laporan <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bento Item 2: Sebaran Distrik Boven Digoel (6 Kolom) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm dark:shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span>Sebaran Mustahik per Distrik</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pemetaan sebaran bantuan ZIS di 20 Distrik Boven Digoel</p>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-[#0c3514] text-[#004229] dark:text-[#ffe088] px-2.5 py-1 rounded-full font-bold border border-slate-200 dark:border-[#134d1e]">
                20 Distrik Aktif
              </span>
            </div>

            {/* Distrik Heatmap Badges Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {TOP_DISTRIK_DATA.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-[#0c3514] hover:bg-slate-100 dark:hover:bg-[#10441a] p-3 rounded-xl border border-slate-200/70 dark:border-[#134d1e] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.distrik}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {item.mustahik} KK
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 dark:bg-[#134d1e] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#075C3B] to-emerald-500 dark:from-emerald-500 dark:to-cyan-400 h-full rounded-full"
                      style={{ width: `${(item.nominal / 680) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Rp {item.nominal} Juta
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#0f4018] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Prioritas Distrik Terluar: <strong className="text-cyan-700 dark:text-cyan-400">Mindiptana, Waropko, Subur</strong></span>
            <Link href="/admin/bantuan" className="text-[#075C3B] dark:text-[#ffe088] font-bold hover:underline flex items-center gap-1">
              Kelola Mustahik <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bento Item 3: Donut Chart & Progress 5 Pilar BAZNAS (8 Kolom) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Realisasi per 5 Pilar BAZNAS</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pendistribusian dana ZIS berdasarkan pilar utama pembangunan</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              Total: Rp 2.300 M (93,8%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Donut Visualizer */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="16" className="dark:stroke-[#0c3514]" />
                
                {/* Segment 1: Cerdas (29.5%) */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="16" strokeDasharray="70.4 238.7" strokeDashoffset="0" />
                
                {/* Segment 2: Sehat (22.6%) */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="54.0 238.7" strokeDashoffset="-70.4" />
                
                {/* Segment 3: Peduli (19.5%) */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="46.5 238.7" strokeDashoffset="-124.4" />

                {/* Segment 4: Mandiri (18.3%) */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" strokeWidth="16" strokeDasharray="43.7 238.7" strokeDashoffset="-170.9" />

                {/* Segment 5: Taqwa (10.1%) */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ec4899" strokeWidth="16" strokeDasharray="24.1 238.7" strokeDashoffset="-214.6" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-playfair text-[#004229] dark:text-white">Rp 2,30 T</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Total Penyaluran</span>
              </div>
            </div>

            {/* Legend & Progress Bar Column */}
            <div className="md:col-span-7 space-y-3">
              {PILAR_PROGRAM_DATA.map((pilar, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pilar.color }} />
                      {pilar.label}
                    </span>
                    <span className="font-bold text-[#004229] dark:text-white">
                      Rp {pilar.realisasi} M <span className="text-slate-500 dark:text-slate-400 font-normal">({pilar.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0c3514] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pilar.percentage}%`, backgroundColor: pilar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Item 4: Top 10 Distrik Progress (4 Kolom) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm dark:shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-base font-bold text-[#004229] dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                <span>Top Distrik Realisasi</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Juta Rp</span>
            </div>

            <div className="space-y-2.5">
              {TOP_DISTRIK_DATA.slice(0, 5).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px]">
                      {idx + 1}. {item.distrik}
                    </span>
                    <span className="font-bold text-[#075C3B] dark:text-cyan-300">Rp {item.nominal} M</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0c3514] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#075C3B] to-emerald-400 dark:from-emerald-400 dark:to-cyan-400 rounded-full"
                      style={{ width: `${(item.nominal / 680) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/program"
            className="mt-4 pt-3 border-t border-slate-100 dark:border-[#0f4018] text-center text-xs text-[#075C3B] dark:text-[#ffe088] font-bold hover:underline block"
          >
            Lihat Seluruh Program Penyaluran &rarr;
          </Link>
        </div>

        {/* Bento Item 5: Indikator Strategis & Operasional (12 Kolom) */}
        <div className="lg:col-span-12 bg-white dark:bg-[#08240e] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200/80 dark:border-[#0f4018] shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#075C3B] dark:text-emerald-400" />
              <span>Indikator Strategis & Kepatuhan Operasional</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Status Kelembagaan BAZNAS Boven Digoel</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Indicator 1 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Audit KAP</span>
              <p className="text-lg font-bold text-[#075C3B] dark:text-emerald-400 font-playfair">WTP</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Laporan Auditan</span>
            </div>

            {/* Indicator 2 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Audit Syariah</span>
              <p className="text-lg font-bold text-[#075C3B] dark:text-emerald-400 font-playfair">100%</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Sesuai Syariat</span>
            </div>

            {/* Indicator 3 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pesan Masuk</span>
              <p className="text-lg font-bold text-amber-700 dark:text-[#ffe088] font-playfair">{counts.newMessagesCount} Baru</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{counts.totalMessagesCount} total pesan</span>
            </div>

            {/* Indicator 4 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Permohonan</span>
              <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400 font-playfair">{counts.newBantuanCount} Antrean</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{counts.approvedBantuanCount} disetujui</span>
            </div>

            {/* Indicator 5 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Konten Publik</span>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-400 font-playfair">{totalContent}</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Berita & Program</span>
            </div>

            {/* Indicator 6 */}
            <div className="bg-slate-50 dark:bg-[#0c3514] p-4 rounded-2xl border border-slate-200/80 dark:border-[#134d1e] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Transparansi</span>
              <p className="text-lg font-bold text-pink-700 dark:text-pink-400 font-playfair">{counts.docsCount} Doc</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Dokumen Terbit</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Filter Drawer / Panel (Right Slide-Over Modal - Adaptive Deep Dark Green) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#051808] text-slate-900 dark:text-white h-full border-l border-slate-200 dark:border-[#0f4018] p-6 flex flex-col justify-between shadow-2xl z-10 font-jakarta">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#0f4018] pb-4">
                <h3 className="font-playfair text-lg font-bold text-[#004229] dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#D4AF37]" />
                  <span>Filter Eksekutif</span>
                </h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c3514]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Form Controls */}
              <div className="space-y-4 text-xs">
                {/* Year Select */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Tahun Anggaran
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08240e] border border-slate-200 dark:border-[#0f4018] rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-[#075C3B] dark:focus:border-emerald-500"
                  >
                    <option value="2026">Tahun 2026</option>
                    <option value="2025">Tahun 2025</option>
                    <option value="2024">Tahun 2024</option>
                  </select>
                </div>

                {/* Distrik Select */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Wilayah Distrik
                  </label>
                  <select
                    value={selectedDistrik}
                    onChange={(e) => setSelectedDistrik(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08240e] border border-slate-200 dark:border-[#0f4018] rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-[#075C3B] dark:focus:border-emerald-500"
                  >
                    <option value="semua">Semua Distrik (20 Distrik)</option>
                    <option value="mandobo">Mandobo (Tanah Merah)</option>
                    <option value="jair">Jair (Getentiri)</option>
                    <option value="mindiptana">Mindiptana</option>
                    <option value="waropko">Waropko</option>
                    <option value="subur">Subur</option>
                    <option value="iniyandit">Iniyandit</option>
                  </select>
                </div>

                {/* Jenis Dana Select */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Jenis Dana ZIS
                  </label>
                  <select
                    value={selectedJenisDana}
                    onChange={(e) => setSelectedJenisDana(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08240e] border border-slate-200 dark:border-[#0f4018] rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-[#075C3B] dark:focus:border-emerald-500"
                  >
                    <option value="semua">Semua Jenis (Zakat & Infak)</option>
                    <option value="zakat_fitrah">Zakat Fitrah</option>
                    <option value="zakat_maal">Zakat Maal / Penghasilan</option>
                    <option value="infak_sedekah">Infak / Sedekah Terikat</option>
                    <option value="dskl">DSKL (Dana Sosial Keagamaan Lain)</option>
                  </select>
                </div>

                {/* Status Permohonan */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Status Permohonan
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08240e] border border-slate-200 dark:border-[#0f4018] rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-[#075C3B] dark:focus:border-emerald-500"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="new">Permohonan Baru</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#0f4018] flex items-center gap-3">
              <button
                onClick={handleResetFilter}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#0c3514] dark:hover:bg-[#10441a] dark:text-slate-300 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 bg-[#075C3B] hover:bg-[#004229] text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
