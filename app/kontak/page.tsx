import PlaceholderPage from "@/components/PlaceholderPage";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Kontak - BAZNAS Boven Digoel" };

export default function KontakPage() {
  return (
    <PlaceholderPage
      title="Kontak Kami"
      description="Informasi alamat, telepon, dan kontak resmi BAZNAS Kabupaten Boven Digoel."
    />
  );
}