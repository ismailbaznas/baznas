import PlaceholderPage from "@/components/PlaceholderPage";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Program - BAZNAS Boven Digoel" };

export default function ProgramPage() {
  return (
    <PlaceholderPage
      title="Program Kami"
      description="Program unggulan BAZNAS Kabupaten Boven Digoel di bidang Pendidikan, Kesehatan, Ekonomi, Kemanusiaan, dan Keagamaan."
    />
  );
}