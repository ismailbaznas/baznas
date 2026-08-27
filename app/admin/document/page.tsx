// app/admin/document/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import AdminCard from '@/components/cms/AdminCard';

export const metadata: Metadata = {
  title: 'Manajemen Dokumen & Laporan - CMS BAZNAS',
};

// Data fetching function for Document List (Server Component)
async function fetchDocumentData() {
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, type, year, is_public, created_at')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching document list:', error);
    return [];
  }
  
  return data;
}

// Helper to format type names
const typeMap: { [key: string]: string } = {
    'laporan_penghimpunan': 'Laporan Penghimpunan',
    'laporan_penyaluran': 'Laporan Penyaluran',
    'laporan_tahunan': 'Laporan Tahunan',
    'dokumen_publik': 'Dokumen Publik',
};

export default async function DocumentListPage() {
  const documentItems = await fetchDocumentData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-baznas-green-dark">Manajemen Dokumen & Laporan</h1>
        <Link 
          href="/admin/document/create" 
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-baznas-green hover:bg-baznas-green-dark transition-colors"
        >
          + Tambah Dokumen Baru
        </Link>
      </div>
      
      <div className="space-y-4">
        {documentItems.length === 0 ? (
          <div className="bg-gray-100 p-8 text-center rounded-lg">
            <p className="text-lg font-medium text-baznas-neutral">Belum ada dokumen yang diunggah.</p>
            <p className="text-sm text-gray-500 mt-2">Gunakan tombol "Tambah Dokumen Baru" untuk memulai unggahan.</p>
          </div>
        ) : (
          documentItems.map((doc) => (
            <AdminCard 
              key={doc.id}
              id={doc.id}
              title={`${doc.title} (${doc.year})`}
              subtitle={typeMap[doc.type] || doc.type}
              status={doc.is_public ? 'Published' : 'Draft'}
              editLink={`/admin/document/${doc.id}`}
            />
          ))
        )}
      </div>

    </div>
  );
}