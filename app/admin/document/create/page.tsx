// app/admin/document/create/page.tsx
import { Metadata } from 'next';
import DocumentForm from '@/components/cms/DocumentForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unggah Dokumen Baru - CMS BAZNAS',
};

export default function CreateDocumentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Unggah Dokumen Baru</h1>
      <Link href="/admin/document" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Dokumen</Link>
      <div className="max-w-4xl">
        <DocumentForm />
      </div>
    </div>
  );
}