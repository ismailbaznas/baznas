// app/program/page.tsx
import { Metadata } from 'next';
import { fetchProgramList } from '@/lib/data';
import ProgramCard from '@/components/ProgramCard';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Program BAZNAS Boven Digoel',
  description: 'Daftar program unggulan BAZNAS Kabupaten Boven Digoel di bidang Pendidikan, Kesehatan, Ekonomi, Kemanusiaan, dan Keagamaan.',
};

export default async function ProgramPage() {
  const programList = await fetchProgramList();

  if (programList.length === 0) {
    return (
        <PlaceholderPage
            title="Program Unggulan"
            description="Saat ini belum ada program aktif yang tercatat. Silakan cek kembali nanti."
        />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-baznas-green-dark mb-10 border-b pb-4 text-center">
        Program Unggulan BAZNAS Boven Digoel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programList.map((program) => (
          <ProgramCard 
            key={program.id} 
            slug={program.slug}
            title={program.title}
            category={program.category}
            description={program.description}
            imageUrl={program.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}