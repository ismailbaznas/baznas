// app/admin/page.tsx
import { Metadata } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import LogoutButton from '@/components/LogoutButton';

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

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-baznas-gold">
        <h2 className="text-2xl font-semibold mb-3">Status Proyek (MVP)</h2>
        <ul className="list-disc list-inside space-y-2 text-baznas-neutral">
          <li>Database Schema Publik sudah siap.</li>
          <li>Autentikasi Next.js Server Side sudah dikonfigurasi.</li>
          <li>Admin Dashboard sudah dilindungi.</li>
          <li>Sistem login dan logout sudah berfungsi.</li>
        </ul>
      </div>
    </div>
  );
}
