import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

// Setup Fonts as per Kemenhaj Pattern
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Base Metadata (Simplified from AGENTS.md)
export const metadata: Metadata = {
  title: "Website Resmi BAZNAS Kabupaten Boven Digoel",
  description:
    "Portal resmi Badan Amil Zakat Nasional Kabupaten Boven Digoel. Amanah, Profesional, dan Transparan.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "BAZNAS Kabupaten Boven Digoel",
    description:
      "Portal resmi Badan Amil Zakat Nasional Kabupaten Boven Digoel. Amanah, Profesional, dan Transparan.",
    url: "/",
    siteName: "BAZNAS Kabupaten Boven Digoel",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      // Suppress warning about custom attributes on html tag for theme initialization
      suppressHydrationWarning
    >
      <body className="font-inter bg-background text-on-background min-h-screen">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <PublicNavbar />
            <main className="flex-grow">{children}</main>
            <PublicFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
