"use client";

import React, { useState } from "react";
import { 
  HeartHandshake, 
  Coins, 
  Calculator, 
  FileText, 
  PhoneCall, 
  Check, 
  Send, 
  HelpCircle,
  TrendingUp,
  Inbox,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LayananClient() {
  const [calculatorTab, setCalculatorTab] = useState<"penghasilan" | "maal">("penghasilan");
  const [income, setFormIncome] = useState("");
  const [otherIncome, setFormOtherIncome] = useState("");
  const [maalWealth, setMaalWealth] = useState("");
  const [calculatedZakat, setCalculatedZakat] = useState<number | null>(null);
  const [nisabPassed, setNisabPassed] = useState<boolean | null>(null);

  // Mustahik form state
  const [mustahikForm, setMustahikForm] = useState({
    name: "",
    nik: "",
    district: "",
    phone: "",
    category: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Zakat Penghasilan Nisab 2026: 85 gram emas per tahun. 
  // Jika asumsi emas Rp 1.100.000 / gram, maka Nisab tahunan = Rp 93.500.000 (bulanan = Rp 7.791.666)
  const MONTHLY_NISAB = 7791666;

  const calculateIncomeZakat = (e: React.FormEvent) => {
    e.preventDefault();
    const incVal = parseFloat(income) || 0;
    const othVal = parseFloat(otherIncome) || 0;
    const total = incVal + othVal;

    if (total >= MONTHLY_NISAB) {
      setCalculatedZakat(total * 0.025);
      setNisabPassed(true);
    } else {
      setCalculatedZakat(0);
      setNisabPassed(false);
    }
  };

  const calculateMaalZakat = (e: React.FormEvent) => {
    e.preventDefault();
    const wealth = parseFloat(maalWealth) || 0;
    // Nisab Maal tahunan: 85 gram emas (~ Rp 93.500.000)
    const MAAL_NISAB = 93500000;

    if (wealth >= MAAL_NISAB) {
      setCalculatedZakat(wealth * 0.025);
      setNisabPassed(true);
    } else {
      setCalculatedZakat(0);
      setNisabPassed(false);
    }
  };

  const handleMustahikSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(false);
    setFormError(null);

    try {
      const response = await fetch("/api/mustahik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mustahikForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mengirim pengajuan bantuan.");
      }

      setFormSuccess(true);
      setMustahikForm({
        name: "",
        nik: "",
        district: "",
        phone: "",
        category: "",
        notes: ""
      });
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Gagal menghubungi server BAZNAS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMustahikChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setMustahikForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-white dark:bg-slate-900 border-b border-surface-variant/40 dark:border-outline/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#075c3b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center space-y-6">
          <div className="inline-flex items-center justify-center p-3.5 bg-[#075C3B]/5 dark:bg-[#8cd6ac]/10 rounded-full text-[#075C3B] dark:text-[#8cd6ac]">
            <HeartHandshake className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#004229] dark:text-white tracking-tight max-w-4xl leading-tight">
            Layanan BAZNAS
          </h1>
          <p className="font-jakarta text-base md:text-lg text-[#5B6470] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Kemudahan akses layanan hitung zakat untuk para muzaki dan pengajuan bantuan sosial bagi mustahik di wilayah Kabupaten Boven Digoel.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a 
              href="#kalkulator"
              className="bg-[#075C3B] text-white hover:bg-[#004229] dark:bg-[#8cd6ac] dark:text-[#002112] dark:hover:bg-[#a8f3c7] font-jakarta font-bold text-sm py-4 px-8 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Calculator className="w-4 h-4" />
              Hitung Zakat Anda
            </a>
            <a 
              href="#bantuan"
              className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1F2937] dark:text-white border border-surface-variant dark:border-outline/20 font-jakarta font-bold text-sm py-4 px-8 rounded-lg shadow-sm transition-colors text-center"
            >
              Pengajuan Bantuan Mustahik
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid (Summary) */}
      <section className="py-16 md:py-20 max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Layanan Muzaki",
              desc: "Konsultasi perhitungan zakat penghasilan, zakat maal, infak, sedekah, serta kemudahan transfer ke rekening resmi bank milik BAZNAS.",
              icon: Coins,
              action: "Hitung Zakat",
              link: "#kalkulator"
            },
            {
              title: "Layanan Mustahik",
              desc: "Formulir pendaftaran permohonan bantuan sosial darurat, beasiswa pendidikan, modal usaha mikro, bantuan kesehatan, dan renovasi rumah.",
              icon: ClipboardCheck,
              action: "Ajukan Bantuan",
              link: "#bantuan"
            },
            {
              title: "Layanan Konsultasi",
              desc: "Butuh penjelasan lebih lanjut? Tim amil zakat kami siap menjawab pertanyaan Anda secara responsif via chat WhatsApp resmi.",
              icon: PhoneCall,
              action: "Hubungi Amil WA",
              link: "https://wa.me/6281234567890"
            }
          ].map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-surface-variant/50 dark:border-outline/10 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-[#004229]/5 dark:bg-[#8cd6ac]/10 flex items-center justify-center text-[#075C3B] dark:text-[#8cd6ac]">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-playfair text-2xl font-bold text-[#004229] dark:text-white">
                      {service.title}
                    </h3>
                    <p className="font-jakarta text-sm text-[#5B6470] dark:text-slate-300 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-surface-variant/40 dark:border-outline/10 mt-6">
                  <a 
                    href={service.link}
                    target={service.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075C3B] dark:text-[#8cd6ac] uppercase tracking-wider font-jakarta hover:underline"
                  >
                    {service.action}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kalkulator Zakat (Interactive - Full Dummy) */}
      <section id="kalkulator" className="py-16 md:py-24 bg-[#F8F6F1] dark:bg-inverse-surface/30 border-y border-surface-variant/40 dark:border-outline/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Rules & Explanation (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-[#004229] dark:text-white">
              Kalkulator Zakat
            </h2>
            <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 leading-relaxed">
              Zakat adalah kewajiban finansial bagi setiap muslim yang telah memenuhi batas kecukupan (Nisab) dan batas waktu kepemilikan (Haul). Gunakan kalkulator interaktif ini untuk menghitung kewajiban zakat Anda.
            </p>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-surface-variant/40 dark:border-outline/10 space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-jakarta text-sm font-bold text-[#1F2937] dark:text-white mb-1">Ketentuan Nisab 2026</h4>
                  <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-400 leading-relaxed">
                    Nisab Zakat disetarakan dengan harga **85 gram emas** murni. 
                    <br />
                    * **Zakat Penghasilan:** Nisab bulanan setara Rp {MONTHLY_NISAB.toLocaleString("id-ID")}. Jika penghitungan total pendapatan bulanan Anda berada di atas nilai ini, wajib menunaikan zakat sebesar 2,5%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculator Widget (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-md">
            
            {/* Tabs */}
            <div className="flex border-b border-surface-variant/50 dark:border-outline/10 mb-8">
              <button 
                onClick={() => {
                  setCalculatorTab("penghasilan");
                  setCalculatedZakat(null);
                }}
                className={cn(
                  "flex-1 pb-4 text-center font-jakarta text-sm font-bold transition-colors border-b-2",
                  calculatorTab === "penghasilan" 
                    ? "border-[#004229] text-[#004229] dark:border-[#8cd6ac] dark:text-[#8cd6ac]" 
                    : "border-transparent text-[#5B6470] dark:text-slate-400 hover:text-[#004229]"
                )}
              >
                Zakat Penghasilan
              </button>
              <button 
                onClick={() => {
                  setCalculatorTab("maal");
                  setCalculatedZakat(null);
                }}
                className={cn(
                  "flex-1 pb-4 text-center font-jakarta text-sm font-bold transition-colors border-b-2",
                  calculatorTab === "maal" 
                    ? "border-[#004229] text-[#004229] dark:border-[#8cd6ac] dark:text-[#8cd6ac]" 
                    : "border-transparent text-[#5B6470] dark:text-slate-400 hover:text-[#004229]"
                )}
              >
                Zakat Maal (Harta)
              </button>
            </div>

            {/* Income Calculator Form */}
            {calculatorTab === "penghasilan" ? (
              <form onSubmit={calculateIncomeZakat} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="income">
                      Pendapatan Bulanan *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-jakarta text-sm text-[#5B6470] dark:text-slate-400 font-semibold">Rp</span>
                      <input 
                        type="number" 
                        id="income" 
                        value={income}
                        onChange={(e) => setFormIncome(e.target.value)}
                        required
                        placeholder="7.500.000"
                        className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="otherIncome">
                      Pendapatan Lainnya (Bonus/THR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-jakarta text-sm text-[#5B6470] dark:text-slate-400 font-semibold">Rp</span>
                      <input 
                        type="number" 
                        id="otherIncome" 
                        value={otherIncome}
                        onChange={(e) => setFormOtherIncome(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#075C3B] dark:bg-[#8cd6ac] hover:bg-[#004229] dark:hover:bg-[#a8f3c7] text-white dark:text-[#002112] rounded-lg px-6 py-4 font-jakarta font-bold text-sm flex items-center justify-center gap-2 shadow"
                >
                  Hitung Zakat Penghasilan
                </button>
              </form>
            ) : (
              // Maal Calculator Form
              <form onSubmit={calculateMaalZakat} className="space-y-6">
                <div>
                  <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="maalWealth">
                    Total Nilai Harta (Uang/Emas/Saham) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-jakarta text-sm text-[#5B6470] dark:text-slate-400 font-semibold">Rp</span>
                    <input 
                      type="number" 
                      id="maalWealth" 
                      value={maalWealth}
                      onChange={(e) => setMaalWealth(e.target.value)}
                      required
                      placeholder="100.000.000"
                      className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#075C3B] dark:bg-[#8cd6ac] hover:bg-[#004229] dark:hover:bg-[#a8f3c7] text-white dark:text-[#002112] rounded-lg px-6 py-4 font-jakarta font-bold text-sm flex items-center justify-center gap-2 shadow"
                >
                  Hitung Zakat Maal
                </button>
              </form>
            )}

            {/* Calculation Result */}
            {calculatedZakat !== null && (
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 border border-surface-variant/50 dark:border-outline/10 rounded-xl space-y-4">
                {nisabPassed ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-jakarta text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      Wajib Menunaikan Zakat
                    </div>
                    <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-300">
                      Total kekayaan/pendapatan Anda telah melampaui batas Nisab. Kewajiban zakat Anda (2.5%) adalah:
                    </p>
                    <div className="font-playfair text-3xl font-bold text-primary dark:text-[#ffe088] pt-2">
                      Rp {calculatedZakat.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold font-jakarta text-sm">
                      <HelpCircle className="w-5 h-5" />
                      Belum Wajib Zakat (Dianjurkan Infak/Sedekah)
                    </div>
                    <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-300 leading-relaxed">
                      Pendapatan atau nilai aset Anda berada di bawah batas Nisab tahun berjalan. Anda belum memiliki kewajiban zakat, tetapi sangat dianjurkan untuk menyempurnakan kebaikan dengan menyisihkan Infak atau Sedekah sukarela guna kemaslahatan sesama.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Formulir Pengajuan Bantuan Mustahik (Full Dummy Form) */}
      <section id="bantuan" className="py-16 md:py-24 max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-md">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#004229] dark:text-white mb-2">
              Formulir Pengajuan Bantuan
            </h3>
            <p className="font-jakarta text-sm text-[#5B6470] dark:text-slate-300 mb-8">
              Pendaftaran permohonan santunan atau bantuan untuk mustahik/kaum dhuafa di wilayah Boven Digoel.
            </p>

            {formSuccess && (
              <div className="p-4 rounded-xl mb-6 flex items-start space-x-3 border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-jakarta text-sm font-bold mb-1">Permohonan Berhasil Terkirim!</p>
                  <p className="font-jakarta text-xs leading-relaxed">
                    Data permohonan bantuan Anda telah terdaftar secara resmi di database BAZNAS Boven Digoel. Tim amil kami akan segera memverifikasi kelengkapan berkas fisik Anda. Silakan bawa fotokopi berkas fisik Anda ke kantor terdekat.
                  </p>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-4 rounded-xl mb-6 flex items-start space-x-3 border bg-red-50/50 dark:bg-red-950/20 border-red-500/30 text-red-800 dark:text-red-300">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-jakarta text-sm font-bold mb-1">Gagal Mengirim Permohonan</p>
                  <p className="font-jakarta text-xs leading-relaxed">
                    {formError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleMustahikSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="name">
                    Nama Lengkap Mustahik *
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    value={mustahikForm.name}
                    onChange={handleMustahikChange}
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="nik">
                    Nomor NIK KTP *
                  </label>
                  <input 
                    type="text" 
                    id="nik" 
                    value={mustahikForm.nik}
                    onChange={handleMustahikChange}
                    required
                    maxLength={16}
                    placeholder="9104xxxxxxxxxxxx"
                    className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="district">
                    Distrik / Domisili *
                  </label>
                  <input 
                    type="text" 
                    id="district" 
                    value={mustahikForm.district}
                    onChange={handleMustahikChange}
                    required
                    placeholder="Contoh: Mindiptana"
                    className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="phone">
                    Nomor Telepon / HP *
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={mustahikForm.phone}
                    onChange={handleMustahikChange}
                    required
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="category">
                  Kategori Program Bantuan *
                </label>
                <select 
                  id="category"
                  value={mustahikForm.category}
                  onChange={handleMustahikChange}
                  required
                  className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none dark:text-white appearance-none"
                >
                  <option value="">Pilih Kategori Bantuan</option>
                  <option value="kesehatan">Kesehatan (Bantuan Medis / Gizi)</option>
                  <option value="pendidikan">Pendidikan (Beasiswa Sekolah / Santri)</option>
                  <option value="ekonomi">Ekonomi (Modal Usaha / UMKM)</option>
                  <option value="sosial">Sosial / Kemanusiaan (Renovasi Rumah / Lansia)</option>
                  <option value="keagamaan">Dakwah / Keagamaan (Bantuan Masjid / Mushola)</option>
                </select>
              </div>

              <div>
                <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="notes">
                  Uraian Singkat Alasan Pengajuan Bantuan *
                </label>
                <textarea 
                  id="notes" 
                  value={mustahikForm.notes}
                  onChange={handleMustahikChange}
                  required
                  placeholder="Deskripsikan kondisi keuangan dan tujuan penggunaan dana bantuan yang dimohonkan..."
                  rows={4}
                  className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none resize-none dark:text-white"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#075C3B] dark:bg-[#8cd6ac] hover:bg-[#004229] dark:hover:bg-[#a8f3c7] text-white dark:text-[#002112] rounded-lg px-6 py-4 font-jakarta font-bold text-sm flex items-center justify-center gap-2 shadow active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isSubmitting ? "Mengirim Permohonan..." : "Kirim Permohonan Bantuan"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Steps & Documents Needed (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-playfair text-3xl font-bold text-[#004229] dark:text-white">
              Alur & Persyaratan
            </h2>
            
            <div className="space-y-6">
              {[
                { title: "Isi Formulir Online", desc: "Isi data diri, NIK KTP, distrik, dan berikan keterangan permohonan singkat di formulir ini." },
                { title: "Lengkapi Berkas Fisik", desc: "Siapkan fotokopi KTP, Kartu Keluarga (KK), Surat Keterangan Tidak Mampu (SKTM) dari kelurahan, dan proposal/surat permohonan." },
                { title: "Verifikasi Berkas & Survei", desc: "Kunjungi kantor BAZNAS Boven Digoel di Tanah Merah untuk menyerahkan berkas. Tim amil kami akan melakukan survei kelayakan." }
              ].map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#004229]/10 dark:bg-emerald-500/20 text-primary dark:text-[#ffe088] flex items-center justify-center font-bold font-jakarta text-sm mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-jakarta text-sm font-bold text-[#1F2937] dark:text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#F8F6F1] dark:bg-slate-900 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-primary dark:text-[#ffe088]">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-jakarta text-sm font-bold text-[#1F2937] dark:text-white">Dokumen Wajib</h4>
              </div>
              <ul className="space-y-2 font-jakarta text-xs text-[#5B6470] dark:text-slate-400 list-disc pl-5">
                <li>Fotokopi KTP & Kartu Keluarga (KK)</li>
                <li>Surat Keterangan Tidak Mampu (SKTM) Asli</li>
                <li>Surat Permohonan / Rekomendasi Pengurus Masjid</li>
                <li>Rekomendasi Medis (Khusus Pengajuan Kesehatan)</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}