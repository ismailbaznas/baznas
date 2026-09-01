import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Coins,
  Users,
  HeartHandshake,
  Layers,
  HeartPulse,
  GraduationCap,
  Briefcase,
  LifeBuoy,
  Building2,
  CheckCircle2,
  FileCheck,
  Award,
  Eye,
  FileText,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface HomeClientProps {
  news: any[];
  programs: any[];
  settings?: Record<string, string>;
  transparencyStats?: Record<string, { label: string; value: string; sub_label: string }>;
  recentDocuments?: { id: string; title: string; document_url: string; type: string; year: number | null }[];
}

const DUMMY_NEWS = [
  {
    id: "dummy-news-1",
    title: "Rapat Koordinasi Program Kerja 2027",
    slug: "rapat-koordinasi-program-kerja-2027",
    published_at: "2026-05-15T08:00:00Z",
    thumbnail_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4NyW8KIwXGBh9j60kkDA-SNBT5CS6CuLDhEF8UN1pD3TAWvq8YAj_XmsYZwWk_gzlH434dGy1WI8A0T52ihoCCxU-_Lb7aUqjUeMW7tvr7DKV8Xi6pKnGJPOUOGrItiHEFODMcQda6mRMP5snvISzTZDedXAk0lKvZycikqJIDTx4hCWzyQSImayY4I0vWTaOp-ztHdtKAYF3gZSbcM5iZRsebevV5zceegfgPvwKQNYL7W4aNS8e",
    excerpt:
      "BAZNAS Boven Digoel mengadakan rapat koordinasi untuk merumuskan program kerja tahun 2027.",
  },
  {
    id: "dummy-news-2",
    title: "BAZNAS Salurkan Bantuan Logistik ke Distrik Terpencil",
    slug: "baznas-salurkan-bantuan-logistik-ke-distrik-terpencil",
    published_at: "2026-05-10T08:00:00Z",
    thumbnail_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHO8G9QlrKPXzNiZIuZEnR8C7cvUbnZNVsrx8V2V6VGPDzsxBMqujGBb71DE1FJwLGPB-Y7g2tRhRzu5eGpSkux5UDNwknLBS7ywf5FeNNh1juPdBghfXy0od47Jr02GSemn85bQTt4lPSRY97-g1YLBToNiL_cPy3LzjoNZ1kRIvybbK7McdDi47US1RNgaDJY5KfUCrxIKGi5gWkoHOB7AZjxGiGqezA1mEqrzqdd_ZEOmVLAp9h",
    excerpt:
      "Bantuan logistik disalurkan kepada masyarakat di wilayah sulit akses.",
  },
  {
    id: "dummy-news-3",
    title: "Beasiswa Cahaya Papua Untuk Masa Depan Anak-anak",
    slug: "beasiswa-cahaya-papua-untuk-masa-depan-anak-anak",
    published_at: "2026-05-05T08:00:00Z",
    thumbnail_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxMvj3gepEsL1w2prCAa0wd3LYviHeuvAes7M34rMrbwhNLF_tqdNncZ3f99bwKPR4S3rB56ywXMCiZTfCFGjWLxZWTzkHPKSCxVKOTnFygpSbetiLegWWlAbxcHsa44nvk_HnnvOi2mHd0aLBRQSDXH6h6b60jyIgHTq4Rv6KvPOWKh8leayNaOzGP7H8WesW6ZcZFa4C-7zNOjZ1HzO0IiLLIFNubWX4YHz8hKFGIXrhVM8rrPIz",
    excerpt:
      "Program beasiswa untuk mendukung pendidikan anak-anak yatim dan dhuafa.",
  },
];

const FIVE_PILLARS = [
  {
    id: "sehat",
    name: "Boven Digoel Sehat",
    description: "Bantuan kesehatan dan gizi masyarakat.",
    icon: HeartPulse,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
  },
  {
    id: "cerdas",
    name: "Boven Digoel Cerdas",
    description: "Beasiswa dan dukungan pendidikan.",
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    id: "mandiri",
    name: "Boven Digoel Mandiri",
    description: "Pemberdayaan ekonomi masyarakat.",
    icon: Briefcase,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    id: "peduli",
    name: "Boven Digoel Peduli",
    description: "Bantuan sosial dan kebencanaan.",
    icon: LifeBuoy,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    id: "taqwa",
    name: "Boven Digoel Taqwa",
    description: "Pembinaan keagamaan dan dakwah.",
    icon: Building2,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40",
  },
];

export default function HomeClient({ news = [], programs = [], settings = {}, transparencyStats, recentDocuments = [] }: HomeClientProps) {
  // Extract customizable settings with fallback to premium design copy
  const heroTitle = settings.home_hero_title || "Menguatkan Masyarakat Boven Digoel";
  const heroSubtitle = settings.home_hero_subtitle || "Mengelola zakat, infak, dan sedekah secara amanah, transparan, dan profesional demi mewujudkan kemandirian umat.";
  const heroImageUrl = settings.home_hero_imageurl || "";
  
  const DEFAULT_HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCE7AITlJavGzXeLho_uZfAaro35bs4dCenUsyZcsTfO6Z28FXZWDfSzzc8eWtAu05FZrB1_lX0YEoy2M0iXxCrVYlzVBcHZEF_lsHM8Sm9XCteKOWx-fQtXERH0o7orQVBfTNP3NigvXUs4fjxZ1Y-Ri-BgZ7pv2KzhNjQOwy5eEJJ4CDozWTmY9EG5Fft5eB7Zw1tgKyO4Sh_ep9LrkRJ7pxwzL1JIAMMel6QYUmQfygh_zkhDTLb";
  
  const statZis = transparencyStats?.dana_dihimpun?.value || "Rp 2,4 Miliar";
  const statMuzaki = settings.home_stat_muzaki || "1.250+";
  const statMustahik = transparencyStats?.mustahik_terlayani?.value || "4.800+";
  const statProgram = settings.home_stat_program || "12 Program";

  // Success story dynamic loading - all from site_settings
  const story = {
    url_foto: settings.story_imageurl || '',
    badge_kategori: settings.story_badge || '',
    title: settings.story_tittle || '',
    author_info: settings.story_author || '',
    quote: settings.story_quote || '',
    metric: settings.story_metric || '',
    metric_label: settings.story_metric_label || '',
    is_active: settings.story_is_active !== 'false'
  };
  const hasStory = story.is_active && Boolean(story.title && story.quote);

  // Use database news if available, otherwise fallback to target dummy news
  const displayNews = news.length > 0
    ? news.slice(0, 3).map((item, idx) => ({
        ...item,
        thumbnail_url: item.thumbnail_url || DUMMY_NEWS[idx % DUMMY_NEWS.length].thumbnail_url,
        excerpt: item.description || DUMMY_NEWS[idx % DUMMY_NEWS.length].excerpt,
      }))
    : DUMMY_NEWS;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "15 Mei 2026";
    }
  };

  return (
    <div className="w-full font-jakarta">
      {/* 01 — HERO SECTION */}
      <header className="relative w-full h-[600px] md:h-[680px] bg-[#1F2937] overflow-hidden flex items-center">
        {/* Hero Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl || DEFAULT_HERO_IMAGE}
            alt="BAZNAS Kabupaten Boven Digoel"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60 scale-105 transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937] via-[#1F2937]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 w-full text-white grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 lg:col-span-7 flex flex-col justify-center">
            <span className="text-[#ffe088] text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 block">
              Zakat Anda, Amanah Kami.
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05]">
              {heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-8 max-w-xl font-normal leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/layanan"
                className="bg-[#075C3B] hover:bg-[#004229] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Tunaikan Zakat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/transparansi"
                className="border border-white/80 hover:border-white text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span>Lihat Transparansi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — TRUST STRIP (STATISTICS) */}
      <section className="relative z-20 max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 -mt-14 sm:-mt-16 mb-16 lg:mb-24">
        <div className="bg-[#075C3B] rounded-xl shadow-xl border border-white/10 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {/* Stat 1 */}
          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#ffe088] shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="font-playfair text-2xl lg:text-3xl font-bold text-white mb-0.5">
                {statZis}
              </div>
              <div className="text-xs text-white/80 font-medium">
                {transparencyStats?.dana_dihimpun?.label || "Dana Dihimpun"}
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#ffe088] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="font-playfair text-2xl lg:text-3xl font-bold text-white mb-0.5">
                {statMuzaki}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Muzaki Terpercaya
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#ffe088] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="font-playfair text-2xl lg:text-3xl font-bold text-white mb-0.5">
                {statMustahik}
              </div>
              <div className="text-xs text-white/80 font-medium">
                {transparencyStats?.mustahik_terlayani?.label || "Mustahik Terlayani"}
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#ffe088] shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="font-playfair text-2xl lg:text-3xl font-bold text-white mb-0.5">
                {statProgram}
              </div>
              <div className="text-xs text-white/80 font-medium">
                Program Berjalan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — 5 PILAR PENYALURAN */}
      <section className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 text-center pt-4 pb-20">
        <span className="text-[#5B6470] dark:text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 block">
          KE MANA ZAKAT ANDA DISALURKAN?
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] dark:text-white mb-12">
          5 Pilar Penyaluran
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {FIVE_PILLARS.map((pilar) => {
            const Icon = pilar.icon;
            return (
              <div
                key={pilar.id}
                className="bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-7 hover:border-[#075C3B] dark:hover:border-[#8cd6ac] hover:shadow-md transition-all group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#075C3B]/10 dark:bg-[#075C3B]/25 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#075C3B] transition-all">
                  <Icon className="w-7 h-7 text-[#075C3B] dark:text-[#8cd6ac] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#1F2937] dark:text-white mb-2.5 group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors">
                  {pilar.name}
                </h3>
                <p className="text-xs text-[#5B6470] dark:text-zinc-400 leading-relaxed">
                  {pilar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/program"
            className="inline-flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 text-[#1F2937] dark:text-zinc-200 text-sm font-semibold px-6 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-[#075C3B] transition-all"
          >
            <span>Lihat Semua Program</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 04 — TRANSPARANSI & AMANAH */}
      <section className="bg-[#F8F6F1] dark:bg-zinc-900/60 border-y border-zinc-200 dark:border-zinc-800/80 py-16 sm:py-20">
        <div className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (60%) */}
          <div className="lg:col-span-7">
            <span className="text-[#5B6470] dark:text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 block">
              AMANAH YANG DAPAT DILIHAT
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] dark:text-white mb-10">
              Transparansi adalah Amanah
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 animate-fadeIn">
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700/80 text-center shadow-sm">
                <div className="text-xs text-[#5B6470] dark:text-zinc-400 mb-2 font-medium">
                  Dana Dihimpun
                </div>
                <div className="font-playfair text-2xl font-bold text-primary dark:text-white mb-1">
                  {transparencyStats?.dana_dihimpun?.value || "Rp 2,45 Miliar"}
                </div>
                <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                  {transparencyStats?.dana_dihimpun?.sub_label || "Tahun 2026"}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700/80 text-center shadow-sm">
                <div className="text-xs text-[#5B6470] dark:text-zinc-400 mb-2 font-medium">
                  Dana Disalurkan
                </div>
                <div className="font-playfair text-2xl font-bold text-primary dark:text-white mb-1">
                  {transparencyStats?.dana_disalurkan?.value || "Rp 2,30 Miliar"}
                </div>
                <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                  {transparencyStats?.dana_disalurkan?.sub_label || "Tahun 2026"}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700/80 text-center shadow-sm">
                <div className="text-xs text-[#5B6470] dark:text-zinc-400 mb-2 font-medium">
                  Mustahik Terlayani
                </div>
                <div className="font-playfair text-2xl font-bold text-primary dark:text-white mb-1">
                  {transparencyStats?.mustahik_terlayani?.value || "4.850 Jiwa"}
                </div>
                <div className="text-[11px] text-[#5B6470] dark:text-zinc-400">
                  {transparencyStats?.mustahik_terlayani?.sub_label || "Tahun 2026"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-[#075C3B] dark:text-[#8cd6ac] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                <span>Diaudit Syariah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                <span>Akuntabel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                <span>Profesional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                <span>Transparan</span>
              </div>
            </div>
          </div>

          {/* Right Column (40%) - Report Panel */}
          <div className="lg:col-span-5 lg:pl-4 mt-6 lg:mt-0">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-700/80 shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-[#1F2937] dark:text-white mb-6">
                Laporan Pengelolaan ZIS
              </h3>

              <div className="space-y-3.5 mb-6">
                {recentDocuments.length > 0 ? (
                  recentDocuments.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.document_url || "/transparansi"}
                      target={doc.document_url ? "_blank" : undefined}
                      rel={doc.document_url ? "noopener noreferrer" : undefined}
                      className="flex items-center justify-between p-3.5 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-[#F8F6F1] dark:hover:bg-zinc-700/50 transition-colors group"
                    >
                      <span className="text-sm font-medium text-[#1F2937] dark:text-zinc-200 group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors line-clamp-1">
                        {doc.title}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac] bg-[#075C3B]/10 dark:bg-[#075C3B]/20 px-2.5 py-1 rounded shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </span>
                    </a>
                  ))
                ) : (
                  [
                    "Laporan Semester I 2026",
                    "Laporan Semester II 2026",
                    "Laporan Tahunan 2026",
                  ].map((docName, index) => (
                    <Link
                      key={index}
                      href="/transparansi"
                      className="flex items-center justify-between p-3.5 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-[#F8F6F1] dark:hover:bg-zinc-700/50 transition-colors group"
                    >
                      <span className="text-sm font-medium text-[#1F2937] dark:text-zinc-200 group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors">
                        {docName}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac] bg-[#075C3B]/10 dark:bg-[#075C3B]/20 px-2.5 py-1 rounded">
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </span>
                    </Link>
                  ))
                )}
              </div>

              <Link
                href="/transparansi"
                className="w-full bg-[#075C3B] hover:bg-[#004229] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Lihat Semua Laporan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — IMPACT / HUMAN STORY */}
      {hasStory && (
        <section className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8">
            {story.url_foto && (
              <div className="lg:w-[55%] min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] relative rounded-xl overflow-hidden shadow-inner bg-slate-100 dark:bg-zinc-800">
                <Image
                  src={story.url_foto}
                  alt={story.title || "Kisah Inspiratif Mustahik"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className={`${story.url_foto ? 'lg:w-[45%]' : 'w-full'} py-4 sm:py-8 flex flex-col justify-center`}>
              {story.badge_kategori && (
                <span className="text-[#5B6470] dark:text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 block">
                  {story.badge_kategori}
                </span>
              )}
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white mb-3 leading-tight">
                {story.title}
              </h2>
              {story.author_info && (
                <p className="text-xs font-bold text-[#D4AF37] dark:text-[#ffe088] uppercase tracking-wider mb-4">
                  {story.author_info}
                </p>
              )}
              <p className="text-sm sm:text-base text-[#5B6470] dark:text-zinc-300 mb-6 italic leading-relaxed">
                "{story.quote}"
              </p>
              {(story.metric || story.metric_label) && (
                <div className="flex items-center gap-4 mb-8 bg-[#075C3B]/5 dark:bg-[#8cd6ac]/5 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 w-fit">
                   {story.metric && (
                    <div className="font-playfair text-3xl font-extrabold text-primary dark:text-white shrink-0">
                      {story.metric}
                    </div>
                  )}
                  {story.metric_label && (
                    <div className="text-xs font-bold font-jakarta text-[#5B6470] dark:text-zinc-400 uppercase tracking-wide leading-tight">
                      {story.metric_label}
                    </div>
                  )}
                </div>
              )}
              <div>
                <Link
                  href="/program"
                  className="bg-[#075C3B] hover:bg-[#004229] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Jelajahi Program Kami</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 06 — KABAR BAZNAS */}
      <section className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[#5B6470] dark:text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2 block">
              INFORMASI & ARTIKEL
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary dark:text-white">
              Kabar BAZNAS
            </h2>
          </div>
          <Link
            href="/kabar"
            className="text-primary dark:text-[#ffe088] text-sm font-bold hover:underline flex items-center gap-1 group"
          >
            <span>Lihat Semua Kabar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((item) => (
            <Link
              key={item.id}
              href={`/kabar/${item.slug || item.id}`}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#5B6470] dark:text-zinc-400 mb-2.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.published_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400" />
                    <span className="text-[#075C3B] dark:text-[#8cd6ac] font-semibold">
                      Kabar
                    </span>
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937] dark:text-white mb-2 group-hover:text-[#075C3B] dark:group-hover:text-[#8cd6ac] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5B6470] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.excerpt || "Klik untuk membaca selengkapnya mengenai kabar terkini BAZNAS Boven Digoel."}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs font-semibold text-[#075C3B] dark:text-[#8cd6ac]">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 07 — FOOTER CTA BANNER */}
      <section className="bg-[#075C3B] text-white py-12 border-b border-white/10">
        <div className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="md:w-1/2 text-center md:text-left">
            <span className="text-[#ffe088] text-xs font-bold tracking-widest uppercase mb-2 block">
              MARI TUNAIKAN ZAKAT
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-2">
              Salurkan Zakat Anda,<br className="hidden sm:inline" />
              Hadirkan Manfaat Nyata
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col sm:flex-row gap-4 justify-end w-full sm:w-auto">
            <Link
              href="/layanan"
              className="bg-[#D4AF37] hover:bg-[#e9c349] text-[#241a00] font-bold text-sm px-7 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>Tunaikan Zakat Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontak"
              className="border border-white/40 text-white font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi Zakat</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}