// src/app/kontak/page.tsx

import { createServerSupabase } from "@/lib/server-supabase";
import ContactFormClient from "@/components/ContactFormClient";

export const revalidate = 60;

export default async function ContactPage() {
    const supabase = await createServerSupabase();

    // Fetch site settings and bank accounts in parallel
    const [settingsRes, accountsRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("bank_accounts").select("*").eq("status", "active").order("created_at", { ascending: true })
    ]);

    const settingsMap = settingsRes.data?.reduce((acc: Record<string, string>, setting: any) => {
        acc[setting.key] = setting.value && typeof setting.value === "object" && "value" in setting.value 
            ? String(setting.value.value) 
            : String(setting.value);
        return acc;
    }, {} as Record<string, string>) || {};

    return (
        <ContactFormClient 
            settings={settingsMap} 
            initialBankAccounts={accountsRes.data || []} 
        />
    );
}
