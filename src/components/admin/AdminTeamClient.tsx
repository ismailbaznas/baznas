// src/components/admin/AdminTeamClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Pagination } from "../ui/Pagination";
import { Database } from "@/types/database.types";
import { getSupabaseBrowser } from "@/lib/supabase";
import dynamic from "next/dynamic";
import ImagePlaceholder from "../ImagePlaceholder";

const AdminTeamModal = dynamic(() => import("./AdminTeamModal"), { ssr: false });


// Types derived from DB structure
type TeamMemberItem = Database["public"]["Tables"]["team_members"]["Row"];

interface AdminTeamClientProps {
    initialTeam: TeamMemberItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
}

export default function AdminTeamClient({
    initialTeam,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
}: AdminTeamClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [teamList, setTeamList] = useState(initialTeam);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setTeamList(initialTeam);
    }, [initialTeam]);

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
        if (!can("team_members", "delete") || !confirm("Apakah Anda yakin ingin menghapus anggota tim ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('team_members').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus anggota tim: ${error.message}`);
        } else {
            setTeamList(prev => prev.filter(item => item.id !== id));
            router.refresh(); // Refetch data
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
                            Pimpinan & Struktur Organisasi
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} profil pengurus dan pimpinan terdaftar.
                        </p>
                    </div>
                    <Can required="team_members.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Tambah Anggota</span>
                        </Button>
                    </Can>
                </div>

                {/* Search Section */}
                <div className="bg-white dark:bg-[#181818] p-4 rounded-2xl border border-surface-variant/40 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari nama atau jabatan anggota..."
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
                                <TableHead className="w-[5%]">Foto</TableHead>
                                <TableHead className="w-[30%]">Nama</TableHead>
                                <TableHead className="w-[30%]">Jabatan</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-on-surface-variant py-8">
                                        Tidak ada anggota tim ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                teamList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <ImagePlaceholder src={item.photo_url} className="w-full h-full" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.position}</TableCell>
                                        <TableCell>{item.sort_order}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_active ? "success" : "warning"}>
                                                {item.is_active ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2 flex justify-end">
                                                <Can required="team_members.update">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                                <Can required="team_members.delete">
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
            <AdminTeamModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editId={editingId} 
            />
        </>
    );
}
