// components/NewsCard.tsx
import Link from 'next/link';

interface NewsCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  thumbnailUrl: string;
}

export default function NewsCard({ slug, title, category, date, excerpt, thumbnailUrl }: NewsCardProps) {
  return (
    <Link href={`/kabar/${slug}`} className="block group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        {/* Placeholder image tag */}
        <img 
          src={thumbnailUrl || '/images/placeholder-news.jpg'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      <div className="p-4">
        {/* Category & Date */}
        <div className="flex justify-between text-xs text-baznas-neutral/70 mb-2">
          <span className="font-semibold text-baznas-green-dark uppercase">{category}</span>
          <span>{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-baznas-green-dark group-hover:text-baznas-gold transition-colors line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-baznas-neutral line-clamp-3">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
