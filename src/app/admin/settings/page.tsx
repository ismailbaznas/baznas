// src/app/admin/settings/page.tsx

import { guardAdminPage } from "@/lib/rbac/server";
import { createServerSupabase } from "@/lib/server-supabase";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";
import { Database } from "@/types/database.types";

export const dynamic = "force-dynamic";

// Define default settings keys - all site content customization
const SETTINGS_KEYS = [
    // Umum & Kontak
    { key: "site_name", name: "Nama Situs", default: "BAZNAS Kabupaten Boven Digoel" },
    { key: "contact_phone", name: "Telepon Kontak / WA", default: "+62 812 3456 7890" },
    { key: "contact_email", name: "Email Kontak", default: "bovendigoel@baznas.go.id" },
    { key: "contact_address", name: "Alamat Kantor", default: "Jl. Trans Papua KM. 2, Tanah Merah, Boven Digoel" },
    
    // Social Media
    { key: "social_facebook", name: "Sosial: URL Facebook", default: "" },
    { key: "social_instagram", name: "Sosial: URL Instagram", default: "" },
    { key: "social_tiktok", name: "Sosial: URL TikTok", default: "" },
    
    // Homepage Hero
    { key: "home_hero_title", name: "Beranda: Judul Hero", default: "Menguatkan Masyarakat Boven Digoel" },
    { key: "home_hero_subtitle", name: "Beranda: Subjudul Hero", default: "Mengelola zakat, infak, dan sedekah secara amanah, transparan, dan profesional demi mewujudkan kemandirian umat." },
    { key: "home_hero_imageurl", name: "Beranda: URL Gambar Hero", default: "" },

    // Homepage Impact Story (using story_* keys)
    { key: "story_imageurl", name: "Dampak: URL Foto Mustahik", default: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlhgJw2DEnStUFnnkfWbBiKJU9SWKa5v6DNRL1aRwYAZyALOisIYW3J5xnR-Fnqya4sldxl3i2cygZw_OjGD7yDJ2fxEsK515LzrCyeIQ8Xae77kpJ-rBoeojDp_cCJb7O9wj4ABSnpiZA68IQNbyd7H_i7zw_v3VRtspM_TuCTQ_3_5b3nJhiRTKKOWGzXkDidk5UvjAsnMllvvbkPA2aq7dqFWPQcLV_zT6bxLcXBfETlo0dzjZV" },
    { key: "story_badge", name: "Dampak: Badge Kategori", default: "ZAKAT YANG MENJADI HARAPAN" },
    { key: "story_tittle", name: "Dampak: Judul Cerita", default: "Dari Zakat Menjadi Mandiri" },
    { key: "story_author", name: "Dampak: Nama & Lokasi Penulis/Mustahik", default: "Ibu Maria — Mindiptana" },
    { key: "story_quote", name: "Dampak: Kutipan Cerita", default: "Bantuan modal usaha dari BAZNAS membantu saya mengembangkan usaha anyaman dan sembako. Kini saya mampu menyekolahkan anak-anak dan menghidupi keluarga dengan layak." },
    { key: "story_metric", name: "Dampak: Metrik Keberhasilan", default: "+180%" },
    { key: "story_metric_label", name: "Dampak: Label Metrik", default: "Peningkatan Omzet" },
    { key: "story_is_active", name: "Dampak: Status Aktif", default: "true" },

    // Vision & Mission
    { key: "vision_text", name: "Visi: Teks Visi Utama", default: "Menjadi lembaga utama menyejahterakan umat melalui pengelolaan zakat, infak, dan sedekah di Kabupaten Boven Digoel." },
    { key: "mission_1", name: "Misi: Misi Pertama", default: "Membangun BAZNAS Boven Digoel yang kuat, terpercaya, dan modern sebagai lembaga pengelola ZIS." },
    { key: "mission_2", name: "Misi: Misi Kedua", default: "Meningkatkan kesadaran masyarakat untuk menunaikan zakat, infak, dan sedekah melalui BAZNAS." },
    { key: "mission_3", name: "Misi: Misi Ketiga", default: "Meningkatkan pendayagunaan ZIS untuk pengentasan kemiskinan dan peningkatan kesejahteraan mustahik." },
    { key: "mission_4", name: "Misi: Misi Keempat", default: "Meningkatkan transparansi dan akuntabilitas pengelolaan zakat sesuai standar syariat." }
];

export default async function AdminSettingsPage() {
  // Guard 1: Check read permission
  const user = await guardAdminPage("settings.read");

  const supabase = await createServerSupabase();

  // Fetch all current settings
  const { data: currentSettings, error } = await supabase
    .from("site_settings")
    .select("*");

  if (error) {
    console.error("Error fetching settings:", error.message);
  }

  // Map fetched settings to a key-value object
  const settingsMap = currentSettings?.reduce((acc: Record<string, any>, setting: Database['public']['Tables']['site_settings']['Row']) => {
    // Unpack if stored as JSONB object of form { value: string }
    acc[setting.key] = setting.value && typeof setting.value === 'object' && 'value' in setting.value 
      ? (setting.value as any).value 
      : setting.value;
    return acc;
  }, {} as Record<string, any>) || {};

  // Combine fetched settings with default values
  const initialSettings = SETTINGS_KEYS.map(item => ({
    key: item.key,
    name: item.name,
    value: settingsMap[item.key] !== undefined && settingsMap[item.key] !== null ? String(settingsMap[item.key]) : item.default,
  }));

  return (
    <AdminSettingsClient
      initialSettings={initialSettings}
      user={user}
    />
  );
}
