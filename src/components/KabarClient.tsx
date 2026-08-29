"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Calendar, 
  ArrowRight, 
  ChevronDown, 
  Newspaper, 
  BookOpen, 
  Award, 
  Bell, 
  CheckCircle2, 
  Inbox 
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  thumbnail_url: string | null;
  content: string;
  category_name?: string;
  categories?: {
    name: string;
  } | null;
}

interface KabarClientProps {
  initialNews: NewsItem[];
}

const FILTERS = ["Semua", "Berita", "Artikel", "Penyaluran", "Pengumuman"];

export default function KabarClient({ initialNews }: KabarClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(6);

  // Helper to extract category name from item
  const getCategoryName = (item: NewsItem): string => {
    if (item.category_name) return item.category_name;
    if (item.categories && item.categories.name) return item.categories.name;
    return "Umum";
  };

  // Helper to clean HTML content to show a plain text excerpt
  const getExcerpt = (htmlContent: string, maxLength = 160): string => {
    if (!htmlContent) return "";
    const cleanText = htmlContent.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML tags
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + "...";
  };

  // Process and sort database news
  const allNews = useMemo(() => {
    const dbNewsProcessed: NewsItem[] = initialNews.map(item => ({
      ...item,
      category_name: getCategoryName(item)
    }));

    // Sort by published date descending
    return dbNewsProcessed.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }, [initialNews]);

  // Smart categorization mapping to match the mockup filters ("Semua", "Berita", "Artikel", "Penyaluran", "Pengumuman")
  const filteredNews = useMemo(() => {
    if (selectedCategory === "Semua") {
      return allNews;
    }

    return allNews.filter(item => {
      const cat = getCategoryName(item).toLowerCase();
      const filter = selectedCategory.toLowerCase();

      // Exact match
      if (cat === filter) return true;

      // Smart semantic mapping
      if (filter === "berita") {
        return cat === "berita" || cat === "umum" || cat === "nasional" || cat === "kabar";
      }
      if (filter === "artikel") {
        return cat === "artikel" || cat === "pendidikan" || cat === "edukasi" || cat === "opini";
      }
      if (filter === "penyaluran") {
        return cat === "penyaluran" || cat === "kesehatan" || cat === "pemberdayaan" || cat === "kemanusiaan" || cat === "ekonomi" || cat === "sosial";
      }
      if (filter === "pengumuman") {
        return cat === "pengumuman" || cat === "dakwah" || cat === "keagamaan" || cat === "dakwah advokasi";
      }

      return false;
    });
  }, [allNews, selectedCategory]);

  // Extract the very latest item as the featured article (only when on "Semua" or if filtered has items)
  const featuredArticle = useMemo(() => {
    if (filteredNews.length === 0) return null;
    return filteredNews[0];
  }, [filteredNews]);

  // The rest of the articles go to the grid
  const gridArticles = useMemo(() => {
    if (filteredNews.length <= 1) return [];
    return filteredNews.slice(1, visibleCount);
  }, [filteredNews, visibleCount]);

  const hasMore = filteredNews.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 max-w-[1320px] mx-auto px-6 md:px-12 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-on-surface font-bold mb-4 tracking-tight leading-[1.1]">
          Kabar BAZNAS
        </h1>
        <p className="font-jakarta text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          Mendokumentasikan kebaikan dan transparansi informasi seputar program penyaluran dan pemberdayaan masyarakat di Kabupaten Boven Digoel.
        </p>
      </section>

      {/* Categories / Filters */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-wrap gap-3 justify-center items-center">
          {FILTERS.map((filter) => {
            const isActive = selectedCategory === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setSelectedCategory(filter);
                  setVisibleCount(6); // Reset pagination on filter change
                }}
                className={`font-jakarta text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 border ${
                  isActive
                    ? "bg-[#004229] border-[#004229] text-white shadow-md dark:bg-[#8cd6ac] dark:border-[#8cd6ac] dark:text-[#002112]"
                    : "bg-[#f5f3ee] border-outline-variant/50 text-on-surface hover:bg-surface-container-high hover:border-outline transition-colors dark:bg-inverse-surface dark:border-outline/20 dark:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Article Section */}
      {featuredArticle && (
        <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl border border-surface-variant/50 dark:border-outline/10 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
              {/* Featured Image */}
              <div className="lg:w-7/12 relative h-72 lg:h-[450px] overflow-hidden">
                <Image
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  src={featuredArticle.thumbnail_url || "/images/homepage_preview.png"}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-white dark:text-[#1b1c19] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow-sm font-jakarta z-10">
                  Sorotan Utama
                </div>
              </div>

              {/* Featured Text */}
              <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center bg-surface-bright dark:bg-slate-900/40">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#075C3B] dark:text-[#8cd6ac] font-jakarta text-xs font-bold uppercase tracking-widest">
                    {getCategoryName(featuredArticle)}
                  </span>
                  <span className="text-on-surface-variant text-xs">•</span>
                  <span className="text-on-surface-variant font-jakarta text-xs font-medium">
                    {format(new Date(featuredArticle.published_at), "dd MMMM yyyy", { locale: id })}
                  </span>
                </div>

                <Link href={`/kabar/${featuredArticle.slug}`}>
                  <h2 className="font-playfair text-2xl lg:text-3xl text-on-surface font-bold mb-4 leading-tight group-hover:text-[#004229] dark:group-hover:text-[#8cd6ac] transition-colors">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="font-jakarta text-sm md:text-base text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                  {getExcerpt(featuredArticle.content, 180)}
                </p>

                <Link
                  className="inline-flex items-center gap-2 text-[#004229] dark:text-[#8cd6ac] font-jakarta text-sm font-bold group-hover:text-[#075C3B] transition-colors"
                  href={`/kabar/${featuredArticle.slug}`}
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid Section */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-20">
        {gridArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-inverse-surface rounded-2xl border border-surface-variant/50 dark:border-outline/10 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    src={item.thumbnail_url || "/images/homepage_preview.png"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#004229]/90 dark:bg-[#8cd6ac]/90 text-white dark:text-[#002112] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded z-10">
                    {getCategoryName(item)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow bg-surface-bright dark:bg-slate-900/20">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span className="text-on-surface-variant font-jakarta text-xs font-medium">
                      {format(new Date(item.published_at), "dd MMMM yyyy", { locale: id })}
                    </span>
                  </div>

                  <Link href={`/kabar/${item.slug}`} className="block">
                    <h3 className="font-playfair text-xl font-bold text-on-surface mb-3 leading-tight group-hover:text-[#004229] dark:group-hover:text-[#8cd6ac] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="font-jakarta text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
                    {getExcerpt(item.content, 110)}
                  </p>

                  <div className="mt-auto pt-4 border-t border-surface-variant/50 dark:border-outline/10 flex items-center justify-between">
                    <Link
                      className="inline-flex items-center gap-1.5 text-[#004229] dark:text-[#8cd6ac] font-jakarta text-xs font-bold group-hover:text-[#075C3B] transition-colors"
                      href={`/kabar/${item.slug}`}
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !featuredArticle && (
            <div className="text-center py-16 bg-[#f5f3ee] dark:bg-inverse-surface rounded-2xl border border-dashed border-outline-variant/60">
              <Inbox className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-70" />
              <h3 className="font-playfair text-xl font-bold text-on-surface mb-2">Belum Ada Kabar</h3>
              <p className="font-jakarta text-sm text-on-surface-variant max-w-md mx-auto">
                Saat ini belum ada berita atau artikel yang tersedia untuk kategori ini.
              </p>
            </div>
          )
        )}

        {/* Pagination / Load More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="border-2 border-[#004229] text-[#004229] hover:bg-[#004229] hover:text-white dark:border-[#8cd6ac] dark:text-[#8cd6ac] dark:hover:bg-[#8cd6ac] dark:hover:text-[#002112] font-jakarta text-sm font-bold px-8 py-3 rounded-md transition-all duration-300 inline-flex items-center gap-2 shadow-sm"
            >
              Muat Lebih Banyak
              <ChevronDown className="w-4 h-4 animate-pulse" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}