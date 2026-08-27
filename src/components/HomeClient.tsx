"use client";

import { AlertTriangle } from "lucide-react";

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
      <p className="text-body-lg text-on-surface-variant max-w-lg">
        Data Berhasil Dimuat (News: {news.length}, Programs: {programs.length})
      </p>
      
      <div className="mt-8 p-4 bg-surface-container-high rounded-lg text-body-md w-full max-w-2xl text-left">
        <h2 className="text-lg font-semibold mb-2">3 Berita Terbaru:</h2>
        {news.map((item: any) => (
          <p key={item.id} className="text-sm">
            [{item.published_at.substring(0, 10)}] {item.title}
          </p>
        ))}
        
        <h2 className="text-lg font-semibold mt-4 mb-2">3 Program Unggulan:</h2>
        {programs.map((item: any) => (
          <p key={item.id} className="text-sm">
            {item.title}
          </p>
        ))}
      </div>
    </section>
  );
}