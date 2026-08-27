// components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-baznas-green/5 pt-12 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:order-1">
            <h1 className="text-4xl md:text-6xl font-extrabold text-baznas-green-dark leading-tight mb-4">
              Zakat Anda, Manfaat untuk Sesama
            </h1>
            <p className="text-lg md:text-xl text-baznas-neutral mb-8">
              BAZNAS Kabupaten Boven Digoel hadir untuk mengelola zakat, infak, dan sedekah secara amanah, profesional, transparan, dan tepat sasaran.
            </p>
            
            {/* CTAs */}
            <div className="flex space-x-4">
              <Link
                href="/layanan/bayar-zakat"
                className="px-6 py-3 text-lg font-semibold rounded-full shadow-lg text-white bg-baznas-gold hover:bg-yellow-600 transition-colors"
              >
                Tunaikan Zakat
              </Link>
              <Link
                href="/program"
                className="px-6 py-3 text-lg font-semibold rounded-full shadow-lg text-baznas-green-dark border-2 border-baznas-green-dark hover:bg-baznas-green-dark hover:text-white transition-colors"
              >
                Lihat Program
              </Link>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="md:order-2">
            <div className="w-full aspect-video bg-gray-200 rounded-lg shadow-xl flex items-center justify-center text-gray-500 font-medium">
              HERO IMAGE PLACEHOLDER (Kegiatan Lokal BAZNAS)
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}