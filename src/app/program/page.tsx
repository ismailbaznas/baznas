// src/app/program/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import ProgramClient from "@/components/ProgramClient";
import { AlertTriangle } from "lucide-react";

export const revalidate = 60;

export default async function ProgramPage() {
    const supabase = await createServerSupabase();

    // Fetch programs and transparency stats in parallel
    const [
        { data: programs, error },
        { data: statsData }
    ] = await Promise.all([
        supabase
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
            .order("created_at", { ascending: false }),
        supabase
            .from("transparency_stats")
            .select("*")
    ]);

    const statsMap = statsData?.reduce((acc: any, item: any) => {
        acc[item.key] = {
            value: item.value,
            sub_label: item.sub_label
        };
        return acc;
    }, {} as Record<string, { value: string; sub_label: string }>) || {};

    const programList = programs as any[] || [];

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto mb-4" />
                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-red-600 dark:text-red-400">Gagal Memuat Program</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data program. Silakan coba lagi nanti.</p>
            </div>
        );
    }
    
    return <ProgramClient programs={programList} stats={statsMap} />;
}
