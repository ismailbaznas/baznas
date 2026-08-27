// components/Header.tsx
import Link from 'next/link';

// Main navigation links based on PRD Section 6
const navLinks = [
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/program', label: 'Program' },
  { href: '/kabar', label: 'Kabar' },
  { href: '/transparansi', label: 'Transparansi' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/kontak', label: 'Kontak' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Site Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-baznas-green-dark">
              BAZNAS Boven Digoel
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-baznas-neutral hover:text-baznas-green-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link 
              href="/layanan/bayar-zakat" 
              className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-baznas-green hover:bg-baznas-green-dark transition-colors"
            >
              Tunaikan Zakat
            </Link>
          </div>

          {/* Mobile Menu Button - Placeholder for now */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-baznas-green-dark hover:text-white hover:bg-baznas-green focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {/* Icon placeholder (e.g., Hamburger) */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu - Hidden for MVP */}
      {/* <div className="md:hidden" id="mobile-menu">...</div> */}
    </header>
  );
}