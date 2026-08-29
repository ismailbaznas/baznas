import React from "react";
import Image from "next/image";
import { 
  Quote, 
  ShieldAlert, 
  Award, 
  Eye, 
  Gavel, 
  CheckCircle, 
  User,
  Sparkles,
  Briefcase
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  photo_url?: string | null;
  sort_order?: number | null;
}

interface TentangClientProps {
  team: TeamMember[];
  settings?: Record<string, string>;
}

const FALLBACK_LEADERS: TeamMember[] = [
  {
    id: "fb-1",
    name: "Ketua BAZNAS",
    position: "Ketua",
    photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5qJPFsUyqaRN8-MCalC1QPpBz254TewWi6WN5N9SjMdLdyDZrniXYjYQ4vgeMgGsl4iusZ85l6fds0TuDGn9MZ-11C5tW20NPCNrDFjMvq5oxSiRBhf8lIpAzbjjMCoMioC6onfZuXyjqjo2XVo9oh7olIA6xQ8A_vUYBEoqNkmzC93eA_iplIOackCAJFZJrfeGLLd0k_TVmWFsdy03-zL1_WcwvGJw0q0Myi2EtvoEKMOfl2GI5",
  },
  {
    id: "fb-2",
    name: "Wakil Ketua I",
    position: "Bid. Pengumpulan",
    photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdKJ2Hk1B62MLXm7Uzt2cRb0N1kmPHw_1sEkWJs4E-fqTBeAAUBZ1EVwqY5uWjiqQgvuCLpBtNZ-JM98I6JofsuEwlVrTRMnsh2a9EwMO6xiWR3D9vNh9SxQ3ZQVz1CJE-ICKrq-Goqib77JBDulw5hKjdDs6J1s39IAg3L8lOQKaciTE6tDAXciaJnB_kvTIWVe3fW4K2Ir4FkH3x0VCFH8ffAdJpnl9GRURtgo5VZuG4Rog6afEu",
  },
  {
    id: "fb-3",
    name: "Wakil Ketua II",
    position: "Bid. Pendistribusian",
    photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRLX09X-KXUXzO6Nhm4ulQWLoeRCj8h0vI-aiT4y1UJSAuHgyV-URnnKk16xX9EuqeWTNORLZEv7IC-iJnpZ2xrlRYqZoU6i0N_QWxaIh--STQOxY50pOHtvDgmXAkU2daT0pOoG-zpYCQqVFFCfsyFsufl0kz3W7n20uN3LSbgjyL06dXwRm5RFMv3UNsMxSwjYrQk4qn0t1uw0pnwj1c5RIGalsITTSR_7HWsmN_SsVwPBWan6G4",
  },
  {
    id: "fb-4",
    name: "Wakil Ketua III",
    position: "Bid. Perencanaan & Keuangan",
    photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDptcIhYCOfRCZ1_mDCpq51tS-jWtFdT2-bNa1v1KofFpG39A707KJJmZJ0gISdH27WCCGK4xosufZ7PXJqXc17WurGynPFlPCuGakMAsiFgPz9SpxyZ4nIiLpjhA-XZK6yvonfMuPmoMXA3Qz5O4ARDFH0E7uelNe-439uOmHVx0OCiB7HPS3UGqn2jcL2hT9ewtRylOsrxCdkNKLq4Hh6rTyTeY7oRYsOn_t5n07zgZwxKpmKlCqr",
  },
  {
    id: "fb-5",
    name: "Wakil Ketua IV",
    position: "Bid. Administrasi & Umum",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=400&fit=crop",
  }
];

export default function TentangClient({ team, settings = {} }: TentangClientProps) {
  // Extract customizable settings with fallback to premium design copy
  const visionText = settings.vision_text || "Menjadi lembaga utama menyejahterakan umat melalui pengelolaan zakat, infak, dan sedekah di Kabupaten Boven Digoel.";
  const missions = [
    settings.mission_1 || "Membangun BAZNAS Boven Digoel yang kuat, terpercaya, dan modern sebagai lembaga pengelola ZIS.",
    settings.mission_2 || "Meningkatkan kesadaran masyarakat untuk menunaikan zakat, infak, dan sedekah melalui BAZNAS.",
    settings.mission_3 || "Meningkatkan pendayagunaan ZIS untuk pengentasan kemiskinan dan peningkatan kesejahteraan mustahik.",
    settings.mission_4 || "Meningkatkan transparansi dan akuntabilitas pengelolaan zakat sesuai standar syariat."
  ];

  // If database contains team members, prioritize them, otherwise use fallback leaders to ensure 5 members on 1 row
  const activeLeaders = team.length === 0 ? FALLBACK_LEADERS : team;

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* 1. Hero Image Section (Width and Height Auto, No Overlay, No Cropping) */}
      <section className="w-full bg-white dark:bg-slate-900 flex items-center justify-center border-b border-surface-variant/20 dark:border-outline/10">
        <div className="w-full max-w-[1320px] mx-auto px-6 md:px-12 pt-8 pb-4">
          <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-surface-variant/30 dark:border-outline/10">
            <Image 
              className="w-full h-auto object-contain block mx-auto" 
              src="/images/leaders.png" 
              alt="Pimpinan BAZNAS Boven Digoel" 
              width={1200}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Introduction Section (Former Hero Text Moved Below, Dark/Light styled) */}
      <section className="w-full bg-[#F8F6F1] dark:bg-slate-950/60 py-16 md:py-24 border-b border-surface-variant/30 dark:border-outline/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-[#075C3B]/5 dark:bg-[#8cd6ac]/10 px-4 py-1.5 rounded-full text-[#075C3B] dark:text-[#8cd6ac] font-jakarta text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Lembaga Pemerintah Non-Struktural
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#004229] dark:text-white leading-tight max-w-4xl tracking-tight">
            Mengenal BAZNAS Boven Digoel
          </h2>
          <p className="font-jakarta text-base md:text-lg text-[#5B6470] dark:text-slate-300 max-w-3xl leading-relaxed">
            Badan Amil Zakat Nasional (BAZNAS) adalah lembaga pemerintah non-struktural yang mandiri dan bertanggung jawab kepada Presiden melalui Menteri Agama. Di Boven Digoel, kami hadir sebagai koordinator resmi pengelolaan zakat, infak, dan sedekah untuk mewujudkan kesejahteraan umat.
          </p>
        </div>
      </section>

      {/* 3. Profil Singkat Section (Plain White Background) */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-surface-variant/30 dark:border-outline/10 py-16 md:py-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h2 className="font-playfair text-3xl font-bold text-[#004229] dark:text-white mb-6">
            Lembaga Resmi Pengelola ZIS
          </h2>
          <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 leading-relaxed">
            Sesuai dengan Undang-Undang Nomor 23 Tahun 2011 tentang Pengelolaan Zakat, BAZNAS merupakan lembaga yang berwenang melakukan tugas pengelolaan zakat secara nasional. BAZNAS Kabupaten Boven Digoel berperan penting dalam menghimpun dan menyalurkan dana Zakat, Infak, dan Sedekah (ZIS) dari masyarakat untuk masyarakat, dengan mengedepankan prinsip keadilan, kehati-hatian, dan kemanfaatan.
          </p>
        </div>
      </section>

      {/* 4. Visi & Misi Section (Soft Subtle Gray Background) */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/40 border-b border-surface-variant/30 dark:border-outline/10 py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-surface-variant/60 dark:border-outline/15 relative flex flex-col justify-center min-h-[250px] shadow-sm">
            <Quote className="absolute top-6 left-6 w-14 h-14 text-[#D4AF37]/20 stroke-[1.5]" />
            <h3 className="font-jakarta text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-4 z-10">
              Visi Kami
            </h3>
            <p className="font-playfair text-2xl lg:text-3xl font-bold text-[#004229] dark:text-white leading-tight z-10 relative">
              "{visionText}"
            </p>
          </div>
          
          <div className="flex flex-col gap-6 pt-4 md:pt-0">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#004229] dark:text-white">
              Misi Kami
            </h3>
            <ul className="space-y-5">
              {missions.map((mission, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#004229]/10 dark:bg-[#8cd6ac]/20 text-[#004229] dark:text-[#8cd6ac] flex items-center justify-center font-bold font-jakarta text-sm mt-0.5">
                    {index + 1}
                  </div>
                  <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 leading-relaxed pt-0.5">
                    {mission}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Nilai-Nilai Utama Section (Deep Emerald Solid Background for Striking High Contrast) */}
      <section className="w-full bg-[#004229] dark:bg-slate-950 text-white py-16 md:py-24 border-b border-white/5">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl font-bold text-white mb-4">
              Nilai-Nilai Utama
            </h2>
            <p className="font-jakarta text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Dalam menjalankan amanah, kami memegang teguh prinsip-prinsip dasar yang menjadi landasan setiap langkah pengelolaan ZIS.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Amanah",
                desc: "Menjaga kepercayaan masyarakat (Muzaki) dengan menyalurkan dana ZIS tepat sasaran kepada yang berhak (Mustahik) sesuai syariat Islam.",
                icon: ShieldAlert
              },
              {
                title: "Profesional",
                desc: "Dikelola oleh amil yang kompeten, bekerja secara efektif dan efisien menggunakan sistem manajemen modern yang terstandarisasi.",
                icon: Briefcase
              },
              {
                title: "Transparan",
                desc: "Terbuka dalam pelaporan keuangan dan penyaluran program. Terakreditasi dan diaudit secara berkala oleh lembaga yang berwenang.",
                icon: Eye
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#075C3B] dark:bg-slate-900/60 p-8 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-md"
                >
                  <Icon className="w-10 h-10 text-[#D4AF37] mb-5 stroke-[1.5]" />
                  <h3 className="font-playfair text-xl font-bold mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="font-jakarta text-sm text-emerald-50/90 dark:text-slate-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Pimpinan Section (Exactly 5 Columns in 1 Row on Desktop, Pure White Background) */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-surface-variant/30 dark:border-outline/10 py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl font-bold text-[#004229] dark:text-white mb-4">
              Pimpinan BAZNAS Boven Digoel
            </h2>
            <p className="font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Dikelola oleh tokoh masyarakat dan profesional yang berkomitmen tinggi terhadap kesejahteraan umat di wilayah Kabupaten Boven Digoel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {activeLeaders.map((member) => (
              <div 
                key={member.id}
                className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl overflow-hidden border border-surface-variant/40 dark:border-outline/10 text-center pb-6 hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-800/40 transition-all duration-300 flex flex-col h-full shadow-sm"
              >
                {/* Leader Photo (Pas Foto ID-Frame aspect-ratio 3:4) */}
                <div className="mx-auto mt-6 w-36 h-48 rounded-lg overflow-hidden border-2 border-[#D4AF37] dark:border-[#ffe088] shadow-md relative aspect-[3/4] flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  {member.photo_url ? (
                    <Image 
                      className="object-cover" 
                      src={member.photo_url} 
                      alt={member.name} 
                      fill
                      sizes="(max-width: 768px) 144px, 144px"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                      <User className="w-12 h-12 opacity-40" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider font-jakarta opacity-40">Belum Ada Foto</span>
                    </div>
                  )}
                </div>
                
                {/* Leader Details */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-[#004229] dark:text-white line-clamp-2 leading-tight mb-1">
                      {member.name}
                    </h4>
                    <p className="font-jakarta text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
                      {member.position}
                    </p>
                  </div>
                  {member.bio && (
                    <p className="font-jakarta text-xs text-[#5B6470] dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Legalitas Section (Soft Cream Background) */}
      <section className="w-full bg-[#F8F6F1] dark:bg-slate-950/40 py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl border border-surface-variant/50 dark:border-outline/10 shadow-sm">
            <div className="w-full md:w-2/3 space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-[#004229] dark:text-white flex items-center gap-3">
                <Gavel className="w-6 h-6 text-[#D4AF37]" />
                Dasar Hukum & Legalitas
              </h2>
              <ul className="space-y-3 font-jakarta text-sm md:text-base text-[#5B6470] dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac] mt-1 shrink-0" />
                  <span>Undang-Undang RI Nomor 23 Tahun 2011 tentang Pengelolaan Zakat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac] mt-1 shrink-0" />
                  <span>Peraturan Pemerintah RI Nomor 14 Tahun 2014 tentang Pelaksanaan Undang-Undang Nomor 23 Tahun 2011.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#075C3B] dark:text-[#8cd6ac] mt-1 shrink-0" />
                  <span>Keputusan Bupati Boven Digoel terkait Pembentukan dan Pengesahan Pengurus BAZNAS Kabupaten Boven Digoel.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 flex justify-center border-l-0 md:border-l border-surface-variant/60 dark:border-outline/20 pl-0 md:pl-8">
              <div className="text-center space-y-2">
                <Award className="w-12 h-12 text-[#075C3B] dark:text-[#8cd6ac] mx-auto stroke-[1.5]" />
                <p className="font-jakarta text-xs font-bold text-[#004229] dark:text-[#8cd6ac] uppercase tracking-wider leading-relaxed">
                  Terdaftar Resmi &amp;
                  <br />
                  Diaudit Berkala
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}