// app/admin/program/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProgramForm from '@/components/cms/ProgramForm';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface EditProgramPageProps {
  params: { id: string };
}

async function fetchProgramItem(id: string) {
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  
  return data;
}

export async function generateMetadata({ params }: EditProgramPageProps): Promise<Metadata> {
  const data = await fetchProgramItem(params.id);
  return {
    title: `Edit: ${data.title} - CMS BAZNAS`,
  };
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const programItem = await fetchProgramItem(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Edit Program</h1>
      <Link href="/admin/program" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Program</Link>
      <div className="max-w-4xl">
        {/* Pass the fetched data to the client component form */}
        <ProgramForm initialData={programItem} />
      </div>
    </div>
  );
}
