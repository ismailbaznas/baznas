// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-baznas-green text-white mt-12 border-t-8 border-baznas-gold">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Section 1: Logo & Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-baznas-gold">BAZNAS Kabupaten Boven Digoel</h3>
            <p className="text-sm">
              Alamat: <span className="font-semibold">TODO: ALAMAT LENGKAP</span><br />
              Telepon: <span className="font-semibold">TODO: NOMOR TELEPON</span><br />
              Email: <span className="font-semibold">TODO: EMAIL RESMI</span>
            </p>
            {/* Social Media Placeholder */}
            <div className="flex space-x-4 mt-4">
              <span className="text-sm">TODO: Social Icons</span>
            </div>
          </div>

          {/* Section 2: Navigasi */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-baznas-gold/50 pb-1">Navigasi Utama</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tentang" className="hover:text-baznas-gold">Tentang Kami</Link></li>
              <li><Link href="/program" className="hover:text-baznas-gold">Program</Link></li>
              <li><Link href="/kabar" className="hover:text-baznas-gold">Kabar</Link></li>
              <li><Link href="/kontak" className="hover:text-baznas-gold">Kontak</Link></li>
            </ul>
          </div>

          {/* Section 3: Layanan & Transparansi */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-baznas-gold/50 pb-1">Layanan & Data</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/layanan/bayar-zakat" className="hover:text-baznas-gold">Bayar Zakat</Link></li>
              <li><Link href="/layanan/informasi-rekening" className="hover:text-baznas-gold">Informasi Rekening</Link></li>
              <li><Link href="/transparansi" className="hover:text-baznas-gold">Laporan Transparansi</Link></li>
              <li><Link href="/layanan/pengaduan" className="hover:text-baznas-gold">Pengaduan Masyarakat</Link></li>
            </ul>
          </div>

          {/* Section 4: Legalitas */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-baznas-gold/50 pb-1">Legalitas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tentang/legalitas" className="hover:text-baznas-gold">Dokumen Legalitas</Link></li>
              <li><Link href="/transparansi/dokumen-publik" className="hover:text-baznas-gold">Dokumen Publik Lainnya</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-baznas-green-dark py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {currentYear} BAZNAS Kabupaten Boven Digoel. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}