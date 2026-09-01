// src/components/PublicNavbar.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './ui/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Menu, X, ArrowRight, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
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
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, role, isAdmin, isLoggedIn, loading, handleLogout } = useAuthSession();
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
    const userInitial = (user?.user_metadata?.full_name || user?.email || "A").charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-50 w-full h-20 bg-white/95 dark:bg-[#051808]/95 backdrop-blur-md border-b border-[#bfc9c0]/30 transition-colors">
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
                                        ? 'text-primary dark:text-[#ffe088] border-b-2 border-primary dark:border-[#ffe088] font-bold'
                                        : 'text-[#3f4942] dark:text-zinc-300 hover:text-primary dark:hover:text-white'
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
                        className="hidden sm:inline-flex items-center gap-2 bg-[#075C3B] hover:bg-[#004229] active:scale-[0.98] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] focus-visible:ring-offset-2"
                    >
                        <span>Tunaikan Zakat</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Circular Profile Avatar Button & Dropdown */}
                    <div className="relative hidden md:block" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            title={isLoggedIn ? (user?.user_metadata?.full_name || user?.email || "Akun Saya") : "Masuk / Login"}
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[#004229]/10 dark:bg-emerald-500/20 text-primary dark:text-[#ffe088] border border-[#004229]/20 dark:border-[#ffe088]/30 flex items-center justify-center font-bold text-xs transition-all hover:scale-105 hover:border-[#075C3B] active:scale-95 shadow-sm overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] focus-visible:ring-offset-2 cursor-pointer"
                            aria-expanded={isProfileOpen}
                            aria-label={isLoggedIn ? "Menu akun pengguna" : "Masuk / Login"}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-[#004229] dark:border-[#8cd6ac] border-t-transparent rounded-full animate-spin" />
                            ) : isLoggedIn ? (
                                avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={user?.user_metadata?.full_name || user?.email || "Foto Profil"}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover rounded-full"
                                        unoptimized
                                    />
                                ) : (
                                    <span>{userInitial}</span>
                                )
                            ) : (
                                <User className="w-4 h-4 text-primary dark:text-[#ffe088]" />
                            )}
                        </button>

                        {/* Dropdown Popover */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xl py-2 z-50 font-jakarta animate-in fade-in zoom-in-95 duration-150">
                                {isLoggedIn ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                                            {avatarUrl ? (
                                                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 shadow-sm">
                                                    <Image
                                                        src={avatarUrl}
                                                        alt={user?.user_metadata?.full_name || user?.email || "Foto Profil"}
                                                        width={36}
                                                        height={36}
                                                        className="w-full h-full object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-[#004229]/10 dark:bg-emerald-500/20 text-primary dark:text-[#ffe088] font-bold text-xs flex items-center justify-center shrink-0 border border-[#004229]/20">
                                                    {userInitial}
                                                </div>
                                            )}
                                            <div className="overflow-hidden flex-1">
                                                <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate">
                                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                                </p>
                                                <p className="text-[11px] text-[#5B6470] dark:text-zinc-400 truncate mt-0.5">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-1.5 space-y-0.5">
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1F2937] dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                                                    <span>Buka Panel Admin</span>
                                                </Link>
                                            )}

                                            <Link
                                                href="/akun"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1F2937] dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                            >
                                                <User className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                                                <span>Akun & Profil Saya</span>
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Keluar</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-1.5">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-primary dark:text-[#ffe088] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors"
                                        >
                                            <LogIn className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                                            <span>Masuk / Login</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] transition-all cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                        aria-expanded={isMenuOpen}
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
                <div className="p-5 space-y-2 max-h-[calc(100dvh-5rem)] overflow-y-auto">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    'flex items-center min-h-[44px] px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.99]',
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
                            className="flex items-center justify-center gap-2 w-full min-h-[44px] bg-[#075C3B] hover:bg-[#004229] active:scale-[0.98] text-white py-3 rounded-xl text-sm font-semibold shadow-sm transition-all"
                        >
                            <span>Tunaikan Zakat</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                    {avatarUrl ? (
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
                                            <Image
                                                src={avatarUrl}
                                                alt={user?.user_metadata?.full_name || user?.email || "Foto Profil"}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#075C3B]/10 text-[#075C3B] font-bold text-sm flex items-center justify-center shrink-0">
                                            {userInitial}
                                        </div>
                                    )}
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                        </p>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl bg-[#075C3B]/10 text-[#075C3B] dark:text-[#8cd6ac] text-sm font-bold"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Buka Panel Admin</span>
                                    </Link>
                                )}

                                <Link
                                    href="/akun"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-on-surface text-sm font-bold"
                                >
                                    <User className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac]" />
                                    <span>Akun & Profil Saya</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-red-600 dark:text-red-400 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                            >
                                <LogIn className="w-4 h-4 text-[#075C3B]" />
                                <span>Login Staff / Admin</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
