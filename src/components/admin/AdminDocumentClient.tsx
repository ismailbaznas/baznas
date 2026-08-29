// src/components/admin/AdminDocumentClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, FileText, Download, BarChart3, Save, Edit2, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Pagination } from "../ui/Pagination";
import { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";
import dynamic from "next/dynamic";

const AdminDocumentModal = dynamic(() => import("./AdminDocumentModal"), { ssr: false });

type DocumentItem = Database["public"]["Tables"]["documents"]["Row"];

type TransparencyStat = {
    id: string;
    key: string;
    label: string;
    value: string;
    sub_label: string | null;
    updated_at?: string;
};

interface AdminDocumentClientProps {
    initialDocuments: DocumentItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
    documentTypes: { label: string; value: string }[];
}

export default function AdminDocumentClient({
    initialDocuments,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
    documentTypes
}: AdminDocumentClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [documentList, setDocumentList] = useState(initialDocuments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Transparency Stats CRUD states
    const [stats, setStats] = useState<TransparencyStat[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [statsSuccess, setStatsSuccess] = useState<string | null>(null);
    const [showStatForm, setShowStatForm] = useState(false);
    const [editingStat, setEditingStat] = useState<TransparencyStat | null>(null);
    const [statForm, setStatForm] = useState({
        label: "",
        value: "",
        sub_label: ""
    });

    const canUpdateStats = can("dokumentasi", "update");

    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const supabase = getSupabaseBrowser();
            const { data, error } = await (supabase as any)
                .from("transparency_stats")
                .select("*")
                .order("key", { ascending: true });
            
            if (!error && data) {
                setStats(data);
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Synchronize documentList with initialDocuments when server re-renders
    useEffect(() => {
        setDocumentList(initialDocuments);
    }, [initialDocuments]);

    const handleSaveStat = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatsError(null);
        setStatsSuccess(null);

        if (!canUpdateStats) {
            setStatsError("Anda tidak memiliki izin untuk menyimpan statistik.");
            return;
        }
        if (!editingStat || !statForm.label || !statForm.value) {
            setStatsError("Label dan Value wajib diisi.");
            return;
        }

        try {
            const supabase = getSupabaseBrowser();
            const { error } = await (supabase as any)
                .from("transparency_stats")
                .update({
                    label: statForm.label,
                    value: statForm.value,
                    sub_label: statForm.sub_label || null,
                    updated_at: new Date().toISOString()
                })
                .eq("id", editingStat.id);

            if (error) throw error;
            setStatsSuccess("Statistik berhasil diperbarui.");
            setShowStatForm(false);
            setEditingStat(null);
            setStatForm({ label: "", value: "", sub_label: "" });
            await fetchStats();
            router.refresh();
        } catch (err: any) {
            console.error("Error saving stat:", err);
            setStatsError(err.message || "Gagal menyimpan statistik.");
        }
    };

    const handleEditStatClick = (stat: TransparencyStat) => {
        setEditingStat(stat);
        setStatForm({
            label: stat.label,
            value: stat.value,
            sub_label: stat.sub_label || ""
        });
        setShowStatForm(true);
    };

    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setEditingId(null);
        if (refetch) {
            router.refresh();
        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus Dokumen ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('documents').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus dokumen: ${error.message}`);
        } else {
            setDocumentList(prev => prev.filter(item => item.id !== id));
            router.refresh();
        }
    };

    const getDocumentTypeLabel = (value: string) => {
        return documentTypes.find(t => t.value === value)?.label || value;
    };

    return (
        <>
            <div className="space-y-8 font-jakarta">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
                            Daftar Dokumen Transparansi
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} laporan dan dokumen publik terdaftar dalam arsip.
                        </p>
                    </div>
                    <Can required="dokumentasi.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Unggah Dokumen Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* TRANSPARENCY STATS MANAGEMENT (EDIT ONLY) */}
                <div className="bg-white dark:bg-[#181818] border border-surface-variant/40 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-surface-variant/30 dark:border-zinc-800">
                        <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                        <div>
                            <h2 className="text-sm font-bold text-[#004229] dark:text-[#8cd6ac]">Kelola Statistik Transparansi</h2>
                            <p className="text-[11px] text-on-surface-variant">Klik Edit untuk mengubah Judul, Sub Judul, atau Jumlah yang tampil pada Beranda dan Transparansi.</p>
                        </div>
                    </div>

                    {statsSuccess && (
                        <div className="p-3 text-xs bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 rounded-xl font-semibold">
                            {statsSuccess}
                        </div>
                    )}
                    {statsError && (
                        <div className="p-3 text-xs bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl font-semibold">
                            {statsError}
                        </div>
                    )}

                    {/* Edit Stat Form */}
                    {showStatForm && canUpdateStats && (
                        <form onSubmit={handleSaveStat} className="bg-slate-50 dark:bg-zinc-800/40 p-6 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-3 border-b border-surface-variant/30 dark:border-zinc-800">
                                <h3 className="text-sm font-bold text-[#004229] dark:text-[#8cd6ac]">Edit Statistik</h3>
                                <button
                                    type="button"
                                    onClick={() => { setShowStatForm(false); setEditingStat(null); }}
                                    className="text-on-surface-variant hover:text-[#004229] p-1 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Judul (Label)</label>
                                    <Input
                                        value={statForm.label}
                                        onChange={e => setStatForm(prev => ({ ...prev, label: e.target.value }))}
                                        placeholder="Contoh: Dana Dihimpun"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jumlah (Value)</label>
                                    <Input
                                        value={statForm.value}
                                        onChange={e => setStatForm(prev => ({ ...prev, value: e.target.value }))}
                                        placeholder="Contoh: Rp 2,45 Miliar"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sub Judul (Keterangan)</label>
                                    <Input
                                        value={statForm.sub_label}
                                        onChange={e => setStatForm(prev => ({ ...prev, sub_label: e.target.value }))}
                                        placeholder="Contoh: Tahun 2026"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowStatForm(false); setEditingStat(null); }}
                                    className="text-xs"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="text-xs"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Transparency Stats Table */}
                    {loadingStats ? (
                        <p className="text-xs text-on-surface-variant italic py-4 text-center">Memuat data statistik...</p>
                    ) : (
                        <div className="border border-surface-variant/40 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#181818]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jakarta text-sm">
                                    <thead className="bg-slate-50 dark:bg-zinc-800/60 border-b border-surface-variant/30 dark:border-zinc-800 text-on-surface-variant text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Judul</th>
                                            <th className="px-6 py-4">Sub Judul</th>
                                            <th className="px-6 py-4">Jumlah</th>
                                            {canUpdateStats && <th className="px-6 py-4 text-right">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-variant/20 dark:divide-zinc-800/60">
                                        {stats.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-xs text-on-surface-variant italic">
                                                    Belum ada statistik.
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.map((stat) => (
                                                <tr key={stat.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-semibold">{stat.label}</td>
                                                    <td className="px-6 py-4 text-xs text-on-surface-variant">{stat.sub_label || "-"}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-[#075C3B] dark:text-[#8cd6ac]">{stat.value}</td>
                                                    {canUpdateStats && (
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleEditStatClick(stat)}
                                                                className="text-on-surface-variant hover:text-[#075C3B] dark:hover:text-[#8cd6ac] transition-colors p-1.5 inline-flex items-center gap-1 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                                                                title="Edit Statistik"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                <span>Edit</span>
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-[#181818] p-4 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari judul atau deskripsi dokumen..."
                            defaultValue={search}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white dark:bg-[#181818] rounded-2xl shadow-sm border border-surface-variant/40 dark:border-zinc-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Judul</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-on-surface-variant py-8">
                                        Tidak ada dokumen ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documentList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getDocumentTypeLabel(item.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.year}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_public ? "success" : "warning"}>
                                                {item.is_public ? "Publik" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2 flex justify-end">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={item.document_url} target="_blank" rel="noopener noreferrer" title="Unduh Dokumen">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Can required="dokumentasi.update">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                                <Can required="dokumentasi.delete">
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            <AdminDocumentModal
                open={isModalOpen}
                onClose={handleCloseModal}
                editId={editingId}
            />
        </>
    );
}
