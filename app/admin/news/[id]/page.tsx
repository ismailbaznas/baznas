// app/admin/news/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsForm from '@/components/cms/NewsForm';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface EditNewsPageProps {
  params: { id: string };
}

async function fetchNewsItem(id: string) {
  // NOTE: This uses the standard authenticated client, expecting RLS to allow authenticated user to read ALL news.
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  
  return data;
}

export async function generateMetadata({ params }: EditNewsPageProps): Promise<Metadata> {
  const data = await fetchNewsItem(params.id);
  return {
    title: `Edit: ${data.title} - CMS BAZNAS`,
  };
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const newsItem = await fetchNewsItem(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Edit Berita</h1>
      <Link href="/admin/news" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Berita</Link>
      <div className="max-w-4xl">
        {/* Pass the fetched data to the client component form */}
        <NewsForm initialData={newsItem} />
      </div>
    </div>
  );
}
