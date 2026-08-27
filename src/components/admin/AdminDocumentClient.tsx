// src/components/admin/AdminDocumentClient.tsx

"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, FileText, Download } from "lucide-react";
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
import AdminDocumentModal from "./AdminDocumentModal";

// Types derived from DB structure
type DocumentItem = Database["public"]["Tables"]["documents"]["Row"];

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
        if (!confirm("Apakah Anda yakin ingin menghapus Dokumen ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('documents').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus dokumen: ${error.message}`);
        } else {
            router.refresh(); // Refetch data
        }
    };

    // Helper to get label from value
    const getDocumentTypeLabel = (value: string) => {
        return documentTypes.find(t => t.value === value)?.label || value;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-headline-md font-space-grotesk">
                        Daftar Dokumen Transparansi ({totalItems})
                    </h1>
                    <Can required="dokumentasi.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Unggah Dokumen Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* Search and Filter Section */}
                <div className="flex space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari judul atau deskripsi dokumen..."
                            defaultValue={search}
                            className="pl-10"
                        />
                    </div>
                    {/* Placeholder for Type Filter */}
                    <Button variant="outline" className="space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Filter Jenis</span>
                    </Button>
                </div>

                {/* Main Table */}
                <div className="bg-surface rounded-xl shadow-lg border border-surface-variant overflow-hidden">
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

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            {/* Modal */}
            <AdminDocumentModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editId={editingId} 
            />
        </>
    );
}
