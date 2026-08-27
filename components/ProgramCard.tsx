// components/ProgramCard.tsx
import Link from 'next/link';

interface ProgramCardProps {
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
}

export default function ProgramCard({ slug, title, category, description, imageUrl }: ProgramCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      
      {/* Image */}
      <div className="aspect-video w-full bg-gray-200 overflow-hidden">
        {/* Using standard img tag for MVP - Next/Image should be used for production */}
        <img 
          src={imageUrl || '/images/placeholder-program.jpg'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      <div className="p-5">
        <span className="text-xs font-semibold uppercase text-baznas-green-dark">
          {category}
        </span>

        <Link href={`/program/${slug}`} className="block mt-1">
          <h3 className="text-xl font-bold text-baznas-green-dark group-hover:text-baznas-gold transition-colors mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-baznas-neutral mb-4 line-clamp-3">
          {description}
        </p>

        <Link 
          href={`/program/${slug}`} 
          className="text-sm font-semibold text-baznas-gold hover:text-baznas-green-dark transition-colors"
        >
          Lihat Detail &rarr;
        </Link>
      </div>
    </div>
  );
}