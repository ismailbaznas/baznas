// src/app/admin/settings/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import { cookies } from "next/headers";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";
import { Database } from "@/types/database.types";

export const dynamic = "force-dynamic";

// Define default settings keys
const SETTINGS_KEYS = [
    { key: "site_name", name: "Nama Situs", default: "BAZNAS Kabupaten Boven Digoel" },
    { key: "contact_phone", name: "Telepon Kontak", default: "" },
    { key: "contact_email", name: "Email Kontak", default: "" },
    { key: "social_facebook", name: "Link Facebook", default: "" },
    { key: "social_instagram", name: "Link Instagram", default: "" },
    // You would add more complex settings here, like "footer_navigation"
];

export default async function AdminSettingsPage() {
  // Guard 1: Check read permission
  const user = await guardAdminPage("settings.read");

  const supabase = await createServerSupabase();

  // Fetch all current settings
  const { data: currentSettings, error } = await (supabase
    .from("site_settings") as any)
    .select("*");

  if (error) {
    console.error("Error fetching settings:", error.message);
  }

  // Map fetched settings to a key-value object
  const settingsMap = currentSettings?.reduce((acc: Record<string, any>, setting: Database['public']['Tables']['site_settings']['Row']) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, Database['public']['Tables']['site_settings']['Row']['value']>) || {};

  // Combine fetched settings with default values
  const initialSettings = SETTINGS_KEYS.map(item => ({
    key: item.key,
    name: item.name,
    value: settingsMap[item.key] ? settingsMap[item.key] : item.default,
  }));

  return (
    <AdminSettingsClient
      initialSettings={initialSettings}
      user={user}
    />
  );
}
