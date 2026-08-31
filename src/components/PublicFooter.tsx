// src/components/PublicFooter.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Facebook, Instagram } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase';

const DEFAULT_ACCOUNTS = [
  { id: "ba-1", nama_bank: "BSI", nomor_rekening: "7123456789", atas_nama: "BAZNAS Boven Digoel" },
  { id: "ba-2", nama_bank: "Bank Papua", nomor_rekening: "1020201004567", atas_nama: "BAZNAS Boven Digoel" },
  { id: "ba-3", nama_bank: "BRI", nomor_rekening: "012301004567890", atas_nama: "BAZNAS Boven Digoel" }
];

const DEFAULT_LINKS = [
  { id: "ql-1", label: "Tentang Kami", url: "/tentang" },
  { id: "ql-2", label: "Program Unggulan", url: "/program" },
  { id: "ql-3", label: "Transparansi & Laporan", url: "/transparansi" },
  { id: "ql-4", label: "Layanan Zakat", url: "/layanan" },
  { id: "ql-5", label: "Kabar & Berita", url: "/kabar" },
  { id: "ql-6", label: "Kontak & Layanan", url: "/kontak" }
];

export default function PublicFooter() {
    const [dbAccounts, setDbAccounts] = useState<any[]>(DEFAULT_ACCOUNTS);
    const [dbLinks, setDbLinks] = useState<any[]>(DEFAULT_LINKS);
    const [socials, setSocials] = useState<{ facebook: string; instagram: string; tiktok: string }>({
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        tiktok: "https://tiktok.com"
    });
    const [contacts, setContacts] = useState<{ address: string; phone: string; email: string }>({
        address: "Jl. Trans Papua KM. 2, Tanah Merah, Boven Digoel, Papua Selatan 99664",
        phone: "+62 812 3456 7890",
        email: "bovendigoel@baznas.go.id"
    });

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const supabase = getSupabaseBrowser();
                
                // Fetch in parallel
                const [
                    { data: accountsData },
                    { data: linksData },
                    { data: settingsData }
                ] = await Promise.all([
                    (supabase as any).from("bank_accounts").select("*").eq("status", "active").order("created_at", { ascending: true }),
                    (supabase as any).from("quick_links").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
                    (supabase as any).from("site_settings").select("*").in("key", [
                        "social_facebook", 
                        "social_instagram", 
                        "social_tiktok",
                        "contact_address",
                        "contact_phone",
                        "contact_email"
                    ])
                ]);

                if (accountsData && accountsData.length > 0) {
                    setDbAccounts(accountsData);
                }

                if (linksData && linksData.length > 0) {
                    setDbLinks(linksData);
                }

                if (settingsData && settingsData.length > 0) {
                    const newSocials = {
                        facebook: "https://facebook.com",
                        instagram: "https://instagram.com",
                        tiktok: "https://tiktok.com"
                    };
                    const newContacts = {
                        address: "Jl. Trans Papua KM. 2, Tanah Merah, Boven Digoel, Papua Selatan 99664",
                        phone: "+62 812 3456 7890",
                        email: "bovendigoel@baznas.go.id"
                    };

                    settingsData.forEach((item: any) => {
                        const val = item.value && typeof item.value === 'object' && 'value' in item.value 
                            ? item.value.value 
                            : item.value;
                        if (item.key === "social_facebook" && val) newSocials.facebook = val;
                        if (item.key === "social_instagram" && val) newSocials.instagram = val;
                        if (item.key === "social_tiktok" && val) newSocials.tiktok = val;
                        if (item.key === "contact_address" && val) newContacts.address = val;
                        if (item.key === "contact_phone" && val) newContacts.phone = val;
                        if (item.key === "contact_email" && val) newContacts.email = val;
                    });

                    setSocials(newSocials);
                    setContacts(newContacts);
                }
            } catch (err) {
                console.error("Error loading footer data:", err);
            }
        };

        loadFooterData();
    }, []);

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
                            {socials.facebook && (
                                <a 
                                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] transition-all" 
                                    href={socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    title="Facebook BAZNAS Boven Digoel"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                            )}
                            {socials.instagram && (
                                <a 
                                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] transition-all" 
                                    href={socials.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    title="Instagram BAZNAS Boven Digoel"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>
                            )}
                            {socials.tiktok && (
                                <a 
                                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#004229] transition-all" 
                                    href={socials.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
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
                                <span className="whitespace-pre-line leading-relaxed">{contacts.address}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-[#ffe088] shrink-0" />
                                <a 
                                    href={`https://wa.me/${contacts.phone.replace(/[^0-9]/g, "")}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-white hover:underline transition-colors"
                                >
                                    {contacts.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-[#ffe088] shrink-0" />
                                <a 
                                    href={`mailto:${contacts.email}`}
                                    className="hover:text-white hover:underline transition-colors"
                                >
                                    {contacts.email}
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
                            {dbLinks.map((link) => (
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
                            {dbAccounts.map((acc) => (
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
