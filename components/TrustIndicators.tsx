// components/TrustIndicators.tsx
// Displays placeholder statistics as per PRD Section 9: "JANGAN mengarang angka. Gunakan placeholder atau sembunyikan statistik."

const stats = [
  { label: 'ZIS Terhimpun', value: 'Rp 0,-', description: 'Januari - Desember 2026' },
  { label: 'ZIS Tersalurkan', value: 'Rp 0,-', description: 'Disalurkan kepada Mustahik' },
  { label: 'Penerima Manfaat', value: '0', description: 'Total Mustahik yang Dibantu' },
  { label: 'Program Berjalan', value: '0', description: 'Jumlah Program Aktif' },
];

export default function TrustIndicators() {
  return (
    <section className="py-12 bg-gray-50 border-t border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-baznas-neutral mb-8">
          Transparansi & Akuntabilitas (Placeholder Data)
        </h2>
        <p className="text-center text-sm text-red-500 mb-10">
          *Statistik di bawah ini adalah placeholder. Angka sebenarnya akan ditampilkan setelah data dari Supabase tersedia.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-lg shadow-md border-t-4 border-baznas-gold">
              <p className="text-3xl md:text-5xl font-extrabold text-baznas-green-dark mb-1">
                {stat.value}
              </p>
              <h3 className="text-lg font-semibold text-baznas-neutral mb-1">
                {stat.label}
              </h3>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}