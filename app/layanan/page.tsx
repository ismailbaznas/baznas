import PlaceholderPage from "@/components/PlaceholderPage";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Layanan - BAZNAS Boven Digoel" };

export default function LayananPage() {
  return (
    <PlaceholderPage
      title="Layanan"
      description="Akses mudah untuk Bayar Zakat, Informasi Rekening, Konsultasi, Layanan Mustahik, dan Pengaduan."
    />
  );
}