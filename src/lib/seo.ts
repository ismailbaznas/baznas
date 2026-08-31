// src/lib/seo.ts
// Centralized SEO configuration, metadata helpers, and JSON-LD structured data generators

export const SITE_CONFIG = {
  name: "BAZNAS Kabupaten Boven Digoel",
  shortName: "BAZNAS Boven Digoel",
  formalName: "Badan Amil Zakat Nasional Kabupaten Boven Digoel",
  tagline: "Amanah, Transparan, dan Profesional",
  description:
    "Portal resmi Badan Amil Zakat Nasional (BAZNAS) Kabupaten Boven Digoel, Papua Selatan. Melayani penghimpunan dan penyaluran Zakat, Infak, dan Sedekah secara amanah, transparan, dan profesional untuk kemandirian umat.",
  keywords: [
    "BAZNAS",
    "BAZNAS Boven Digoel",
    "Badan Amil Zakat Nasional",
    "Zakat Boven Digoel",
    "Infak Boven Digoel",
    "Sedekah Boven Digoel",
    "Kalkulator Zakat",
    "Tanah Merah Papua Selatan",
    "Mustahik Boven Digoel",
    "ZIS Papua Selatan",
    "Pemberdayaan Umat Boven Digoel",
    "Transparansi BAZNAS",
  ],
  address: {
    street: "Jl. Trans Papua KM. 2",
    district: "Tanah Merah",
    regency: "Kabupaten Boven Digoel",
    province: "Papua Selatan",
    postalCode: "99664",
    country: "ID",
    formatted: "Jl. Trans Papua KM. 2, Tanah Merah, Boven Digoel, Papua Selatan 99664",
  },
  contact: {
    phone: "+62 812 3456 7890",
    email: "bovendigoel@baznas.go.id",
    openingHours: "Mo-Fr 08:00-16:00 WIT",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
  geo: {
    latitude: -6.0967,
    longitude: 140.2975,
    region: "ID-PA",
    placename: "Tanah Merah, Boven Digoel",
  },
};

/**
 * Resolves the canonical base URL safely across Localhost, Preview, and Production deployments.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_ADMIN_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://baznas-bvd.vercel.app";
}

/**
 * Helper to construct an absolute URL from a relative path.
 */
export function absoluteUrl(path: string = "/"): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generates Organization & GovernmentOrganization / NGO Structured Data (JSON-LD)
 */
export function getOrganizationJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${baseUrl}/#organization`,
    name: SITE_CONFIG.formalName,
    alternateName: [SITE_CONFIG.name, SITE_CONFIG.shortName, "BAZNAS BVD"],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/logo-baznas.png`,
      caption: SITE_CONFIG.formalName,
    },
    image: `${baseUrl}/images/visual_concept.png`,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.district,
      addressRegion: SITE_CONFIG.address.province,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.contact.phone,
        contactType: "customer service",
        email: SITE_CONFIG.contact.email,
        areaServed: "ID",
        availableLanguage: ["id"],
      },
    ],
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.tiktok,
    ].filter(Boolean),
  };
}

/**
 * Generates WebSite Structured Data (JSON-LD)
 */
export function getWebSiteJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.formalName,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "id-ID",
  };
}

/**
 * Generates BreadcrumbList Structured Data (JSON-LD)
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

/**
 * Generates NewsArticle Structured Data (JSON-LD)
 */
export function getNewsArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  category,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  datePublished: string;
  dateModified?: string | null;
  category?: string;
}) {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
    : `${baseUrl}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    headline: title,
    description: description,
    image: [fullImageUrl],
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    articleSection: category || "Berita",
    inLanguage: "id-ID",
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.formalName,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.formalName,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo-baznas.png`,
      },
    },
  };
}

/**
 * Generates WebPage / ItemPage Structured Data for Programs
 */
export function getProgramJsonLd({
  title,
  description,
  url,
  imageUrl,
  category,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  category?: string;
}) {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
    : `${baseUrl}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": fullUrl,
    name: title,
    description: description,
    serviceType: category || "Program Pendayagunaan ZIS",
    provider: {
      "@type": "GovernmentOrganization",
      name: SITE_CONFIG.formalName,
      url: baseUrl,
    },
    image: fullImageUrl,
    url: fullUrl,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Kabupaten Boven Digoel, Papua Selatan",
    },
  };
}
