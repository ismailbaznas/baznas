// src/app/kabar/page.tsx

import { createServerSupabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KabarPage() {
    const supabase = createServerSupabase();

    const { data: news, error } = await supabase
        .from("news")
        .select(`
            id, 
            title, 
            slug, 
            published_at, 
            thumbnail_url,
            categories (name)
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    const newsList = news as any[] || [];

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-status-danger mx-auto mb-4" />
                <h1 className="text-headline-lg font-space-grotesk text-status-danger">Gagal Memuat Berita</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data berita. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <h1 className="text-headline-lg font-space-grotesk text-primary">Kabar & Berita</h1>
            <p className="text-body-lg text-on-surface">Berita dan artikel terkini seputar kegiatan BAZNAS Kabupaten Boven Digoel.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsList.map((item) => (
                    <Link href={`/kabar/${item.slug}`} key={item.id} className="block group bg-surface-container-lowest rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                        <div className="h-48 bg-surface-variant flex items-center justify-center">
                            {item.thumbnail_url ? (
                                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-on-surface-variant">No Image</span>
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="text-sm text-on-surface-variant">
                                {format(new Date(item.published_at), "dd MMMM yyyy", { locale: id })} | {(item.categories as { name: string })?.name || 'Umum'}
                            </p>
                            <h2 className="text-title-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                                {item.title}
                            </h2>
                            <p className="text-body-sm text-on-surface-variant line-clamp-2">
                                {/* Placeholder for short content preview, assuming no short_content field is available. */}
                                Klik untuk membaca lebih lanjut.
                            </p>
                        </div>
                    </Link>
                ))}

                {newsList.length === 0 && (
                    <p className="col-span-3 text-center text-on-surface-variant">Belum ada berita yang dipublikasikan saat ini.</p>
                )}
            </div>
        </div>
    );
}
