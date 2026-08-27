// app/program/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchProgramBySlug, fetchAllProgramSlugs } from '@/lib/data';

interface ProgramDetailPageProps {
  params: { slug: string };
}

// Generates the static pages for each program slug at build time
export async function generateStaticParams() {
  const slugs = await fetchAllProgramSlugs();
  // slugs is an array of objects: [{ slug: 'program-a' }, { slug: 'program-b' }]
  return slugs;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  // Fetch data to generate dynamic metadata
  try {
    const program = await fetchProgramBySlug(params.slug);
    
    return {
      title: `${program.title} - Program BAZNAS Boven Digoel`,
      description: program.description?.substring(0, 160) || `Informasi detail mengenai program ${program.title} dari BAZNAS Kabupaten Boven Digoel.`,
    };
  } catch (e) {
    return { title: "Program Tidak Ditemukan" };
  }
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const program = await fetchProgramBySlug(params.slug); // notFound() if not found

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Placeholder */}
        <p className="text-sm text-baznas-neutral/70 mb-4">
          <a href="/program" className="hover:underline">Program</a> &raquo; {program.title}
        </p>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-baznas-green-dark mb-4">
          {program.title}
        </h1>

        {/* Image Placeholder */}
        <div className="aspect-video w-full bg-gray-200 rounded-lg shadow-lg mb-6 flex items-center justify-center">
          <img 
            src={program.image_url || '/images/placeholder-program.jpg'} 
            alt={program.title} 
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Program Description */}
        <div className="prose lg:prose-lg text-baznas-neutral">
          <p>{program.description}</p>
          <p className="italic mt-8 text-sm text-gray-500">
            Detail program akan dimuat dari Supabase. (ID: {program.id})
          </p>
        </div>

        {/* CTA to Pay Zakat */}
        <div className="text-center mt-12">
          <a
            href="/layanan/bayar-zakat"
            className="inline-flex px-8 py-3 text-xl font-semibold rounded-full shadow-lg text-white bg-baznas-gold hover:bg-yellow-600 transition-colors"
          >
            Dukung Program Ini Sekarang
          </a>
        </div>

      </div>
    </div>
  );
}