// components/QuickServices.tsx
import Link from 'next/link';

// Using simple placeholders for icons for now
const services = [
  { title: 'Tunaikan Zakat', description: 'Hitung dan bayar ZIS Anda dengan mudah dan aman.', href: '/layanan/bayar-zakat', icon: '💰' },
  { title: 'Konsultasi Zakat', description: 'Dapatkan fatwa dan panduan resmi tentang Zakat, Infak, dan Sedekah.', href: '/layanan/konsultasi', icon: '💬' },
  { title: 'Layanan Mustahik', description: 'Pengajuan permohonan bantuan bagi yang berhak menerima (Mustahik).', href: '/layanan/mustahik', icon: '🤲' },
  { title: 'Pengaduan', description: 'Sampaikan kritik, saran, atau laporan terkait BAZNAS.', href: '/layanan/pengaduan', icon: '📢' },
];

export default function QuickServices() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-baznas-green-dark mb-10">
          Layanan Cepat Kami
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link 
              key={service.title} 
              href={service.href} 
              className="group block p-6 bg-white border-2 border-baznas-green/20 rounded-xl shadow-lg hover:shadow-xl hover:border-baznas-gold transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start">
                <span className="text-4xl text-baznas-gold mr-4 transition-transform group-hover:scale-110">
                  {service.icon}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-baznas-green-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-baznas-neutral">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}