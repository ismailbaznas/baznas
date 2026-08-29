// src/components/admin/AdminSettingsClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { 
    AlertTriangle, 
    Save, 
    Home, 
    Info, 
    BookOpen, 
    CreditCard, 
    Mail, 
    Sparkles,
    Award,
    Plus,
    Trash2,
    Edit2,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase";

type Setting = {
    key: string;
    name: string;
    value: string;
};

type BankAccount = {
    id: string;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
    kategori: string | null;
    status: string | null;
    created_at?: string;
    updated_at?: string;
};

type QuickLink = {
    id: string;
    label: string;
    url: string;
    sort_order: number | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

interface AdminSettingsClientProps {
    initialSettings: Setting[];
    user: RBACUser;
}

export default function AdminSettingsClient({
    initialSettings,
    user,
}: AdminSettingsClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"umum" | "beranda" | "visi" | "dampak" | "rekening" | "tautan">("umum");

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);
    
    // Bank accounts CRUD states
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [accountForm, setAccountForm] = useState({
        nama_bank: "",
        nomor_rekening: "",
        atas_nama: "BAZNAS Kabupaten Boven Digoel",
        kategori: "Zakat",
        status: "active"
    });
    
    // Quick links CRUD states
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
    const [linkForm, setLinkForm] = useState({
        label: "",
        url: "",
        sort_order: 0,
        is_active: true
    });

    const canUpdate = can("settings", "update");

    const handleChange = (key: string, value: string) => {
        setSettings(prev => prev.map(setting => 
            setting.key === key ? { ...setting, value } : setting
        ));
    };

    const fetchAccounts = async () => {
        try {
            setLoadingAccounts(true);
            const supabase = getSupabaseBrowser();
            const { data, error } = await (supabase as any)
                .from("bank_accounts")
                .select("*")
                .order("created_at", { ascending: true });
            if (!error) {
                setAccounts(data || []);
            }
        } catch (err) {
            console.error("Exception fetching bank accounts:", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const fetchQuickLinks = async () => {
        try {
            setLoadingLinks(true);
            const supabase = getSupabaseBrowser();
            const { data, error } = await (supabase as any)
                .from("quick_links")
                .select("*")
                .order("sort_order", { ascending: true });
            if (!error) {
                setQuickLinks(data || []);
            }
        } catch (err) {
            console.error("Exception fetching quick links:", err);
        } finally {
            setLoadingLinks(false);
        }
    };

    useEffect(() => {
        if (activeTab === "rekening") {
            fetchAccounts();
        } else if (activeTab === "tautan") {
            fetchQuickLinks();
        }
    }, [activeTab]);

    // ===== BANK ACCOUNT CRUD =====
    const handleSaveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountForm.nama_bank || !accountForm.nomor_rekening || !accountForm.atas_nama) {
            setError("Nama Bank, Nomor Rekening, dan Atas Nama wajib diisi.");
            return;
        }
        try {
            const supabase = getSupabaseBrowser();
            if (editingAccount) {
                const { error } = await (supabase as any)
                    .from("bank_accounts")
                    .update({
                        nama_bank: accountForm.nama_bank,
                        nomor_rekening: accountForm.nomor_rekening,
                        atas_nama: accountForm.atas_nama,
                        kategori: accountForm.kategori,
                        status: accountForm.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", editingAccount.id);
                if (error) throw error;
                setSuccess("Rekening bank berhasil diperbarui.");
            } else {
                const { error } = await (supabase as any)
                    .from("bank_accounts")
                    .insert({
                        nama_bank: accountForm.nama_bank,
                        nomor_rekening: accountForm.nomor_rekening,
                        atas_nama: accountForm.atas_nama,
                        kategori: accountForm.kategori,
                        status: accountForm.status
                    });
                if (error) throw error;
                setSuccess("Rekening bank berhasil ditambahkan.");
            }
            setShowAccountForm(false);
            setEditingAccount(null);
            setAccountForm({
                nama_bank: "",
                nomor_rekening: "",
                atas_nama: "BAZNAS Kabupaten Boven Digoel",
                kategori: "Zakat",
                status: "active"
            });
            await fetchAccounts();
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan rekening bank.");
        }
    };

    const handleEditAccount = (acc: BankAccount) => {
        setEditingAccount(acc);
        setAccountForm({
            nama_bank: acc.nama_bank,
            nomor_rekening: acc.nomor_rekening,
            atas_nama: acc.atas_nama,
            kategori: acc.kategori || "Zakat",
            status: acc.status || "active"
        });
        setShowAccountForm(true);
    };

    const handleDeleteAccount = async (id: string) => {
        if (!confirm("Yakin hapus rekening bank ini?")) return;
        try {
            const supabase = getSupabaseBrowser();
            const { error } = await (supabase as any)
                .from("bank_accounts")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setSuccess("Rekening bank berhasil dihapus.");
            await fetchAccounts();
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal menghapus rekening bank.");
        }
    };

    // ===== QUICK LINK CRUD =====
    const handleSaveLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkForm.label || !linkForm.url) {
            setError("Label dan URL wajib diisi.");
            return;
        }
        try {
            const supabase = getSupabaseBrowser();
            if (editingLink) {
                const { error } = await (supabase as any)
                    .from("quick_links")
                    .update({
                        label: linkForm.label,
                        url: linkForm.url,
                        sort_order: Number(linkForm.sort_order),
                        is_active: linkForm.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", editingLink.id);
                if (error) throw error;
                setSuccess("Tautan cepat berhasil diperbarui.");
            } else {
                const { error } = await (supabase as any)
                    .from("quick_links")
                    .insert({
                        label: linkForm.label,
                        url: linkForm.url,
                        sort_order: Number(linkForm.sort_order),
                        is_active: linkForm.is_active
                    });
                if (error) throw error;
                setSuccess("Tautan cepat berhasil ditambahkan.");
            }
            setShowLinkForm(false);
            setEditingLink(null);
            setLinkForm({ label: "", url: "", sort_order: 0, is_active: true });
            await fetchQuickLinks();
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan tautan.");
        }
    };

    const handleEditLink = (link: QuickLink) => {
        setEditingLink(link);
        setLinkForm({
            label: link.label,
            url: link.url,
            sort_order: link.sort_order || 0,
            is_active: link.is_active
        });
        setShowLinkForm(true);
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm("Yakin hapus tautan ini?")) return;
        try {
            const supabase = getSupabaseBrowser();
            const { error } = await (supabase as any)
                .from("quick_links")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setSuccess("Tautan berhasil dihapus.");
            await fetchQuickLinks();
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal menghapus tautan.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!canUpdate) {
            setError("Anda tidak memiliki izin untuk mengubah pengaturan.");
            setLoading(false);
            return;
        }

        // Prepare data for upsert - all site_settings are in one table
        const dataToUpsert = settings.map(setting => ({
            key: setting.key,
            value: { value: setting.value },
            description: setting.name,
        }));

        const response = await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToUpsert),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            setError(result.error || "Terjadi kesalahan saat menyimpan pengaturan.");
        } else {
            setSuccess("Pengaturan berhasil disimpan.");
            router.refresh();
        }

        setLoading(false);
    };

    // Filter fields based on active tab
    const tabKeys: Record<string, string[]> = {
        umum: [
            "site_name", 
            "contact_phone", 
            "contact_email", 
            "contact_address",
            "social_facebook",
            "social_instagram",
            "social_tiktok"
        ],
        beranda: ["home_hero_title", "home_hero_subtitle", "home_hero_imageurl"],
        dampak: [
            "story_imageurl",
            "story_badge",
            "story_tittle",
            "story_author",
            "story_quote",
            "story_metric",
            "story_metric_label",
            "story_is_active"
        ],
        visi: ["vision_text", "mission_1", "mission_2", "mission_3", "mission_4"]
    };

    const renderInput = (key: string) => {
        const setting = settings.find(s => s.key === key);
        if (!setting) return null;

        const isLongText = key === "home_hero_subtitle" || key === "vision_text" || key === "contact_address" || key === "story_quote";
        const isImageUrl = key === "home_hero_imageurl" || key === "story_imageurl";
        const isSelect = key === "story_is_active";

        return (
            <div key={setting.key} className="space-y-1">
                <label htmlFor={setting.key} className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {setting.name}
                </label>
                {isSelect ? (
                    <select
                        id={setting.key}
                        name={setting.key}
                        value={setting.value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={!canUpdate || loading}
                        className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="true">Aktif (Ditampilkan di Beranda)</option>
                        <option value="false">Arsip (Nonaktif)</option>
                    </select>
                ) : isImageUrl ? (
                    <div className="space-y-2">
                        <Input
                            id={setting.key}
                            name={setting.key}
                            value={setting.value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            disabled={!canUpdate || loading}
                            placeholder="https://..."
                        />
                        {setting.value && (
                            <div className="mt-2 p-2 border border-surface-variant/40 rounded-lg bg-slate-50">
                                <p className="text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Preview Gambar</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={setting.value} 
                                    alt="Preview" 
                                    className="w-full h-32 object-cover rounded-md border border-surface-variant/30"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>
                ) : isLongText ? (
                    <textarea
                        id={setting.key}
                        name={setting.key}
                        value={setting.value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={!canUpdate || loading}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-xl border border-surface-variant/60 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-on-surface px-3.5 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                ) : (
                    <Input
                        id={setting.key}
                        name={setting.key}
                        value={setting.value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={!canUpdate || loading}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
                    Pengaturan Konten Situs
                </h1>
                <p className="text-xs text-on-surface-variant mt-1">
                    Kelola nama situs, informasi kontak, rekening resmi, serta kustomisasi teks pada Beranda dan Tentang Kami.
                </p>
            </div>
            
            {!canUpdate && (
                <div className="p-3 bg-status-warning/10 border border-status-warning text-status-warning rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-body-md">Anda hanya memiliki izin baca. Anda tidak dapat menyimpan perubahan.</p>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                    {success}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Tabs Navigation */}
                <div className="w-full lg:w-64 bg-surface p-4 rounded-xl border border-surface-variant/50 shadow-sm flex flex-row lg:flex-col flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab("umum")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "umum" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        <span>Umum & Kontak</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("beranda")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "beranda" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span>Beranda (Homepage)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("dampak")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "dampak" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <Award className="w-4 h-4" />
                        <span>Cerita Dampak</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("visi")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "visi" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Visi & Misi</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("rekening")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "rekening" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Rekening Bank</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("tautan")}
                        className={cn(
                            "flex items-center space-x-2.5 p-3 rounded-lg text-left text-sm font-semibold w-fit lg:w-full transition-all",
                            activeTab === "tautan" 
                                ? "bg-primary-container text-on-primary-container shadow-sm" 
                                : "text-on-surface hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <Info className="w-4 h-4" />
                        <span>Tautan Cepat</span>
                    </button>
                </div>

                {/* Form Panels */}
                <div className="flex-1 w-full bg-surface p-8 rounded-xl border border-surface-variant/50 shadow-sm space-y-8">
                    
                    {/* Active Tab Content */}
                    <div className="space-y-6">
                        {activeTab === "umum" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-[#D4AF37]" />
                                        Informasi Umum & Kontak
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 pt-4">
                                        {tabKeys.umum.filter(k => !k.startsWith("social_")).map(renderInput)}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-surface-variant/40">
                                    <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                        <Info className="w-5 h-5 text-[#D4AF37]" />
                                        Akun Media Sosial
                                    </h3>
                                    <p className="text-xs text-on-surface-variant -mt-2">
                                        Masukkan URL lengkap akun media sosial resmi BAZNAS. Kosongkan jika tidak memiliki.
                                    </p>
                                    <div className="grid grid-cols-1 gap-6 pt-2">
                                        {tabKeys.umum.filter(k => k.startsWith("social_")).map(renderInput)}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-surface-variant/40 flex justify-end">
                                    <Can required="settings.update">
                                        <Button type="submit" disabled={loading || !canUpdate} className="space-x-2">
                                            <Save className="w-5 h-5" />
                                            <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
                                        </Button>
                                    </Can>
                                </div>
                            </form>
                        )}

                        {activeTab === "beranda" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                        Beranda Hero
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 pt-4">
                                        {tabKeys.beranda.map(renderInput)}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-surface-variant/40 flex justify-end">
                                    <Can required="settings.update">
                                        <Button type="submit" disabled={loading || !canUpdate} className="space-x-2">
                                            <Save className="w-5 h-5" />
                                            <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
                                        </Button>
                                    </Can>
                                </div>
                            </form>
                        )}

                        {activeTab === "dampak" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                        <Award className="w-5 h-5 text-[#D4AF37]" />
                                        Cerita Dampak (Success Story)
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Kelola cerita dampak mustahik yang ditampilkan pada halaman beranda.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="md:col-span-2">{renderInput("story_imageurl")}</div>
                                        <div className="md:col-span-2">{renderInput("story_badge")}</div>
                                        <div className="md:col-span-2">{renderInput("story_tittle")}</div>
                                        <div className="md:col-span-2">{renderInput("story_author")}</div>
                                        <div className="md:col-span-2">{renderInput("story_quote")}</div>
                                        {renderInput("story_metric")}
                                        {renderInput("story_metric_label")}
                                        {renderInput("story_is_active")}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-surface-variant/40 flex justify-end">
                                    <Can required="settings.update">
                                        <Button type="submit" disabled={loading || !canUpdate} className="space-x-2">
                                            <Save className="w-5 h-5" />
                                            <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
                                        </Button>
                                    </Can>
                                </div>
                            </form>
                        )}

                        {activeTab === "visi" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                                        Visi & Misi Lembaga
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 pt-4">
                                        {tabKeys.visi.map(renderInput)}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-surface-variant/40 flex justify-end">
                                    <Can required="settings.update">
                                        <Button type="submit" disabled={loading || !canUpdate} className="space-x-2">
                                            <Save className="w-5 h-5" />
                                            <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
                                        </Button>
                                    </Can>
                                </div>
                            </form>
                        )}

                        {activeTab === "rekening" && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-variant/40">
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                                            Rekening Penampungan Resmi
                                        </h3>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Kelola daftar rekening bank aktif untuk menerima pembayaran ZIS.
                                        </p>
                                    </div>
                                    {!showAccountForm && canUpdate && (
                                        <Button
                                            onClick={() => {
                                                setEditingAccount(null);
                                                setAccountForm({
                                                    nama_bank: "",
                                                    nomor_rekening: "",
                                                    atas_nama: "BAZNAS Kabupaten Boven Digoel",
                                                    kategori: "Zakat",
                                                    status: "active"
                                                });
                                                setShowAccountForm(true);
                                            }}
                                            className="space-x-1 text-xs"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Tambah Rekening</span>
                                        </Button>
                                    )}
                                </div>

                                {/* Add/Edit Form */}
                                {showAccountForm && canUpdate && (
                                    <form onSubmit={handleSaveAccount} className="bg-slate-50 p-6 rounded-2xl border border-surface-variant/40 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-surface-variant/20">
                                            <h4 className="text-sm font-bold text-primary">
                                                {editingAccount ? "Edit Rekening Bank" : "Tambah Rekening Baru"}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => setShowAccountForm(false)}
                                                className="text-on-surface-variant hover:text-[#004229]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Bank *</label>
                                                <Input
                                                    value={accountForm.nama_bank}
                                                    onChange={e => setAccountForm(prev => ({ ...prev, nama_bank: e.target.value }))}
                                                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Rekening *</label>
                                                <Input
                                                    value={accountForm.nomor_rekening}
                                                    onChange={e => setAccountForm(prev => ({ ...prev, nomor_rekening: e.target.value }))}
                                                    placeholder="Contoh: 7123 456 789"
                                                    required
                                                    className="font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Atas Nama (A/N) *</label>
                                                <Input
                                                    value={accountForm.atas_nama}
                                                    onChange={e => setAccountForm(prev => ({ ...prev, atas_nama: e.target.value }))}
                                                    placeholder="Contoh: BAZNAS Kab Boven Digoel"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kategori</label>
                                                <select
                                                    value={accountForm.kategori}
                                                    onChange={e => setAccountForm(prev => ({ ...prev, kategori: e.target.value }))}
                                                    className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                >
                                                    <option value="Zakat">Zakat</option>
                                                    <option value="Infak & Sedekah">Infak & Sedekah</option>
                                                    <option value="Kemanusiaan">Kemanusiaan</option>
                                                    <option value="Umum">Umum</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                                                <select
                                                    value={accountForm.status}
                                                    onChange={e => setAccountForm(prev => ({ ...prev, status: e.target.value }))}
                                                    className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                >
                                                    <option value="active">Aktif (Tampil di Footer)</option>
                                                    <option value="inactive">Nonaktif (Disembunyikan)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowAccountForm(false)}
                                                className="text-xs"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="text-xs"
                                            >
                                                {editingAccount ? "Simpan Perubahan" : "Simpan Baru"}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Bank Accounts Table */}
                                {loadingAccounts ? (
                                    <p className="text-xs text-on-surface-variant italic">Memuat data rekening bank...</p>
                                ) : accounts.length === 0 ? (
                                    <p className="text-xs text-on-surface-variant italic text-center py-8 bg-slate-50 rounded-lg border border-dashed border-surface-variant/40">
                                        Belum ada rekening bank. Klik "Tambah Rekening" untuk membuat.
                                    </p>
                                ) : (
                                    <div className="border border-surface-variant/40 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 border-b border-surface-variant/30 text-on-surface-variant text-xs uppercase font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3">Bank</th>
                                                    <th className="px-4 py-3">No. Rekening</th>
                                                    <th className="px-4 py-3">A/N</th>
                                                    <th className="px-4 py-3">Kategori</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    {canUpdate && <th className="px-4 py-3 text-right">Aksi</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-variant/20">
                                                {accounts.map((acc) => (
                                                    <tr key={acc.id} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-3 font-semibold">{acc.nama_bank}</td>
                                                        <td className="px-4 py-3 font-mono text-xs">{acc.nomor_rekening}</td>
                                                        <td className="px-4 py-3 text-xs">{acc.atas_nama}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/10 text-[#a08124] border border-[#D4AF37]/20">
                                                                {acc.kategori || "Umum"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {acc.status === "active" ? (
                                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                                                    Nonaktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        {canUpdate && (
                                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                                <button
                                                                    onClick={() => handleEditAccount(acc)}
                                                                    className="text-on-surface-variant hover:text-primary p-1"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteAccount(acc.id)}
                                                                    className="text-on-surface-variant hover:text-red-600 p-1 ml-1"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "tautan" && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-variant/40">
                                    <div>
                                        <h3 className="font-playfair text-xl font-bold text-primary flex items-center gap-2">
                                            <Info className="w-5 h-5 text-[#D4AF37]" />
                                            Tautan Cepat Footer
                                        </h3>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Kelola tautan navigasi yang ditampilkan di footer situs.
                                        </p>
                                    </div>
                                    {!showLinkForm && canUpdate && (
                                        <Button
                                            onClick={() => {
                                                setEditingLink(null);
                                                setLinkForm({
                                                    label: "",
                                                    url: "",
                                                    sort_order: (quickLinks.length + 1) * 10,
                                                    is_active: true
                                                });
                                                setShowLinkForm(true);
                                            }}
                                            className="space-x-1 text-xs"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Tambah Tautan</span>
                                        </Button>
                                    )}
                                </div>

                                {/* Add/Edit Form */}
                                {showLinkForm && canUpdate && (
                                    <form onSubmit={handleSaveLink} className="bg-slate-50 p-6 rounded-2xl border border-surface-variant/40 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-surface-variant/20">
                                            <h4 className="text-sm font-bold text-primary">
                                                {editingLink ? "Edit Tautan" : "Tambah Tautan Baru"}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => setShowLinkForm(false)}
                                                className="text-on-surface-variant hover:text-[#004229]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Label Tautan *</label>
                                                <Input
                                                    value={linkForm.label}
                                                    onChange={e => setLinkForm(prev => ({ ...prev, label: e.target.value }))}
                                                    placeholder="Contoh: Tentang Kami"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">URL / Rute *</label>
                                                <Input
                                                    value={linkForm.url}
                                                    onChange={e => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                                                    placeholder="Contoh: /tentang atau https://..."
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Urutan Tampilan</label>
                                                <Input
                                                    type="number"
                                                    value={linkForm.sort_order}
                                                    onChange={e => setLinkForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                                    placeholder="10, 20, 30, ..."
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                                                <select
                                                    value={linkForm.is_active ? "true" : "false"}
                                                    onChange={e => setLinkForm(prev => ({ ...prev, is_active: e.target.value === "true" }))}
                                                    className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                >
                                                    <option value="true">Aktif (Tampil di Footer)</option>
                                                    <option value="false">Nonaktif</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowLinkForm(false)}
                                                className="text-xs"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="text-xs"
                                            >
                                                {editingLink ? "Simpan Perubahan" : "Simpan Baru"}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Quick Links Table */}
                                {loadingLinks ? (
                                    <p className="text-xs text-on-surface-variant italic">Memuat data tautan...</p>
                                ) : quickLinks.length === 0 ? (
                                    <p className="text-xs text-on-surface-variant italic text-center py-8 bg-slate-50 rounded-lg border border-dashed border-surface-variant/40">
                                        Belum ada tautan. Klik "Tambah Tautan" untuk membuat.
                                    </p>
                                ) : (
                                    <div className="border border-surface-variant/40 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 border-b border-surface-variant/30 text-on-surface-variant text-xs uppercase font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3">Label</th>
                                                    <th className="px-4 py-3">URL</th>
                                                    <th className="px-4 py-3">Order</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    {canUpdate && <th className="px-4 py-3 text-right">Aksi</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-variant/20">
                                                {quickLinks.map((link) => (
                                                    <tr key={link.id} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-3 font-semibold">{link.label}</td>
                                                        <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{link.url}</td>
                                                        <td className="px-4 py-3 text-xs">{link.sort_order}</td>
                                                        <td className="px-4 py-3">
                                                            {link.is_active ? (
                                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                                                    Nonaktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        {canUpdate && (
                                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                                <button
                                                                    onClick={() => handleEditLink(link)}
                                                                    className="text-on-surface-variant hover:text-primary p-1"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteLink(link.id)}
                                                                    className="text-on-surface-variant hover:text-red-600 p-1 ml-1"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
