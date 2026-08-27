// app/admin/document/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DocumentForm from '@/components/cms/DocumentForm';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface EditDocumentPageProps {
  params: { id: string };
}

async function fetchDocumentItem(id: string) {
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  
  return data;
}

export async function generateMetadata({ params }: EditDocumentPageProps): Promise<Metadata> {
  const data = await fetchDocumentItem(params.id);
  return {
    title: `Edit: ${data.title} - CMS BAZNAS`,
  };
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const documentItem = await fetchDocumentItem(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Edit Dokumen</h1>
      <Link href="/admin/document" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Dokumen</Link>
      <div className="max-w-4xl">
        {/* Pass the fetched data to the client component form */}
        <DocumentForm initialData={documentItem} />
      </div>
    </div>
  );
}
