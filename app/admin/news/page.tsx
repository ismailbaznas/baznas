// app/admin/news/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import AdminCard from '@/components/cms/AdminCard';
// import { deleteNews } from '../../actions'; // Import Server Action (for later use)

export const metadata: Metadata = {
  title: 'Manajemen Berita & Artikel - CMS BAZNAS',
};

// Data fetching function for News List (Server Component)
async function fetchNewsData() {
  const supabase = getSupabaseServerClient(cookies());
  
  // NOTE: This should use a client with an authenticated user's RLS, not the admin client.
  // Since we don't have RBAC yet, we fetch all.
  const { data, error } = await supabase
    .from('news')
    .select('id, title, is_published, created_at, slug')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news list:', error);
    return [];
  }
  
  return data;
}

export default async function NewsListPage() {
  const newsItems = await fetchNewsData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-baznas-green-dark">Manajemen Berita</h1>
        <Link 
          href="/admin/news/create" 
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-baznas-green hover:bg-baznas-green-dark transition-colors"
        >
          + Tambah Berita Baru
        </Link>
      </div>
      
      <div className="space-y-4">
        {newsItems.length === 0 ? (
          <div className="bg-gray-100 p-8 text-center rounded-lg">
            <p className="text-lg font-medium text-baznas-neutral">Belum ada berita yang dibuat.</p>
            <p className="text-sm text-gray-500 mt-2">Gunakan tombol "Tambah Berita Baru" untuk memulai.</p>
          </div>
        ) : (
          newsItems.map((news) => (
            <AdminCard 
              key={news.id}
              id={news.id}
              title={news.title}
              subtitle={`Dibuat pada: ${new Date(news.created_at).toLocaleDateString('id-ID')}`}
              status={news.is_published ? 'Published' : 'Draft'}
              editLink={`/admin/news/${news.id}`}
            />
          ))
        )}
      </div>

    </div>
  );
}