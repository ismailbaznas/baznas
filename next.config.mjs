/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Using the new Next.js 16 format for external packages
  serverExternalPackages: ["@supabase/supabase-js", "sharp"], 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
