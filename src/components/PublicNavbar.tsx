// src/components/PublicNavbar.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import Logo from './ui/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { href: '/', label: 'Beranda' },
    { href: '/tentang', label: 'Tentang Kami' },
    { href: '/program', label: 'Program' },
    { href: '/kabar', label: 'Kabar' },
    { href: '/transparansi', label: 'Transparansi' },
    { href: '/layanan', label: 'Layanan' },
    { href: '/kontak', label: 'Kontak' },
];

export default function PublicNavbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-surface shadow-md">
            <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-body-md font-medium transition-colors hover:text-primary-dark',
                                pathname === link.href
                                    ? 'text-primary border-b-2 border-primary-dark'
                                    : 'text-on-surface-variant'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <Button variant="default" size="sm" asChild>
                        <Link href="/login" className='space-x-2'>
                            <User className='w-4 h-4' />
                            <span>Admin</span>
                        </Link>
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "fixed inset-x-0 top-16 bg-surface shadow-lg border-t border-surface-variant transition-transform duration-300 ease-in-out md:hidden z-30",
                isMenuOpen ? "translate-y-0" : "-translate-y-full"
            )}>
                <nav className="flex flex-col p-4 space-y-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                'block p-3 rounded-lg text-body-lg font-medium transition-colors hover:bg-primary/10',
                                pathname === link.href
                                    ? 'text-primary bg-primary/5'
                                    : 'text-on-surface'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
