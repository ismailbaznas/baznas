import { Inter, Space_Grotesk, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

// Setup Fonts as per Visual Concept Blueprint
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

// Base Metadata (Simplified from AGENTS.md)
export const metadata: Metadata = {
  title: "Website Resmi BAZNAS Kabupaten Boven Digoel",
  description:
    "Portal resmi Badan Amil Zakat Nasional Kabupaten Boven Digoel. Amanah, Profesional, dan Transparan.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} ${jakarta.variable}`}
      // Suppress warning about custom attributes on html tag for theme initialization
      suppressHydrationWarning
    >
      <body className="font-jakarta bg-background text-on-background min-h-screen antialiased">
        <ThemeProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
