// src/app/program/[slug]/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd, getProgramJsonLd, getBaseUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("programs")
    .select("title, description, image_url, categories(name)")
    .eq("slug", slug)
    .single();

  const item = data as any;

  if (!item) {
    return {
      title: "Program Tidak Ditemukan",
      robots: { index: false },
    };
  }

  const categoryName = (item.categories as any)?.name || "Program BAZNAS";
  const cleanDescription = item.description
    ? item.description.substring(0, 160).replace(/\s+/g, " ").trim() + "..."
    : `Program ${item.title} diselenggarakan oleh BAZNAS Kabupaten Boven Digoel untuk kemaslahatan mustahik.`;

  const baseUrl = getBaseUrl();
  const canonicalUrl = `/program/${slug}`;
  const ogImages = item.image_url
    ? [
        {
          url: item.image_url,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ]
    : [
        {
          url: `${baseUrl}/opengraph-image`,
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
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} — BAZNAS Kabupaten Boven Digoel`,
      description: cleanDescription,
      images: [item.image_url || `${baseUrl}/twitter-image`],
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("programs")
    .select(`
        id, 
        title, 
        description, 
        image_url,
        categories (name)
    `)
    .eq("slug", slug)
    .single();

  const item = data as any;

  if (error || !item) {
    notFound();
  }

  const categoryName = (item.categories as any)?.name || "Umum";
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Beranda", url: "/" },
    { name: "Program", url: "/program" },
    { name: item.title, url: `/program/${slug}` },
  ]);

  const programJsonLd = getProgramJsonLd({
    title: item.title,
    description: item.description || "",
    url: `/program/${slug}`,
    imageUrl: item.image_url,
    category: categoryName,
  });

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, programJsonLd]} />
      <article className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
        <Link
          href="/program"
          className="inline-flex items-center space-x-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Program</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#004229] dark:text-white leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Kategori:</span>
            </div>
            <Badge variant="secondary">
              {categoryName}
            </Badge>
          </div>
        </div>

        {item.image_url && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-surface-variant">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none text-body-lg text-on-surface/80 leading-relaxed whitespace-pre-wrap space-y-4">
          {item.description}
        </div>
      </article>
    </>
  );
}