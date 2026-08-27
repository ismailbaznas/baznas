// app/admin/news/create/page.tsx
import { Metadata } from 'next';
import NewsForm from '@/components/cms/NewsForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Buat Berita Baru - CMS BAZNAS',
};

export default function CreateNewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Buat Berita Baru</h1>
      <Link href="/admin/news" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Berita</Link>
      <div className="max-w-4xl">
        <NewsForm />
      </div>
    </div>
  );
}