// components/LatestNews.tsx
import Link from 'next/link';
import NewsCard from './NewsCard';

// Temporary Mock Data Structure (to be replaced by Supabase data fetching)
interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  thumbnailUrl: string;
}

// Simulated data fetching function (Server Component)
async function getLatestNews(limit: number = 3): Promise<NewsItem[]> {
  // TODO: Replace with real Supabase data fetching from lib/supabase.ts
  const mockData: NewsItem[] = [];
  
  // Return mockData (empty) to trigger the Empty State for MVP
  return mockData;
}

export default async function LatestNews() {
  // Fetching data in a Server Component
  const latestNews = await getLatestNews();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-baznas-green-dark mb-10">
          Kabar Terkini
        </h2>
        
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          /* Empty State - PRD Section 40: informative empty state */
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <svg className="mx-auto h-12 w-12 text-baznas-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 002 2zm-7-2h5m-5-8h.01M7 13h5m-5-4h.01M16 16v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2h-3" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-baznas-green-dark">Belum Ada Kabar Terkini</h3>
            <p className="mt-1 text-sm text-baznas-neutral">
              Saat ini belum ada berita atau artikel terbaru yang dipublikasikan. Silakan cek kembali nanti atau lihat halaman program kami.
            </p>
            <div className="mt-6">
              <Link
                href="/program"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-baznas-green hover:bg-baznas-green-dark"
              >
                Lihat Program Kami
              </Link>
            </div>
          </div>
        )}
        
        {/* View All Button */}
        {latestNews.length > 0 && (
          <div className="text-center mt-8">
            <Link 
              href="/kabar/berita" 
              className="text-baznas-green-dark hover:text-baznas-gold font-semibold transition-colors"
            >
              Lihat Semua Berita &rarr;
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
