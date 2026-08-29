// src/app/tentang/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import TentangClient from "@/components/TentangClient";
import { AlertTriangle } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
    const supabase = await createServerSupabase();

    // Fetch team members and site settings in parallel
    const [
        { data: teamMembers, error },
        { data: currentSettings }
    ] = await Promise.all([
        supabase
            .from("team_members")
            .select("id, name, position, bio, photo_url")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true }),
        supabase
            .from("site_settings")
            .select("*")
    ]);

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto mb-4" />
                <h1 className="text-2xl md:text-3xl font-playfair font-bold text-red-600 dark:text-red-400">Gagal Memuat Profil Pimpinan</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data profil pimpinan BAZNAS. Silakan coba lagi nanti.</p>
            </div>
        );
    }

    // Unpack settings to a simple key-value string dictionary
    const settingsMap = currentSettings?.reduce((acc: Record<string, string>, setting: any) => {
        acc[setting.key] = setting.value && typeof setting.value === "object" && "value" in setting.value 
          ? String(setting.value.value) 
          : String(setting.value);
        return acc;
      }, {} as Record<string, string>) || {};

    const teamList = teamMembers as any[] || [];
    
    return (
        <TentangClient 
            team={teamList} 
            settings={settingsMap}
        />
    );
}
