import PlaceholderPage from "@/components/PlaceholderPage";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Kabar Terkini - BAZNAS Boven Digoel" };

export default function KabarPage() {
  return (
    <PlaceholderPage
      title="Kabar Terkini"
      description="Berita terbaru, artikel, dan agenda kegiatan BAZNAS Kabupaten Boven Digoel."
    />
  );
}