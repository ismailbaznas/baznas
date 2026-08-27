// src/app/program/page.tsx

import { createServerSupabase } from "@/lib/supabase";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgramPage() {
    const supabase = await createServerSupabase();

    const { data: programs, error } = await supabase
        .from("programs")
        .select(`
            id, 
            title, 
            slug, 
            description, 
            image_url,
            categories (name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    const programList = programs as any[] || [];

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-status-danger mx-auto mb-4" />
                <h1 className="text-headline-lg font-space-grotesk text-status-danger">Gagal Memuat Program</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data program. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <h1 className="text-headline-lg font-space-grotesk text-primary">Program</h1>
            <p className="text-body-lg text-on-surface">Daftar program unggulan BAZNAS Kabupaten Boven Digoel (Pendidikan, Kesehatan, Ekonomi, dll.).</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {programList.map((item) => (
                    <Link href={`/program/${item.slug}`} key={item.id} className="block group bg-surface-container-lowest rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                        <div className="h-48 bg-surface-variant flex items-center justify-center">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-on-surface-variant">No Image</span>
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="text-sm text-on-surface-variant">
                                Kategori: {(item.categories as { name: string })?.name || 'Umum'}
                            </p>
                            <h2 className="text-title-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                                {item.title}
                            </h2>
                            <p className="text-body-sm text-on-surface-variant line-clamp-3">
                                {item.description}
                            </p>
                        </div>
                    </Link>
                ))}

                {programList.length === 0 && (
                    <p className="col-span-3 text-center text-on-surface-variant">Belum ada program aktif saat ini.</p>
                )}
            </div>
        </div>
    );
}
