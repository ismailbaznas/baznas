// src/components/admin/AdminPesanClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Eye, Trash2, Search, Mail, Phone, Clock, MessageSquare } from "lucide-react";
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
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { VariantProps } from "class-variance-authority";

const AdminPesanModal = dynamic(() => import("./AdminPesanModal"), { ssr: false });

// Types derived from DB structure
type MessageItem = Database["public"]["Tables"]["contact_messages"]["Row"];
type BadgeVariant = VariantProps<typeof Badge>["variant"];

interface AdminPesanClientProps {
    initialMessages: MessageItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
    messageTypes: { label: string; value: string }[];
}

const getStatusBadge = (status: string): { label: string, variant: BadgeVariant } => {
    switch (status) {
        case "new":
            return { label: "Baru", variant: "destructive" };
        case "in_progress":
            return { label: "Diproses", variant: "warning" };
        case "closed":
            return { label: "Selesai", variant: "success" };
        default:
            return { label: "Tidak Diketahui", variant: "secondary" };
    }
}

const MappedTableRows = ({ messageList, handleView, handleDelete, getTypeLabel }: { messageList: MessageItem[], handleView: (id: string) => void, handleDelete: (id: string) => void, getTypeLabel: (value: string) => string }) => {
    return messageList.map((item) => {
                const statusData = getStatusBadge(item.status);
                
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <div className="font-medium truncate">{item.subject}</div>
                            <div className="text-sm text-on-surface-variant flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{item.name}</span>
                                {item.phone && (
                                    <>
                                    <span className="mx-1">•</span>
                                    <Phone className="w-3 h-3" />
                                    <span className="truncate">{item.phone}</span>
                                    </>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{getTypeLabel(item.type)}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={statusData.variant}>{statusData.label}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-on-surface-variant">
                                <Clock className="w-4 h-4" />
                                <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="space-x-2 flex justify-end">
                                <Can required="contact_messages.read">
                                    <Button variant="outline" size="sm" onClick={() => handleView(item.id)} title="Lihat Detail Pesan">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </Can>
                                <Can required="contact_messages.delete">
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} title="Hapus Pesan">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </Can>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })
};


export default function AdminPesanClient({
    initialMessages,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
    messageTypes
}: AdminPesanClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [messageList, setMessageList] = useState(initialMessages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingId, setViewingId] = useState<string | null>(null);

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setMessageList(initialMessages);
    }, [initialMessages]);

    // Function to handle modal close and potential data refetch
    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setViewingId(null);
        if (refetch) {
            router.refresh(); // Triggers Server Component to fetch new data
        }
    }

    const handleView = (id: string) => {
        setViewingId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!can("contact_messages", "delete") || !confirm("Apakah Anda yakin ingin menghapus Pesan ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);

        if (error) {
            alert(`Gagal menghapus pesan: ${error.message}`);
        } else {
            setMessageList(prev => prev.filter(item => item.id !== id));
            router.refresh(); // Refetch data
        }
    };

    const getTypeLabel = (value: string) => {
        return messageTypes.find(t => t.value === value)?.label || value;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white tracking-tight">
                            Pesan Masuk & Pengaduan
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} pesan dan konsultasi masuk dari masyarakat.
                        </p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-slate-200/90 dark:border-[#0f4018] flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari nama, subjek, atau isi pesan..."
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
                                <TableHead className="w-[30%]">Subjek & Pengirim</TableHead>
                                <TableHead className="w-[15%]">Jenis</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[15%]">Waktu</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messageList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-on-surface-variant py-8">
                                        Tidak ada pesan masuk.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <MappedTableRows messageList={messageList} handleView={handleView} handleDelete={handleDelete} getTypeLabel={getTypeLabel} />
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            {/* Modal */}
            <AdminPesanModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                messageId={viewingId} 
            />
        </>
    );
}