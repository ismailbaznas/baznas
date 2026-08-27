// components/cms/NewsForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrUpdateNews, deleteNews } from '@/app/admin/actions';

interface NewsFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    is_published: boolean;
    // Add other fields as needed (category_id, etc.)
  };
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '<!-- Konten berita di sini -->',
    isPublished: initialData?.is_published || false,
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await createOrUpdateNews(formData, initialData?.id);
    
    if (result.success) {
      setStatusMessage({ type: 'success', message: result.message });
      // Redirect after successful creation
      if (!initialData?.id) {
         // Navigate to the list page after creation
         router.push('/admin/news');
      }
      // Revalidate all pages to show the new content
      router.refresh();
    } else {
      setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm('Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }

    setLoading(true);
    const result = await deleteNews(initialData.id);

    if (result.success) {
        setStatusMessage({ type: 'success', message: result.message });
        router.push('/admin/news');
    } else {
        setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-baznas-green-dark">
        {initialData ? 'Edit Berita' : 'Buat Berita Baru'}
      </h2>

      {statusMessage && (
        <div className={`p-3 rounded text-sm font-medium ${
          statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {statusMessage.message}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Berita</label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>

      {/* Content (Simple Textarea for MVP) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten (HTML/Rich Text)</label>
        <textarea
          id="content"
          rows={10}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
        <p className="text-xs text-gray-500 mt-1">Gunakan kode HTML atau markup untuk konten (e.g., &lt;p&gt;, &lt;h3&gt;).</p>
      </div>

      {/* Publish Checkbox */}
      <div className="flex items-center">
        <input
          id="isPublished"
          type="checkbox"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="h-4 w-4 text-baznas-green border-gray-300 rounded focus:ring-baznas-green"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-700">
          Publikasikan Berita (Tandai sebagai siap tampil di website publik)
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-baznas-green-dark hover:bg-baznas-green'
          }`}
        >
          {initialData ? (loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan') : (loading ? 'Membuat Berita...' : 'Buat Berita')}
        </button>
        
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors ${
                loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? 'Menghapus...' : 'Hapus Berita'}
          </button>
        )}
      </div>
    </form>
  );
}