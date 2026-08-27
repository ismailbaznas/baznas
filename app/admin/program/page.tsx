// app/admin/program/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import AdminCard from '@/components/cms/AdminCard';

export const metadata: Metadata = {
  title: 'Manajemen Program - CMS BAZNAS',
};

// Data fetching function for Program List (Server Component)
async function fetchProgramData() {
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('programs')
    .select('id, title, is_active, created_at, slug')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching program list:', error);
    return [];
  }
  
  return data;
}

export default async function ProgramListPage() {
  const programItems = await fetchProgramData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-baznas-green-dark">Manajemen Program</h1>
        <Link 
          href="/admin/program/create" 
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-baznas-green hover:bg-baznas-green-dark transition-colors"
        >
          + Tambah Program Baru
        </Link>
      </div>
      
      <div className="space-y-4">
        {programItems.length === 0 ? (
          <div className="bg-gray-100 p-8 text-center rounded-lg">
            <p className="text-lg font-medium text-baznas-neutral">Belum ada program yang dibuat.</p>
            <p className="text-sm text-gray-500 mt-2">Gunakan tombol "Tambah Program Baru" untuk memulai.</p>
          </div>
        ) : (
          programItems.map((program) => (
            <AdminCard 
              key={program.id}
              id={program.id}
              title={program.title}
              subtitle={`Dibuat pada: ${new Date(program.created_at).toLocaleDateString('id-ID')}`}
              status={program.is_active ? 'Published' : 'Draft'}
              editLink={`/admin/program/${program.id}`}
            />
          ))
        )}
      </div>

    </div>
  );
}