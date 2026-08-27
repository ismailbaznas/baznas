// components/cms/ProgramForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrUpdateProgram, deleteProgram } from '@/app/admin/actions';

interface ProgramFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    image_url: string | null;
    // Add other fields as needed (category_id, etc.)
  };
}

export default function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || 'Deskripsi program...',
    isActive: initialData?.is_active || false,
    imageUrl: initialData?.image_url || '',
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await createOrUpdateProgram(formData, initialData?.id);
    
    if (result.success) {
      setStatusMessage({ type: 'success', message: result.message });
      // Redirect after successful creation
      if (!initialData?.id) {
         router.push('/admin/program');
      }
      // Revalidate all pages to show the new content
      router.refresh();
    } else {
      setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm('Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }

    setLoading(true);
    const result = await deleteProgram(initialData.id);

    if (result.success) {
        setStatusMessage({ type: 'success', message: result.message });
        router.push('/admin/program');
    } else {
        setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-baznas-green-dark">
        {initialData ? 'Edit Program' : 'Buat Program Baru'}
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Program</label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>

      {/* Description (Textarea) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Program</label>
        <textarea
          id="description"
          rows={5}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>

      {/* Image URL (Simple text input for MVP) */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Gambar Program (Opsional)</label>
        <input
          id="imageUrl"
          type="text"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-baznas-green border-gray-300 rounded focus:ring-baznas-green"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
          Program Aktif (Tandai sebagai siap tampil di website publik)
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
          {initialData ? (loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan') : (loading ? 'Membuat Program...' : 'Buat Program')}
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
            {loading ? 'Menghapus...' : 'Hapus Program'}
          </button>
        )}
      </div>
    </form>
  );
}
