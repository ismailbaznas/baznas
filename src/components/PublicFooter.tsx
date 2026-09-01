// src/components/PublicFooter.tsx
// Pure Server Component - Zero Client Fetch, Zero Waterfall, Dynamic + Fallback Ready

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Facebook, Instagram } from 'lucide-react';

export interface BankAccountItem {
  id: string;
  nama_bank: string;
  nomor_rekening: string;
  atas_nama: string;
  kategori?: string | null;
}

export interface QuickLinkItem {
  id: string;
  label: string;
  url: string;
  sort_order?: number | null;
}

export interface FooterContacts {
  address?: string;
  phone?: string;
  email?: string;
}

export interface FooterSocials {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface PublicFooterProps {
  bankAccounts?: BankAccountItem[];
  quickLinks?: QuickLinkItem[];
  contacts?: FooterContacts;
  socials?: FooterSocials;
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

export default function PublicFooter({
  bankAccounts,
  quickLinks,
  contacts,
  socials,
}: PublicFooterProps = {}) {
  const accountsToRender = bankAccounts && bankAccounts.length > 0 ? bankAccounts : DEFAULT_ACCOUNTS;
  const linksToRender = quickLinks && quickLinks.length > 0 ? quickLinks : DEFAULT_LINKS;
  const contactAddress = contacts?.address || DEFAULT_CONTACTS.address!;
  const contactPhone = contacts?.phone || DEFAULT_CONTACTS.phone!;
  const contactEmail = contacts?.email || DEFAULT_CONTACTS.email!;
  const socialFacebook = socials?.facebook || "https://facebook.com";
  const socialInstagram = socials?.instagram || "https://instagram.com";
  const socialTiktok = socials?.tiktok || "https://tiktok.com";

  return (
    <footer className="w-full pt-16 pb-12 bg-[#004229] dark:bg-[#031407] text-white transition-colors border-t border-emerald-900/50">
      <div className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Emblem Logo & Social */}
          <div className="flex flex-col items-start">
            <Image 
              alt="BAZNAS Kabupaten Boven Digoel" 
              className="h-28 md:h-32 w-auto mb-6 object-contain" 
              src="/images/logo-white.png"
              width={140}
              height={120}
            />
            <p className="text-xs text-white/70 mb-5 leading-relaxed">
              Badan Amil Zakat Nasional Kabupaten Boven Digoel. Menguatkan masyarakat melalui tata kelola zakat yang amanah, transparan, dan profesional.
            </p>
            <div className="flex gap-3">
              {socialFacebook && (
                <a 
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004229]" 
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook BAZNAS Boven Digoel"
                  title="Facebook BAZNAS Boven Digoel"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialInstagram && (
                <a 
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004229]" 
                  href={socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram BAZNAS Boven Digoel"
                  title="Instagram BAZNAS Boven Digoel"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialTiktok && (
                <a 
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004229]" 
                  href={socialTiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok BAZNAS Boven Digoel"
                  title="TikTok BAZNAS Boven Digoel"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Kantor Kami */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs border-b border-white/10 pb-2">
              KANTOR KAMI
            </h4>
            <ul className="space-y-3.5 text-xs text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ffe088] shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ffe088] shrink-0" />
                <a 
                  href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                >
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ffe088] shrink-0" />
                <a 
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white hover:underline transition-colors"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#ffe088] shrink-0 mt-0.5" />
                <span>Senin - Jumat<br />08.00 - 16.00 WIT</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Tautan Cepat */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs border-b border-white/10 pb-2">
              TAUTAN CEPAT
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              {linksToRender.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="hover:text-white hover:underline transition-colors block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Rekening Resmi */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs border-b border-white/10 pb-2">
              REKENING RESMI
            </h4>
            <ul className="space-y-3.5 text-xs text-white/80">
              {accountsToRender.map((acc) => (
                <li key={acc.id} className="flex flex-col bg-white/5 p-2 rounded border border-white/10">
                  <span className="font-bold text-white tracking-wide">
                    {(acc.nama_bank || "").split('(')[0].trim()} {acc.nomor_rekening}
                  </span>
                  <span className="text-[11px] text-[#ffe088] truncate max-w-full">
                    a.n. {acc.atas_nama}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-white/60 italic">
              Pastikan rekening tujuan adalah rekening resmi BAZNAS Kabupaten Boven Digoel.
            </p>
          </div>

          {/* Column 5: Legalitas & Audited */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs border-b border-white/10 pb-2">
              LEGALITAS
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 mb-6">
              <li><Link href="/transparansi" className="hover:text-white hover:underline transition-colors block">SK BAZNAS</Link></li>
              <li><Link href="/transparansi" className="hover:text-white hover:underline transition-colors block">Kesepakatan BAZNAS</Link></li>
              <li><Link href="/kontak" className="hover:text-white hover:underline transition-colors block">Kebijakan Privasi</Link></li>
              <li><Link href="/kontak" className="hover:text-white hover:underline transition-colors block">Syarat & Ketentuan</Link></li>
            </ul>
            <div className="flex items-center gap-3 border border-white/20 p-3.5 rounded-lg bg-white/5">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0" />
              <div className="text-[10px] uppercase font-bold tracking-wider leading-tight text-white/90">
                Audited<br />Syariah
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 gap-4">
          <p>© 2026 BAZNAS Kabupaten Boven Digoel. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="footer" showLabel={true} />
          </div>
        </div>
      </div>
    </footer>
  );
}
