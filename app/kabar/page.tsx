// app/kabar/page.tsx
import { Metadata } from 'next';
import { fetchNewsList } from '@/lib/data';
import NewsListItem from '@/components/NewsListItem';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Kabar Terbaru BAZNAS Boven Digoel',
  description: 'Temukan berita terbaru, artikel, dan agenda kegiatan dari BAZNAS Kabupaten Boven Digoel.',
};

export default async function KabarPage() {
  const newsList = await fetchNewsList();

  if (newsList.length === 0) {
    return (
        <PlaceholderPage
            title="Kabar Terkini"
            description="Belum ada berita atau artikel yang diterbitkan saat ini."
        />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-baznas-green-dark mb-8 border-b pb-4">
          Semua Kabar & Artikel
        </h1>

        <div className="space-y-6">
          {newsList.map((news) => (
            <NewsListItem 
              key={news.id} 
              slug={news.slug}
              title={news.title}
              category={news.category}
              date={news.date}
              excerpt={news.excerpt}
              thumbnailUrl={news.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}