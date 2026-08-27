// app/login/page.tsx
import { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Login - CMS BAZNAS Boven Digoel',
  description: 'Halaman login untuk CMS BAZNAS Kabupaten Boven Digoel.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
}