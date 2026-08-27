// components/NewsListItem.tsx
import Link from 'next/link';

interface NewsListItemProps {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  thumbnailUrl?: string;
}

export default function NewsListItem({ slug, title, category, date, excerpt, thumbnailUrl }: NewsListItemProps) {
  const formattedDate = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <article className="border-b pb-6 mb-6 flex space-x-6 hover:bg-gray-50 p-4 -m-4 rounded-lg transition-colors">
      {/* Thumbnail */}
      <div className="w-40 h-40 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
        {/* Using standard img tag for MVP - Next/Image should be used for production */}
        <img 
          src={thumbnailUrl || '/images/placeholder-news.jpg'} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase text-baznas-green-dark bg-baznas-green/10 px-2 py-0.5 rounded">
            {category}
          </span>
          <time dateTime={date} className="text-sm text-gray-500">
            {formattedDate}
          </time>
        </div>
        
        <Link href={`/kabar/${slug}`} className="block">
          <h2 className="text-2xl font-bold text-baznas-green-dark hover:text-baznas-gold transition-colors mb-2">
            {title}
          </h2>
        </Link>

        <p className="text-base text-baznas-neutral">
          {excerpt}
        </p>

        <Link href={`/kabar/${slug}`} className="mt-3 inline-flex items-center text-sm font-semibold text-baznas-gold hover:text-baznas-green-dark">
          Baca Selengkapnya &rarr;
        </Link>
      </div>
    </article>
  );
}