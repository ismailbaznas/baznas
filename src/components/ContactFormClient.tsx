// src/components/ContactFormClient.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Copy, 
  Check, 
  Send, 
  AlertTriangle, 
  CheckCircle2,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_BANK_ACCOUNTS = [
  { nama_bank: "BSI (Zakat)", nomor_rekening: "7123456789", atas_nama: "BAZNAS Boven Digoel" },
  { nama_bank: "BRI (Infak/Sedekah)", nomor_rekening: "012301004567890", atas_nama: "BAZNAS Boven Digoel" },
  { nama_bank: "Bank Papua (Kemanusiaan)", nomor_rekening: "1020201004567", atas_nama: "BAZNAS Boven Digoel" }
];

interface ContactFormClientProps {
  settings?: Record<string, string>;
  initialBankAccounts?: any[];
}

export default function ContactFormClient({ settings = {}, initialBankAccounts = [] }: ContactFormClientProps) {
  const contactAddress = settings.contact_address || "Jl. Trans Papua KM. 2, Tanah Merah, Kabupaten Boven Digoel, Papua Selatan";
  const contactPhone = settings.contact_phone || "+62 812 3456 7890";
  const contactEmail = settings.contact_email || "bovendigoel@baznas.go.id";
  const cleanPhoneForWa = contactPhone.replace(/[^0-9]/g, "");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subjectSelect: "",
    message: "",
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const displayAccounts = initialBankAccounts.length > 0 ? initialBankAccounts : DEFAULT_BANK_ACCOUNTS;

  const handleCopy = (num: string, index: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectSelect) {
      setResult({ type: "error", message: "Silakan pilih subjek pesan terlebih dahulu." });
      return;
    }

    setLoading(true);
    setResult(null);

    // Map selection to appropriate subject and type
    let type = "umum";
    let subject = "Kontak Umum";

    if (form.subjectSelect === "zakat") {
      type = "konsultasi";
      subject = "Konsultasi Zakat";
    } else if (form.subjectSelect === "program") {
      type = "umum";
      subject = "Informasi Program";
    } else if (form.subjectSelect === "partnership") {
      type = "umum";
      subject = "Kerja Sama / Kemitraan";
    } else if (form.subjectSelect === "pengaduan") {
      type = "pengaduan";
      subject = "Pengaduan Layanan";
    } else if (form.subjectSelect === "other") {
      type = "umum";
      subject = "Lainnya / Pertanyaan Umum";
    }

    const submissionData = {
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      subject: subject,
      message: form.message,
      type: type,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mengirim pesan.");
      }

      setResult({
        type: "success",
        message: data.message || "Pesan Anda berhasil terkirim dan akan segera diproses oleh tim kami.",
      });
      setForm({ name: "", email: "", phone: "", subjectSelect: "", message: "" });
    } catch (err: any) {
      setResult({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-surface-variant/30 dark:border-outline/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] dark:text-white leading-tight tracking-tight">
              Hubungi Kami
            </h1>
            <p className="font-jakarta text-base md:text-lg text-[#5B6470] dark:text-slate-300 leading-relaxed max-w-xl">
              Kami selalu hadir untuk melayani umat. Silakan hubungi kami untuk informasi seputar zakat, infak, sedekah, maupun program-program pemberdayaan BAZNAS Kabupaten Boven Digoel.
            </p>
          </div>
          <div className="h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 shadow-sm border border-surface-variant/40 dark:border-outline/10 flex items-center justify-center p-8 md:p-12 group hover:shadow-md transition-shadow duration-300">
            <Image 
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" 
              src="/images/logo-baznas.png" 
              alt="Logo Resmi BAZNAS Boven Digoel" 
              width={280}
              height={280}
              priority
            />
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 md:py-24 bg-[#F8F6F1] dark:bg-inverse-surface/40">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Info Left Column */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937] dark:text-white mb-8">
                  Informasi Kontak
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-surface-variant/60 dark:border-outline/20 flex items-center justify-center shrink-0 shadow-sm text-[#075C3B] dark:text-[#8cd6ac]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-jakarta text-xs font-bold text-[#5B6470] dark:text-slate-400 uppercase tracking-widest mb-1">
                        Alamat Kantor
                      </h3>
                      <p className="font-jakarta text-sm md:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                        {contactAddress}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-surface-variant/60 dark:border-outline/20 flex items-center justify-center shrink-0 shadow-sm text-[#075C3B] dark:text-[#8cd6ac]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-jakarta text-xs font-bold text-[#5B6470] dark:text-slate-400 uppercase tracking-widest mb-1">
                        Telepon / WhatsApp
                      </h3>
                      <p className="font-jakarta text-sm md:text-base text-[#1F2937] dark:text-slate-200 font-bold hover:underline">
                        <a href={`https://wa.me/${cleanPhoneForWa}`} target="_blank" rel="noopener noreferrer">
                          {contactPhone}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-surface-variant/60 dark:border-outline/20 flex items-center justify-center shrink-0 shadow-sm text-[#075C3B] dark:text-[#8cd6ac]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-jakarta text-xs font-bold text-[#5B6470] dark:text-slate-400 uppercase tracking-widest mb-1">
                        Email Resmi
                      </h3>
                      <p className="font-jakarta text-sm md:text-base text-[#1F2937] dark:text-slate-200 font-semibold hover:underline">
                        <a href={`mailto:${contactEmail}`}>
                          {contactEmail}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-surface-variant/60 dark:border-outline/20 flex items-center justify-center shrink-0 shadow-sm text-[#075C3B] dark:text-[#8cd6ac]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-jakarta text-xs font-bold text-[#5B6470] dark:text-slate-400 uppercase tracking-widest mb-1">
                        Jam Operasional
                      </h3>
                      <p className="font-jakarta text-sm md:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-medium">
                        Senin - Jumat: 08.00 - 16.00 WIT
                        <br />
                        Sabtu - Minggu: Tutup
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Accounts Block */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-[#075C3B] dark:text-[#8cd6ac]" />
                  <h3 className="font-playfair text-xl font-bold text-[#1F2937] dark:text-white">
                    Rekening Resmi
                  </h3>
                </div>
                
                <div className="space-y-5">
                  {displayAccounts.map((acc: any, index: number, arr: any[]) => (
                    <div 
                      key={acc.id || index} 
                      className={cn(
                        "flex justify-between items-center pb-4",
                        index !== arr.length - 1 ? "border-b border-surface-variant/50 dark:border-outline/10" : ""
                      )}
                    >
                      <div>
                        <p className="font-jakarta text-xs font-bold text-[#5B6470] dark:text-slate-400 mb-0.5">
                          {acc.nama_bank || acc.bank} {acc.kategori ? `(${acc.kategori})` : ""}
                        </p>
                        <p className="font-jakarta font-bold text-base md:text-lg text-[#1F2937] dark:text-white tracking-wide">
                          {(acc.nomor_rekening || acc.number || "").replace(/(\d{4})(?=\d)/g, '$1 ')}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          a.n. {acc.atas_nama || acc.holder || "BAZNAS Kabupaten Boven Digoel"}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleCopy(acc.nomor_rekening || acc.number, index)}
                        aria-label={`Salin nomor rekening ${acc.nama_bank || acc.bank}`}
                        className="text-[#075C3B] dark:text-[#8cd6ac] hover:text-[#004229] dark:hover:text-[#a8f3c7] font-jakarta text-xs font-bold flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#075C3B]/5 dark:bg-[#8cd6ac]/10 hover:bg-[#075C3B]/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] shrink-0 cursor-pointer"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Right Column */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-md">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937] dark:text-white mb-2">
                  Kirim Pesan
                </h2>
                <p className="font-jakarta text-sm text-[#5B6470] dark:text-slate-300 mb-8">
                  Silakan isi formulir di bawah ini, tim kami akan segera merespons pesan Anda.
                </p>

                {result && (
                  <div className={cn(
                    "p-4 rounded-xl mb-6 flex items-start space-x-3 border", 
                    result.type === "success" 
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300" 
                      : "bg-red-50/50 dark:bg-red-950/20 border-red-500/30 text-red-800 dark:text-red-300"
                  )}>
                    {result.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className="font-jakarta text-sm font-medium leading-relaxed">
                      {result.message}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="name">
                        Nama Lengkap *
                      </label>
                      <input 
                        className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none transition-colors dark:text-white" 
                        id="name" 
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda" 
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="phone">
                        Nomor Telepon / WA
                      </label>
                      <input 
                        className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none transition-colors dark:text-white" 
                        id="phone" 
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08xx xxxx xxxx" 
                        type="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                      Email (Opsional)
                    </label>
                    <input 
                      className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none transition-colors dark:text-white" 
                      id="email" 
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com" 
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="subjectSelect">
                      Subjek Pesan *
                    </label>
                    <select 
                      className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none transition-colors dark:text-white appearance-none" 
                      id="subjectSelect"
                      value={form.subjectSelect}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Subjek Pesan</option>
                      <option value="zakat">Konsultasi Zakat</option>
                      <option value="program">Informasi Program</option>
                      <option value="partnership">Kerja Sama / Kemitraan</option>
                      <option value="pengaduan">Pengaduan Layanan</option>
                      <option value="other">Lainnya / Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-bold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="message">
                      Pesan *
                    </label>
                    <textarea 
                      className="w-full rounded-lg border border-surface-variant/60 dark:border-outline/20 focus:border-[#004229] dark:focus:border-[#8cd6ac] focus:ring focus:ring-[#004229]/10 bg-white dark:bg-slate-800 px-4 py-3 font-jakarta text-sm outline-none transition-colors resize-none dark:text-white" 
                      id="message" 
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tuliskan pesan Anda secara detail..." 
                      rows={5}
                      required
                    />
                  </div>

                  <button 
                    className="w-full min-h-[48px] bg-[#075C3B] dark:bg-[#8cd6ac] hover:bg-[#004229] dark:hover:bg-[#a8f3c7] text-white dark:text-[#002112] rounded-xl px-6 py-4 font-jakarta font-bold text-sm flex items-center justify-center gap-2 shadow transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer" 
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? "Mengirim Pesan..." : "Kirim Pesan"}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full bg-surface-container relative overflow-hidden">
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIstclstn0X5ZLF0obcazSG_SF63fpCpyvc1Jz9ayjLS4Ep7ZucXItsQas6DMC5ErqGQfDH3ijBTOt6icPKBNCsOPmLQehqgGt8bzEuzLCArV-P1h8n8b9lE1PR0_w9kCYoUA677K-hN4P7BZBODLwzxqrguz1SpkrQiLRgYw-ASIhkPlrFPwIG5exS4AXrTHU4m6FKXuSZS_kl2vQVyixuUsC-dok3q8hh8K1mE0DFiIKXy4tSfv8"
          alt="Peta Lokasi Kantor BAZNAS Boven Digoel"
          fill
          sizes="100vw"
          className="object-cover filter grayscale contrast-[1.1] brightness-95"
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
          <a 
            href="https://maps.google.com/?q=BAZNAS+Kabupaten+Boven+Digoel+Tanah+Merah+Papua+Selatan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 border border-surface-variant dark:border-outline/10 text-primary dark:text-white font-jakarta font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            Buka Petunjuk Arah di Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}