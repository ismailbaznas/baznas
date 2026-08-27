// app/admin/program/create/page.tsx
import { Metadata } from 'next';
import ProgramForm from '@/components/cms/ProgramForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Buat Program Baru - CMS BAZNAS',
};

export default function CreateProgramPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-baznas-green-dark mb-4">Buat Program Baru</h1>
      <Link href="/admin/program" className="text-sm text-baznas-neutral/70 hover:underline mb-6 block">&larr; Kembali ke Daftar Program</Link>
      <div className="max-w-4xl">
        <ProgramForm />
      </div>
    </div>
  );
}