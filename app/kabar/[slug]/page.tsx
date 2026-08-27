// app/kabar/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNewsBySlug, fetchAllNewsSlugs } from '@/lib/data';
import Link from 'next/link';

interface NewsDetailPageProps {
  params: { slug: string };
}

// Generates the static pages for each news slug at build time
export async function generateStaticParams() {
  const slugs = await fetchAllNewsSlugs();
  // slugs is an array of objects: [{ slug: 'news-a' }, { slug: 'news-b' }]
  return slugs;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  // Fetch data to generate dynamic metadata
  try {
    const news = await fetchNewsBySlug(params.slug);
    
    // Fallback to simpler metadata if content is very long
    const description = news.content.substring(0, 160).replace(/<[^>]*>?/gm, "") || `Baca berita terbaru: ${news.title}`;

    return {
      title: `${news.title} - Kabar BAZNAS Boven Digoel`,
      description: description,
      // NOTE: Should add OpenGraph and other SEO fields later (Phase 8)
    };
  } catch (e) {
    return { title: "Berita Tidak Ditemukan" };
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = await fetchNewsBySlug(params.slug); // notFound() if not found

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-baznas-green-dark mb-4">
          {news.title}
        </h1>

        {/* Metadata (Category, Date) */}
        <div className="flex items-center space-x-4 text-sm text-baznas-neutral/70 mb-6">
          <span className="font-semibold text-baznas-green-dark">
            {news.category_name || 'Umum'}
          </span>
          <span className="text-gray-500">
            {new Date(news.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="aspect-video w-full bg-gray-200 rounded-lg shadow-lg mb-8 flex items-center justify-center">
          <img 
            src={news.thumbnail_url || '/images/placeholder-news.jpg'} 
            alt={news.title} 
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Content - Using dangerouslySetInnerHTML as content is assumed to be rich text/HTML from CMS */}
        <div 
          className="prose prose-lg max-w-none text-baznas-neutral" 
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <p className="italic mt-8 pt-4 border-t text-sm text-gray-500">
          Artikel dimuat dari Supabase. (ID: {news.id})
        </p>
        
        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/kabar"
            className="inline-flex items-center text-baznas-green-dark hover:text-baznas-gold font-semibold transition-colors"
          >
            &larr; Kembali ke Semua Kabar
          </Link>
        </div>

      </div>
    </div>
  );
}