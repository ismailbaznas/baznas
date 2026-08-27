// components/cms/AdminCard.tsx
import Link from 'next/link';

interface AdminCardProps {
  id: string;
  title: string;
  subtitle: string;
  status: 'Published' | 'Draft';
  editLink: string;
  // TODO: Add onDelete prop
}

export default function AdminCard({ id, title, subtitle, status, editLink }: AdminCardProps) {
  const statusColor = status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-baznas-green-dark">
          {title}
        </div>
        <div className="text-sm text-baznas-neutral/70 truncate">
          {subtitle}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
          {status}
        </span>
        
        <Link href={editLink} className="text-sm font-medium text-baznas-gold hover:text-baznas-green-dark transition-colors">
          Edit &rarr;
        </Link>
      </div>
    </div>
  );
}