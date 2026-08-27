import PlaceholderPage from "@/components/PlaceholderPage";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang Kami - BAZNAS Boven Digoel" };

export default function TentangPage() {
  return (
    <PlaceholderPage
      title="Tentang Kami"
      description="Profil, Visi, Misi, dan Legalitas BAZNAS Kabupaten Boven Digoel."
    />
  );
}