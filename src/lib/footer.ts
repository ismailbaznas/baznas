// src/lib/footer.ts
// Server-side footer data resolver for RootLayout & Public Pages

import { createPublicServerSupabase } from "./server-supabase";
import { BankAccountItem, QuickLinkItem, FooterContacts, FooterSocials } from "@/components/PublicFooter";

export interface FooterData {
  bankAccounts: BankAccountItem[];
  quickLinks: QuickLinkItem[];
  contacts: FooterContacts;
  socials: FooterSocials;
}

const DEFAULT_ACCOUNTS: BankAccountItem[] = [
  { id: "ba-1", nama_bank: "BSI", nomor_rekening: "7123456789", atas_nama: "BAZNAS Boven Digoel" },
  { id: "ba-2", nama_bank: "Bank Papua", nomor_rekening: "1020201004567", atas_nama: "BAZNAS Boven Digoel" },
  { id: "ba-3", nama_bank: "BRI", nomor_rekening: "012301004567890", atas_nama: "BAZNAS Boven Digoel" }
];

const DEFAULT_LINKS: QuickLinkItem[] = [
  { id: "ql-1", label: "Tentang Kami", url: "/tentang" },
  { id: "ql-2", label: "Program Unggulan", url: "/program" },
  { id: "ql-3", label: "Transparansi & Laporan", url: "/transparansi" },
  { id: "ql-4", label: "Layanan Zakat", url: "/layanan" },
  { id: "ql-5", label: "Kabar & Berita", url: "/kabar" },
  { id: "ql-6", label: "Kontak & Layanan", url: "/kontak" }
];

const DEFAULT_CONTACTS: FooterContacts = {
  address: "Jl. Trans Papua KM. 2, Tanah Merah, Boven Digoel, Papua Selatan 99664",
  phone: "+62 812 3456 7890",
  email: "bovendigoel@baznas.go.id"
};

const DEFAULT_SOCIALS: FooterSocials = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com"
};

/**
 * Fetches dynamic footer data using the public stateless Supabase client.
 * Safe for build-time static generation and runtime SSR without cookie overhead.
 */
export async function getFooterData(): Promise<FooterData> {
  try {
    const supabase = createPublicServerSupabase();

    // 1. PRIMARY: Try reading from unified view (1 single query)
    const { data: viewData, error: viewError } = await (supabase
      .from("view_homepage_data" as any) as any)
      .select("bank_accounts, quick_links, settings")
      .maybeSingle();

    if (!viewError && viewData) {
      const payload = viewData as any;
      const settings = (payload.settings as Record<string, string>) || {};

      return {
        bankAccounts: payload.bank_accounts && payload.bank_accounts.length > 0
          ? payload.bank_accounts
          : DEFAULT_ACCOUNTS,
        quickLinks: payload.quick_links && payload.quick_links.length > 0
          ? payload.quick_links
          : DEFAULT_LINKS,
        contacts: {
          address: settings.contact_address || DEFAULT_CONTACTS.address,
          phone: settings.contact_phone || DEFAULT_CONTACTS.phone,
          email: settings.contact_email || DEFAULT_CONTACTS.email,
        },
        socials: {
          facebook: settings.social_facebook || DEFAULT_SOCIALS.facebook,
          instagram: settings.social_instagram || DEFAULT_SOCIALS.instagram,
          tiktok: settings.social_tiktok || DEFAULT_SOCIALS.tiktok,
        },
      };
    }

    // 2. FALLBACK: Parallel queries if view is not yet created in Supabase
    const [
      { data: accountsData },
      { data: linksData },
      { data: settingsData }
    ] = await Promise.all([
      (supabase.from("bank_accounts") as any).select("*").eq("status", "active").order("created_at", { ascending: true }),
      (supabase.from("quick_links") as any).select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      (supabase.from("site_settings") as any).select("*").in("key", [
        "social_facebook",
        "social_instagram",
        "social_tiktok",
        "contact_address",
        "contact_phone",
        "contact_email"
      ])
    ]);

    const settingsMap: Record<string, string> = {};
    if (settingsData) {
      settingsData.forEach((item: any) => {
        const val = item.value && typeof item.value === "object" && "value" in item.value
          ? item.value.value
          : item.value;
        if (val) settingsMap[item.key] = String(val);
      });
    }

    return {
      bankAccounts: accountsData && accountsData.length > 0 ? accountsData : DEFAULT_ACCOUNTS,
      quickLinks: linksData && linksData.length > 0 ? linksData : DEFAULT_LINKS,
      contacts: {
        address: settingsMap.contact_address || DEFAULT_CONTACTS.address,
        phone: settingsMap.contact_phone || DEFAULT_CONTACTS.phone,
        email: settingsMap.contact_email || DEFAULT_CONTACTS.email,
      },
      socials: {
        facebook: settingsMap.social_facebook || DEFAULT_SOCIALS.facebook,
        instagram: settingsMap.social_instagram || DEFAULT_SOCIALS.instagram,
        tiktok: settingsMap.social_tiktok || DEFAULT_SOCIALS.tiktok,
      },
    };
  } catch (error) {
    console.error("Error in getFooterData:", error);
    return {
      bankAccounts: DEFAULT_ACCOUNTS,
      quickLinks: DEFAULT_LINKS,
      contacts: DEFAULT_CONTACTS,
      socials: DEFAULT_SOCIALS,
    };
  }
}
