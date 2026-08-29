import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  LifeBuoy, 
  Building2, 
  ArrowRight, 
  Sparkles,
  Inbox
} from "lucide-react";

interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  categories?: {
    name: string;
  } | null;
}

interface ProgramClientProps {
  programs: ProgramItem[];
  stats?: Record<string, { value: string; sub_label: string }>;
}

const FIVE_PILLARS = [
  {
    id: "sehat",
    name: "Boven Digoel Sehat",
    description: "Program bantuan kesehatan, pemenuhan gizi untuk balita stunting, penyediaan sanitasi yang layak, dan pendampingan medis bagi keluarga kurang mampu.",
    icon: HeartPulse,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-800"
  },
  {
    id: "cerdas",
    name: "Boven Digoel Cerdas",
    description: "Pemberian beasiswa pendidikan, penyediaan fasilitas belajar mengajar, dan program pemberantasan buta aksara untuk generasi penerus yang unggul.",
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-800"
  },
  {
    id: "mandiri",
    name: "Boven Digoel Mandiri",
    description: "Bantuan modal usaha mikro, pelatihan keterampilan kewirausahaan, dan pendampingan ekonomi produktif untuk melepaskan status mustahik menjadi muzaki.",
    icon: Briefcase,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-800"
  },
  {
    id: "peduli",
    name: "Boven Digoel Peduli",
    description: "Respon cepat tanggap bencana, bantuan biaya hidup dasar bagi kaum dhuafa, dan program renovasi rumah tidak layak huni (RTLH) di pedalaman.",
    icon: LifeBuoy,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-800"
  },
  {
    id: "taqwa",
    name: "Boven Digoel Taqwa",
    description: "Pembinaan rohani islam, dukungan operasional masjid/mushola di daerah 3T, kafalah da'i pedalaman, dan peningkatan pemahaman keagamaan.",
    icon: Building2,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-800"
  }
];

export default function ProgramClient({ programs, stats = {} }: ProgramClientProps) {
  const statDisalurkan = stats?.dana_disalurkan?.value || "Rp 2,30 Miliar";
  const statMustahik = stats?.mustahik_terlayani?.value || "4.850+";

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 max-w-[1320px] mx-auto px-6 md:px-12 bg-white dark:bg-slate-900 border-b border-surface-variant/40 dark:border-outline/10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 md:space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-[#075C3B]/5 dark:bg-[#8cd6ac]/10 px-4 py-1.5 rounded-full text-[#075C3B] dark:text-[#8cd6ac] font-jakarta text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Amanah & Profesional
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#004229] dark:text-white leading-[1.1] tracking-tight">
              Program <span className="text-[#D4AF37]">Unggulan</span>
            </h1>
            <p className="font-jakarta text-base md:text-lg text-[#5B6470] dark:text-slate-300 leading-relaxed max-w-2xl">
              Melalui pengelolaan dana zakat, infak, dan sedekah yang transparan dan profesional, kami berkomitmen untuk memberdayakan masyarakat Boven Digoel secara komprehensif, terukur, dan berkelanjutan, menyentuh setiap aspek kehidupan dasar demi kemandirian umat.
            </p>
            <div className="pt-2">
              <Link
                href="/kontak"
                className="bg-[#075C3B] text-white hover:bg-[#004229] dark:bg-[#8cd6ac] dark:text-[#002112] dark:hover:bg-[#a8f3c7] font-jakarta font-bold text-sm py-4 px-8 rounded-lg flex items-center gap-2 w-fit shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Tunaikan Zakat Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative flex-1 w-full h-[320px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-md border border-surface-variant/40 dark:border-outline/10">
            <Image 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1-sjXk628VXm-oM_9L5-NB0q01f-RjW6HCq_COfixm24JD4z0SSKftGZvfn0eK79FyNDjZCx9IbdpxJH8095WMhGGf1Oh5ohRvNqSJ75kSmpIs7n23tc-lRsjKTkdKkdnTBTU7hpWASWBjOTnh1ei7inorizhWqOEqLS8RFG0trQT4SRosVayHRiLY_JSSBzKFyQNY9gYlhdkQhqeuJHLxy4HU-b8mo2AnSi_JhDwguBc0IdWxH0A" 
              alt="Pemberdayaan Masyarakat Boven Digoel" 
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section className="py-16 md:py-24 max-w-[1320px] mx-auto px-6 md:px-12 bg-white dark:bg-slate-900/50 border-b border-surface-variant/40 dark:border-outline/10">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#004229] dark:text-white mb-4">
            5 Pilar Kebaikan
          </h2>
          <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Membangun ekosistem kesejahteraan yang menyeluruh untuk masyarakat Boven Digoel melalui program yang terstruktur, akuntabel, dan berdampak nyata.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FIVE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className={`p-8 rounded-2xl border border-surface-variant/60 dark:border-outline/20 transition-all duration-300 group flex flex-col h-full bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${pillar.bg}`}
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-surface-variant/40 dark:border-outline/10 group-hover:border-[#D4AF37] transition-colors">
                  <Icon className={`w-7 h-7 ${pillar.color}`} />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#004229] dark:text-white mb-3">
                  {pillar.name}
                </h3>
                <p className="font-jakarta text-sm text-[#5B6470] dark:text-slate-300 leading-relaxed flex-grow">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Programs Grid Section */}
      <section className="py-16 md:py-24 max-w-[1320px] mx-auto px-6 md:px-12 bg-background">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#004229] dark:text-white mb-4">
            Program Penyaluran ZIS Aktif
          </h2>
          <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Daftar program operasional dan pemberdayaan masyarakat yang sedang berjalan di bawah naungan BAZNAS Kabupaten Boven Digoel.
          </p>
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-variant/50 dark:border-outline/10 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full shadow-sm"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-surface-variant/50 flex items-center justify-center">
                  {item.image_url ? (
                    <Image
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-on-surface-variant opacity-40" />
                  )}
                  <div className="absolute top-3 left-3 bg-[#004229]/90 dark:bg-[#8cd6ac]/90 text-white dark:text-[#002112] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded font-jakarta">
                    {(item.categories as { name: string })?.name || "Umum"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow bg-surface-bright dark:bg-slate-900/20">
                  <Link href={`/program/${item.slug}`} className="block">
                    <h3 className="font-playfair text-xl font-bold text-[#004229] dark:text-white mb-3 group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="font-jakarta text-sm text-[#5B6470] dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {item.description || "Klik selengkapnya untuk mempelajari program pemberdayaan dan rincian penyaluran bantuan ini."}
                  </p>

                  <div className="pt-4 border-t border-surface-variant/50 dark:border-outline/10 mt-auto flex items-center justify-between">
                    <Link
                      className="inline-flex items-center gap-1.5 text-[#004229] dark:text-[#8cd6ac] font-jakarta text-xs font-bold group-hover:text-[#075C3B] transition-colors"
                      href={`/program/${item.slug}`}
                    >
                      Detail Program
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#f5f3ee] dark:bg-slate-900/30 rounded-2xl border border-dashed border-outline-variant/60 max-w-xl mx-auto">
            <Inbox className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-70" />
            <h3 className="font-playfair text-xl font-bold text-on-surface mb-2">Belum Ada Program</h3>
            <p className="font-jakarta text-sm text-on-surface-variant">
              Saat ini belum ada program tambahan yang dipublikasikan secara dinamis di database.
            </p>
          </div>
        )}
      </section>

      {/* Impact Highlights / Trust Strip */}
      <section className="py-16 md:py-20 max-w-[1320px] mx-auto px-6 md:px-12 bg-[#F8F6F1] dark:bg-inverse-surface/30 border-y border-surface-variant/50 dark:border-outline/10">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#004229] dark:text-white">
            Jejak Kebaikan Anda
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          <div className="px-4 space-y-1">
            <div className="font-playfair text-4xl md:text-5xl font-bold text-[#1F2937] dark:text-white">1.250+</div>
            <div className="font-jakarta text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">Penerima Beasiswa</div>
          </div>
          <div className="px-4 space-y-1 border-l border-surface-variant/60 dark:border-outline/20">
            <div className="font-playfair text-4xl md:text-5xl font-bold text-[#1F2937] dark:text-white">500+</div>
            <div className="font-jakarta text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">Keluarga Mandiri</div>
          </div>
          <div className="px-4 space-y-1 border-l border-surface-variant/60 dark:border-outline/20">
            <div className="font-playfair text-4xl md:text-5xl font-bold text-[#1F2937] dark:text-white">{statMustahik}</div>
            <div className="font-jakarta text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">Mustahik Terlayani</div>
          </div>
          <div className="px-4 space-y-1 border-l border-surface-variant/60 dark:border-outline/20">
            <div className="font-playfair text-4xl md:text-5xl font-bold text-[#1F2937] dark:text-white">{statDisalurkan}</div>
            <div className="font-jakarta text-xs font-bold uppercase tracking-wider text-[#5B6470] dark:text-slate-400">Dana Tersalurkan</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 max-w-[1320px] mx-auto text-center relative overflow-hidden rounded-2xl my-12 bg-[#004229] px-6 md:px-12 shadow-md">
        <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3hIUosc_GXcM6p6FbEJx09omdq1OpqVr4H0yLKSXZNfziNNoV-xveRddLrdRLRvhXoDfCV7bss6ByaxPVtrwTu651Fr9a_21scaQLKDFq9-eQmFHcXYEFhcQJyqFs-CavT62EM13ieUV1B93xTOInwlpdv-R-LO-0iMO5sxf9ONqtyVooZQ-2jvG50iml8k3YQnuupig36-gQS7FNKvCocK26NJHu1JlyWR-Xwz-4NLwLmVVfVAMc')" }} />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Bersama Membangun Kesejahteraan
          </h2>
          <p className="font-jakarta text-sm md:text-base text-slate-200 leading-relaxed">
            Setiap rupiah yang Anda tunaikan melalui BAZNAS turut andil dalam merajut asa dan menciptakan kemandirian bagi saudara kita di Boven Digoel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link 
              href="/kontak" 
              className="bg-[#D4AF37] text-[#1F2937] hover:bg-[#ffe088] transition-all font-jakarta font-bold text-sm py-4 px-8 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              Tunaikan Zakat Sekarang
            </Link>
            <Link 
              href="/transparansi" 
              className="bg-transparent border border-white text-white hover:bg-white/10 transition-colors font-jakarta font-bold text-sm py-4 px-8 rounded-lg text-center"
            >
              Pelajari Laporan Kami
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}