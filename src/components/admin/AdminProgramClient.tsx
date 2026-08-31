// src/components/admin/AdminProgramClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, Calendar, Package, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Pagination } from "../ui/Pagination";
import { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getSupabaseBrowser } from "@/lib/supabase";

const AdminProgramModal = dynamic(() => import("./AdminProgramModal"), { ssr: false });

// Types derived from DB structure
type ProgramItem = Database["public"]["Tables"]["programs"]["Row"] & {
    categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];


interface AdminProgramClientProps {
    initialPrograms: ProgramItem[];
    initialCategories: Category[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
}

export default function AdminProgramClient({
    initialPrograms,
    initialCategories,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
}: AdminProgramClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [programList, setProgramList] = useState(initialPrograms);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setProgramList(initialPrograms);
    }, [initialPrograms]);

    // Function to handle modal close and potential data refetch
    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setEditingId(null);
        if (refetch) {
            router.refresh(); // Triggers Server Component to fetch new data
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
        if (!confirm("Apakah Anda yakin ingin menghapus Program ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('programs').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus program: ${error.message}`);
        } else {
            setProgramList(prev => prev.filter(item => item.id !== id));
            router.refresh(); // Refetch data
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white tracking-tight">
                            Daftar Program Kerja
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} program penyaluran dan pemberdayaan terdaftar.
                        </p>
                    </div>
                    <Can required="program.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Buat Program Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-slate-200/90 dark:border-[#0f4018] flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari nama atau deskripsi program..."
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
                                <TableHead className="w-[40%]">Nama Program</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[15%]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-on-surface-variant py-8">
                                        Tidak ada program ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                programList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {item.categories?.name || "Tanpa Kategori"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {item.is_active ? (
                                                    <CheckCircle className="w-5 h-5 text-status-success" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-status-danger" />
                                                )}
                                                <Badge variant={item.is_active ? "success" : "destructive"}>
                                                    {item.is_active ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2 flex justify-end">
                                                <Can required="program.update">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)} aria-label="Edit program" title="Edit program">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                                <Can required="program.delete">
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} aria-label="Hapus program" title="Hapus program">
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
            <AdminProgramModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editId={editingId} 
                categories={initialCategories}
            />
        </>
    );
}
