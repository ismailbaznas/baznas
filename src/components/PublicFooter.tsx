"use client";

// src/components/PublicFooter.tsx

import React from 'react';
import Link from 'next/link';
import Logo from './ui/Logo';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function PublicFooter() {
    const { theme } = useTheme();

    // Placeholder data, should be fetched from site_settings table
    const siteSettings = {
        contact_phone: '+62-123-4567-890',
        contact_email: 'info@baznasbvd.or.id',
        address: 'Jl. Merdeka No. 1, Boven Digoel, Papua Selatan',
        social_facebook: '#',
        social_instagram: '#',
        social_twitter: '#',
    };

    return (
        <footer className="bg-surface-container-low text-on-surface pt-12 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-surface-variant pb-8">
                    {/* Section 1: Logo & Contact */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Logo className="text-2xl" />
                        <p className="text-sm text-on-surface-variant">
                            Badan Amil Zakat Nasional Kabupaten Boven Digoel. Amanah, Profesional, Transparan.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span>{siteSettings.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>{siteSettings.contact_phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span>{siteSettings.contact_email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Navigasi Cepat */}
                    <div>
                        <h3 className="font-semibold text-on-surface mb-3">Navigasi Cepat</h3>
                        <ul className="space-y-2 text-sm text-on-surface-variant">
                            <li><Link href="/program" className="hover:text-primary">Program Unggulan</Link></li>
                            <li><Link href="/kabar" className="hover:text-primary">Berita Terbaru</Link></li>
                            <li><Link href="/agenda" className="hover:text-primary">Agenda Kegiatan</Link></li>
                            <li><Link href="/transparansi" className="hover:text-primary">Laporan & Dokumen</Link></li>
                        </ul>
                    </div>

                    {/* Section 3: Layanan Zakat */}
                    <div>
                        <h3 className="font-semibold text-on-surface mb-3">Layanan Zakat</h3>
                        <ul className="space-y-2 text-sm text-on-surface-variant">
                            <li><Link href="/layanan/bayar-zakat" className="hover:text-primary">Tunaikan Zakat</Link></li>
                            <li><Link href="/layanan/rekening" className="hover:text-primary">Info Rekening Resmi</Link></li>
                            <li><Link href="/kontak" className="hover:text-primary">Konsultasi Zakat</Link></li>
                            <li><Link href="/layanan/mustahik" className="hover:text-primary">Layanan Mustahik</Link></li>
                        </ul>
                    </div>

                    {/* Section 4: Social & Settings */}
                    <div>
                        <h3 className="font-semibold text-on-surface mb-3">Ikuti Kami</h3>
                        <div className="flex space-x-4">
                            <a href={siteSettings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary"><Facebook className="w-6 h-6" /></a>
                            <a href={siteSettings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary"><Instagram className="w-6 h-6" /></a>
                            <a href={siteSettings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary"><Twitter className="w-6 h-6" /></a>
                        </div>

                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold text-on-surface">Pengaturan Tampilan</h3>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="mt-4 text-center text-xs text-on-surface-variant">
                    &copy; {new Date().getFullYear()} BAZNAS Kabupaten Boven Digoel. Hak Cipta Dilindungi. | 
                    <Link href="/privacy" className='ml-1 hover:underline'>Kebijakan Privasi</Link>
                </div>
            </div>
        </footer>
    );
}
