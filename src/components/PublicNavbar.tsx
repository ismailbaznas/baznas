// src/components/PublicNavbar.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './ui/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';

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
    const { isLoggedIn, loading, handleLogout } = useAuthSession();

    return (
        <header className="sticky top-0 z-50 w-full h-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-[#bfc9c0]/30 transition-colors">
            <div className="max-w-container-max mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between">
                {/* Brand Logo */}
                <Logo />

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-7">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-semibold transition-colors py-1 relative',
                                    isActive
                                        ? 'text-[#004229] dark:text-[#8cd6ac] border-b-2 border-[#004229] dark:border-[#8cd6ac] font-bold'
                                        : 'text-[#3f4942] dark:text-zinc-300 hover:text-[#004229] dark:hover:text-white'
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {/* Primary CTA Button */}
                    <Link
                        href="/layanan"
                        className="hidden sm:inline-flex items-center gap-2 bg-[#075C3B] hover:bg-[#004229] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow hover:opacity-95"
                    >
                        <span>Tunaikan Zakat</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Auth Button */}
                    {loading ? (
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 animate-pulse hidden md:block" />
                    ) : isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5 text-red-500" />
                            <span>Keluar</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            title="Login Admin"
                            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <User className="w-3.5 h-3.5 text-[#075C3B]" />
                            <span>Login</span>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-x-0 top-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xl transition-all duration-300 ease-in-out lg:hidden z-40",
                    isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                )}
            >
                <div className="p-5 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    'block px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                                    isActive
                                        ? 'bg-[#075C3B]/10 text-[#075C3B] dark:text-[#8cd6ac] font-bold'
                                        : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                        <Link
                            href="/layanan"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-[#075C3B] text-white py-3 rounded-lg text-sm font-semibold shadow-sm"
                        >
                            <span>Tunaikan Zakat</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-red-600 dark:text-red-400"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                            >
                                <User className="w-4 h-4 text-[#075C3B]" />
                                <span>Login Staff / Admin</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
