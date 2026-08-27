// app/admin/page.tsx
import { Metadata } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard - CMS BAZNAS Boven Digoel',
  description: 'Area administrasi konten website BAZNAS Kabupaten Boven Digoel.',
};

export default async function AdminDashboardPage() {
  // Workaround for non-standard local build environment: use await cookies()
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-baznas-green-dark">Selamat Datang, Admin!</h1>
        <LogoutButton />
      </div>
      
      <p className="text-lg mb-4">Anda login sebagai: <span className="font-semibold">{user?.email}</span></p>

      {/* CMS Quick Links */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          href="/admin/news" 
          className="p-6 bg-white border-l-4 border-baznas-green-dark shadow-md hover:shadow-lg rounded-lg transition-shadow block"
        >
          <h3 className="text-xl font-bold text-baznas-green-dark">Manajemen Berita</h3>
          <p className="text-sm text-baznas-neutral/80">Buat, edit, dan publikasikan artikel dan berita terkini.</p>
        </Link>
        <Link 
          href="/admin/program" 
          className="p-6 bg-white border-l-4 border-baznas-green-dark shadow-md hover:shadow-lg rounded-lg transition-shadow block"
        >
          <h3 className="text-xl font-bold text-baznas-green-dark">Manajemen Program</h3>
          <p className="text-sm text-baznas-neutral/80">Buat, edit, dan publikasikan program kegiatan BAZNAS.</p>
        </Link>
        <Link 
          href="/admin/document" 
          className="p-6 bg-white border-l-4 border-baznas-green-dark shadow-md hover:shadow-lg rounded-lg transition-shadow block"
        >
          <h3 className="text-xl font-bold text-baznas-green-dark">Laporan & Dokumen</h3>
          <p className="text-sm text-baznas-neutral/80">Kelola laporan transparansi, tahunan, dan dokumen publik lainnya.</p>
        </Link>
      </div>
      {/* End CMS Quick Links */}
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-baznas-gold">
        <h2 className="text-2xl font-semibold mb-3">Status Proyek (MVP)</h2>
        <ul className="list-disc list-inside space-y-2 text-baznas-neutral">
          <li>Database Schema Publik sudah siap.</li>
          <li>Autentikasi Next.js Server Side sudah dikonfigurasi.</li>
          <li>Admin Dashboard sudah dilindungi.</li>
          <li>Sistem login dan logout sudah berfungsi.</li>
          <li>Manajemen Berita (CRUD) selesai.</li>
          <li>Manajemen Program (CRUD) selesai.</li>
          <li>**Manajemen Dokumen (CRUD) selesai.**</li>
        </ul>
      </div>
    </div>
  );
}
