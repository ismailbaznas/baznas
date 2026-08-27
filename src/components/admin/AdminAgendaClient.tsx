// src/components/admin/AdminAgendaClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, Calendar, MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Pagination } from "../ui/Pagination";
import { Database } from "@/types/database.types";
import { getSupabaseBrowser } from "@/lib/supabase";
import AdminAgendaModal from "./AdminAgendaModal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { VariantProps } from "class-variance-authority";


// Types derived from DB structure
type AgendaItem = Database["public"]["Tables"]["agendas"]["Row"];
type BadgeVariant = VariantProps<typeof Badge>["variant"];

interface AdminAgendaClientProps {
    initialAgendas: AgendaItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
}

const getStatusBadge = (status: string): { label: string, variant: BadgeVariant } => {
    switch (status) {
        case "scheduled":
            return { label: "Terjadwal", variant: "default" };
        case "ongoing":
            return { label: "Berlangsung", variant: "success" };
        case "completed":
            return { label: "Selesai", variant: "secondary" };
        case "cancelled":
            return { label: "Dibatalkan", variant: "destructive" };
        default:
            return { label: "Draft", variant: "warning" };
    }
}

const MappedTableRows = ({ agendaList, handleEdit, handleDelete }: { agendaList: AgendaItem[], handleEdit: (id: string) => void, handleDelete: (id: string) => void }) => {
    return agendaList.map((item) => {
                const { label, variant } = getStatusBadge(item.status);
                const isPublic = item.is_public;
                const startTime = new Date(item.start_time);
                
                return (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                                <Calendar className="w-4 h-4 text-on-surface-variant" />
                                <span>{format(startTime, "dd MMMM yyyy, HH:mm", { locale: id })} WIT</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-start space-x-1 text-sm">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-on-surface-variant mt-0.5" />
                                <span className="truncate">{item.location}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <Badge variant={variant}>
                                    {label}
                                </Badge>
                                <Badge variant={isPublic ? "success" : "warning"}>
                                    {isPublic ? "Publik" : "Internal"}
                                </Badge>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="space-x-2 flex justify-end">
                                <Can required="agenda.update">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Can>
                                <Can required="agenda.delete">
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </Can>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })
};

export default function AdminAgendaClient({
    initialAgendas,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
}: AdminAgendaClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [agendaList, setAgendaList] = useState(initialAgendas);
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
        if (!can("agenda", "delete") || !confirm("Apakah Anda yakin ingin menghapus Agenda ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('agendas').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus agenda: ${error.message}`);
        } else {
            router.refresh(); // Refetch data
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-headline-md font-space-grotesk">
                        Daftar Agenda Kegiatan ({totalItems})
                    </h1>
                    <Can required="agenda.create">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Buat Agenda Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* Search and Filter Section */}
                <div className="flex space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari judul atau lokasi agenda..."
                            defaultValue={search}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-surface rounded-xl shadow-lg border border-surface-variant overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Kegiatan</TableHead>
                                <TableHead className="w-[20%]">Waktu</TableHead>
                                <TableHead className="w-[25%]">Lokasi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agendaList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-on-surface-variant py-8">
                                        Tidak ada agenda ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <MappedTableRows agendaList={agendaList} handleEdit={handleEdit} handleDelete={handleDelete} />
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            {/* Modal */}
            <AdminAgendaModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editId={editingId} 
            />
        </>
    );
}