import { Inter, Space_Grotesk, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import JsonLd from "@/components/seo/JsonLd";
import PwaRegister from "@/components/pwa/PwaRegister";
import { SITE_CONFIG, getBaseUrl, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo";

// Setup Fonts as per Visual Concept Blueprint with display: 'swap' for non-blocking render
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BAZNAS Boven Digoel",
  },
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
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
        url: "/og.png",
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
    images: ["/og.png"],
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
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
      </head>
      <body className="font-jakarta bg-background text-on-background min-h-screen antialiased">
        <PwaRegister />
        <ThemeProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
