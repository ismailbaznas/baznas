// src/components/admin/AdminBeritaClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, Calendar, Package } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";
import { RBACUser } from "@/types/rbac";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Can } from "../rbac/Can";
import { Database } from "@/types/database.types";
import { Pagination } from "../ui/Pagination";
import dynamic from "next/dynamic";
import { getSupabaseBrowser } from "@/lib/supabase";

const AdminBeritaModal = dynamic(() => import("./AdminBeritaModal"), { ssr: false });

// Types derived from DB structure
type NewsItem = Database["public"]["Tables"]["news"]["Row"] & {
    categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];

interface AdminBeritaClientProps {
    initialNews: NewsItem[];
    initialCategories: Category[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
}

export default function AdminBeritaClient({
    initialNews,
    initialCategories,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
}: AdminBeritaClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [newsList, setNewsList] = useState(initialNews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setNewsList(initialNews);
    }, [initialNews]);

    // Function to handle modal close and potential data refetch
    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setEditingId(null);
        if (refetch) {
            router.refresh();
        }
    }

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!can("berita", "delete") || !confirm("Apakah Anda yakin ingin menghapus Berita ini?")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('news').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus berita: ${error.message}`);
        } else {
            setNewsList(prev => prev.filter(item => item.id !== id));
            router.refresh(); // Refetch data
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white tracking-tight">
                            Daftar Berita & Artikel
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} berita dan artikel terdaftar dalam sistem.
                        </p>
                    </div>
                    <Can required="berita.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Buat Berita Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-slate-200/90 dark:border-[#0f4018] flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari judul atau konten berita..."
                            defaultValue={search}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200/90 dark:border-[#0f4018] overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Judul</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[15%]">Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-on-surface-variant py-8">
                                        Tidak ada berita ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                newsList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {item.categories?.name || "Tanpa Kategori"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_published ? "success" : "warning"}>
                                                {item.is_published ? "Terbit" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4 text-on-surface-variant" />
                                                <span>{format(new Date(item.published_at), "dd MMM yyyy", { locale: id })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2 flex justify-end">
                                                <Can required="berita.update">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)} aria-label="Edit berita" title="Edit berita">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                                <Can required="berita.delete">
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} aria-label="Hapus berita" title="Hapus berita">
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

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            {/* Modal */}
            <AdminBeritaModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editId={editingId} 
                categories={initialCategories}
            />
        </>
    );
}
