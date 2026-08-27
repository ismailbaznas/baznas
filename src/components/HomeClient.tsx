"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface HomeClientProps {
  news: any[];
  programs: any[];
}

export default function HomeClient({ news, programs }: HomeClientProps) {
  return (
    <section className="container mx-auto p-8 pt-20 flex flex-col items-center justify-center text-center min-h-[500px]">
      <AlertTriangle className="w-12 h-12 text-primary mb-4" />
      <h1 className="text-headline-lg font-space-grotesk glow-gold mb-2">
        BAZNAS Kabupaten Boven Digoel
      </h1>
      <p className="text-body-lg text-on-surface-variant max-w-lg mb-8">
        Data Berhasil Dimuat (News: {news.length}, Programs: {programs.length})
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl text-left">
        {/* News Column */}
        <div className="p-6 bg-surface-container-high rounded-xl border border-surface-variant space-y-4">
          <h2 className="text-title-lg font-semibold text-primary font-space-grotesk border-b pb-2">
            3 Berita Terbaru
          </h2>
          <div className="space-y-3">
            {news.map((item: any) => (
              <Link 
                key={item.id} 
                href={`/kabar/${item.slug}`} 
                className="block p-3 rounded-lg hover:bg-primary/5 transition-all group"
              >
                <span className="text-xs text-on-surface-variant block mb-1">
                  {new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="text-body-md font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </span>
              </Link>
            ))}
            {news.length === 0 && (
              <p className="text-sm text-on-surface-variant">Belum ada berita terbaru.</p>
            )}
          </div>
          <div className="pt-2">
            <Link href="/kabar" className="text-sm font-semibold text-primary hover:underline">
              Lihat Semua Berita →
            </Link>
          </div>
        </div>

        {/* Programs Column */}
        <div className="p-6 bg-surface-container-high rounded-xl border border-surface-variant space-y-4">
          <h2 className="text-title-lg font-semibold text-primary font-space-grotesk border-b pb-2">
            3 Program Unggulan
          </h2>
          <div className="space-y-3">
            {programs.map((item: any) => (
              <Link 
                key={item.id} 
                href={`/program/${item.slug}`} 
                className="block p-3 rounded-lg hover:bg-primary/5 transition-all group"
              >
                <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors block mb-1">
                  {item.title}
                </span>
                <span className="text-xs text-on-surface-variant line-clamp-2">
                  {item.description || "Klik untuk melihat detail program."}
                </span>
              </Link>
            ))}
            {programs.length === 0 && (
              <p className="text-sm text-on-surface-variant">Belum ada program unggulan.</p>
            )}
          </div>
          <div className="pt-2">
            <Link href="/program" className="text-sm font-semibold text-primary hover:underline">
              Lihat Semua Program →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}