// components/cms/DocumentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrUpdateDocument, deleteDocument } from '@/app/admin/actions';

interface DocumentFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    document_url: string;
    type: string;
    year: number;
    is_public: boolean;
  };
}

const documentTypes = [
    { value: 'laporan_penghimpunan', label: 'Laporan Penghimpunan' },
    { value: 'laporan_penyaluran', label: 'Laporan Penyaluran' },
    { value: 'laporan_tahunan', label: 'Laporan Tahunan' },
    { value: 'dokumen_publik', label: 'Dokumen Publik Lainnya' },
];

export default function DocumentForm({ initialData }: DocumentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    documentUrl: initialData?.document_url || '',
    type: initialData?.type || documentTypes[0].value,
    year: initialData?.year || new Date().getFullYear(),
    isPublic: initialData?.is_public || false,
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await createOrUpdateDocument(formData, initialData?.id);
    
    if (result.success) {
      setStatusMessage({ type: 'success', message: result.message });
      if (!initialData?.id) {
         router.push('/admin/document');
      }
      router.refresh();
    } else {
      setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm('Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }

    setLoading(true);
    const result = await deleteDocument(initialData.id);

    if (result.success) {
        setStatusMessage({ type: 'success', message: result.message });
        router.push('/admin/document');
    } else {
        setStatusMessage({ type: 'error', message: result.message });
    }
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-baznas-green-dark">
        {initialData ? 'Edit Dokumen' : 'Unggah Dokumen Baru'}
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Dokumen</label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>
      
      {/* Type & Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe Dokumen</label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
            >
              {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
        </div>
        <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Tahun</label>
            <input
              id="year"
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
            />
        </div>
      </div>

      {/* Document URL (Placeholder for file upload) */}
      <div>
        <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700">URL Dokumen (Link ke PDF/File)</label>
        <input
          id="documentUrl"
          type="url"
          required
          value={formData.documentUrl}
          onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
          placeholder="e.g., https://bucket.supabase.co/storage/v1/object/public/file.pdf"
        />
        <p className="text-xs text-gray-500 mt-1">Gunakan link dari Supabase Storage atau layanan penyimpanan file lainnya.</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat (Opsional)</label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-baznas-green focus:ring-baznas-green"
        />
      </div>

      {/* Public Checkbox */}
      <div className="flex items-center">
        <input
          id="isPublic"
          type="checkbox"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="h-4 w-4 text-baznas-green border-gray-300 rounded focus:ring-baznas-green"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-700">
          Publikasikan Dokumen (Tampil di halaman Transparansi)
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
          {initialData ? (loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan') : (loading ? 'Mengunggah Dokumen...' : 'Unggah Dokumen')}
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
            {loading ? 'Menghapus...' : 'Hapus Dokumen'}
          </button>
        )}
      </div>
    </form>
  );
}