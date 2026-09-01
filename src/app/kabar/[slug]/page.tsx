// src/app/kabar/[slug]/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd, getNewsArticleJsonLd, getBaseUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("news")
    .select("title, content, published_at, thumbnail_url, categories(name)")
    .eq("slug", slug)
    .single();

  const item = data as any;

  if (!item) {
    return {
      title: "Berita Tidak Ditemukan",
      robots: { index: false },
    };
  }

  const plainContent = (item.content || "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const cleanDescription = plainContent.length > 0
    ? plainContent.substring(0, 160).trim() + "..."
    : `Baca artikel "${item.title}" di portal resmi BAZNAS Kabupaten Boven Digoel.`;

  const baseUrl = getBaseUrl();
  const canonicalUrl = `/kabar/${slug}`;
  const categoryName = (item.categories as any)?.name || "Berita";

  const ogImages = item.thumbnail_url
    ? [
        {
          url: item.thumbnail_url,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ]
    : [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ];

  return {
    title: item.title,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${item.title} — BAZNAS Kabupaten Boven Digoel`,
      description: cleanDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: item.published_at,
      section: categoryName,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} — BAZNAS Kabupaten Boven Digoel`,
      description: cleanDescription,
      images: [item.thumbnail_url || `${baseUrl}/og.png`],
    },
  };
}

export default async function KabarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("news")
    .select(`
        id, 
        title, 
        content, 
        published_at, 
        thumbnail_url,
        categories (name)
    `)
    .eq("slug", slug)
    .single();

  const item = data as any;

  if (error || !item) {
    notFound();
  }

  const categoryName = (item.categories as any)?.name || "Umum";
  const plainExcerpt = (item.content || "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 200);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Beranda", url: "/" },
    { name: "Kabar & Berita", url: "/kabar" },
    { name: item.title, url: `/kabar/${slug}` },
  ]);

  const articleJsonLd = getNewsArticleJsonLd({
    title: item.title,
    description: plainExcerpt,
    url: `/kabar/${slug}`,
    imageUrl: item.thumbnail_url,
    datePublished: item.published_at,
    category: categoryName,
  });

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, articleJsonLd]} />
      <article className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
        <Link
          href="/kabar"
          className="inline-flex items-center space-x-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kabar & Berita</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#004229] dark:text-white leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(item.published_at), "dd MMMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
            <div>•</div>
            <Badge variant="secondary">
              {categoryName}
            </Badge>
          </div>
        </div>

        {item.thumbnail_url && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-surface-variant">
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose max-w-none text-body-lg text-on-surface/80 leading-relaxed space-y-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-title-lg [&_h3]:font-bold [&_h3]:mt-6"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </article>
    </>
  );
}