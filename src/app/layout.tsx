import { Inter, Space_Grotesk, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, getBaseUrl, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#004229" },
    { media: "(prefers-color-scheme: dark)", color: "#031407" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Base Metadata
export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
    template: "%s — BAZNAS Kabupaten Boven Digoel",
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: getBaseUrl() }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.formalName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
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
    type: "website",
    locale: "id_ID",
    url: "./",
    title: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional",
    description: SITE_CONFIG.description,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebSiteJsonLd();

  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} ${jakarta.variable}`}
      // Suppress warning about custom attributes on html tag for theme initialization
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
      </head>
      <body className="font-jakarta bg-background text-on-background min-h-screen antialiased">
        <ThemeProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
