// src/app/kabar/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import KabarClient from "@/components/KabarClient";
import { AlertTriangle } from "lucide-react";

export const revalidate = 60;

export default async function KabarPage() {
    const supabase = await createServerSupabase();

    const { data: news, error } = await supabase
        .from("news")
        .select(`
            id, 
            title, 
            slug, 
            published_at, 
            thumbnail_url,
            content,
            categories (name)
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    // Prune news list: clean and truncate HTML content to 200 chars on the server to prevent megabytes of payload transfer
    const newsList = (news || []).map((item: any) => ({
        ...item,
        content: item.content ? item.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200).trim() + "..." : ""
    }));

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto mb-4" />
                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-red-600 dark:text-red-400">Gagal Memuat Berita</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data berita. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    return <KabarClient initialNews={newsList} />;
}
