// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use the server client to check the user's session
  const supabase = createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to login page
  if (!session) {
    redirect('/login');
  }
  
  // TODO: Add Role-Based Access Control (RBAC) check here later
  // For MVP, anyone who can log in is considered 'Admin'.

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* TODO: Admin Sidebar Navigation */}
      <div className="w-64 bg-baznas-green-dark p-6 text-white">
        <h2 className="text-xl font-bold border-b border-baznas-gold pb-3 mb-6">CMS BAZNAS BD</h2>
        {/* Placeholder for menu items */}
        <p className="hover:text-baznas-gold transition-colors cursor-pointer">Dashboard</p>
        <p className="hover:text-baznas-gold transition-colors cursor-pointer">Konten</p>
        <p className="hover:text-baznas-gold transition-colors cursor-pointer">Pengaturan</p>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow p-8">
        {children}
      </div>
    </div>
  );
}
