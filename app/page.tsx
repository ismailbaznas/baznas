// app/page.tsx
import { Metadata } from "next";
import Link from 'next/link';
import { redirect } from 'next/navigation'; // Only one time

import Hero from "@/components/Hero";
import QuickServices from "@/components/QuickServices";
import TrustIndicators from "@/components/TrustIndicators";
import LatestNews from "@/components/LatestNews";
import AuthRedirectorWrapper from "@/components/AuthRedirectorWrapper"; // Use the wrapper

// Ensure metadata is set for the homepage
export const metadata: Metadata = {
  title: "Website Resmi BAZNAS Kabupaten Boven Digoel - Amanah, Profesional, Transparan",
  description: "Portal resmi Badan Amil Zakat Nasional Kabupaten Boven Digoel. Melayani pembayaran zakat, infak, dan sedekah (ZIS) serta menyalurkannya untuk program kesejahteraan umat.",
  // Add other SEO metadata later (canonical, og, etc.)
};

export default function Home() {
  
  return (
    <>
      <AuthRedirectorWrapper />
      {/* 1. Hero Section (PRD Section 7) */}
      <Hero />

      {/* 2. Quick Services (PRD Section 8) */}
      <QuickServices />

      {/* 3. Trust Indicators (PRD Section 9) */}
      <TrustIndicators />
      
      {/* 4. Kabar Terkini (PRD Section 11) - Server Component */}
      <LatestNews />

      {/* 5. Final CTA (PRD Section 15) */}
      <section className="py-16 bg-baznas-green-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-baznas-gold">
            Zakat Anda, Hadirkan Manfaat
          </h2>
          <p className="text-lg mb-8">
            Dukung program-program BAZNAS Boven Digoel untuk kesejahteraan umat.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/layanan/bayar-zakat"
              className="px-8 py-3 text-xl font-semibold rounded-full shadow-lg text-baznas-green-dark bg-baznas-gold hover:bg-yellow-400 transition-colors"
            >
              Tunaikan Zakat Sekarang
            </Link>
            <Link
              href="/layanan/konsultasi"
              className="px-8 py-3 text-xl font-semibold rounded-full shadow-lg text-white border-2 border-white hover:bg-white hover:text-baznas-green-dark transition-colors"
            >
              Konsultasi Zakat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
