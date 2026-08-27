import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BAZNAS Kabupaten Boven Digoel | Website Resmi",
  description: "Website resmi Badan Amil Zakat Nasional (BAZNAS) Kabupaten Boven Digoel. Mengelola ZIS secara amanah, profesional, dan transparan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-baznas-neutral antialiased flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
