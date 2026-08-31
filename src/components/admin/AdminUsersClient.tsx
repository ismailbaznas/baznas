// src/components/admin/AdminUsersClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, Search, Clock, User, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { RBACUser, Role } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { Pagination } from "../ui/Pagination";
import dynamic from "next/dynamic";
import { formatDistanceToNow, format } from "date-fns";

const AdminUsersModal = dynamic(() => import("./AdminUsersModal"), { ssr: false });
import { id } from "date-fns/locale";

type UserItem = {
    id: string;
    email: string;
    name: string | null;
    role: string | null;
    created_at: string;
    last_active_at: string;
    roles: { name: string } | null;
};

interface AdminUsersClientProps {
    initialUsers: UserItem[];
    initialRoles: Role[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    search: string;
    pageSize: number;
    user: RBACUser;
}

const MappedTableRows = ({ userList, handleEdit, handleDelete, user }: { userList: UserItem[], handleEdit: (user: UserItem) => void, handleDelete: (id: string, email: string) => void, user: RBACUser }) => {
    return userList.map((item) => {
                const isSelf = item.id === user.id;
                
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <div className="font-medium">{item.name} {isSelf && "(Anda)"}</div>
                            <div className="text-sm text-on-surface-variant flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{item.email}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{item.roles?.name || "Tidak Ada Role"}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-on-surface-variant">
                                <Clock className="w-4 h-4" />
                                <span>{item.last_active_at ? formatDistanceToNow(new Date(item.last_active_at), { addSuffix: true, locale: id }) : 'Tidak aktif'}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            {format(new Date(item.created_at), "dd MMM yyyy", { locale: id })}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="space-x-2 flex justify-end">
                                <Can required="user.manage">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} aria-label="Edit pengguna" title="Edit pengguna">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Can>
                                <Can required="user.manage">
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.email)} disabled={isSelf} aria-label="Hapus pengguna" title="Hapus pengguna">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </Can>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })
};


export default function AdminUsersClient({
    initialUsers,
    initialRoles,
    totalItems,
    totalPages,
    currentPage,
    search,
    pageSize,
    user,
}: AdminUsersClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [userList, setUserList] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    // Synchronize local state whenever server props update (e.g. after router.refresh())
    useEffect(() => {
        setUserList(initialUsers);
    }, [initialUsers]);

    // Function to handle modal close and potential data refetch
    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setEditingUser(null);
        if (refetch) {
            router.refresh(); // Triggers Server Component to fetch new data
        }
    }

    const handleEdit = (user: UserItem) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleInvite = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, email: string) => {
        if (!can("user", "manage") || !confirm(`Apakah Anda yakin ingin menghapus pengguna ${email}? Tindakan ini akan menghapus akun Auth dan Admin User.`)) {
            return;
        }

        try {
            const response = await fetch("/api/rbac/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal menghapus pengguna.");
            }

            setUserList(prev => prev.filter(item => item.id !== id));
            router.refresh(); // Refetch data
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-primary dark:text-white tracking-tight">
                            Manajemen Pengguna Admin
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {totalItems} akun administrator terdaftar dalam sistem.
                        </p>
                    </div>
                    <Can required="user.manage">
                        <Button onClick={handleInvite} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Kirim Undangan Baru</span>
                        </Button>
                    </Can>
                </div>

                {/* Search Section */}
                <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-slate-200/90 dark:border-[#0f4018] flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Cari nama atau email pengguna..."
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
                                <TableHead className="w-[30%]">Pengguna</TableHead>
                                <TableHead className="w-[20%]">Peran (Role)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-on-surface-variant py-8">
                                        Tidak ada pengguna admin ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <MappedTableRows userList={userList} handleEdit={handleEdit} handleDelete={handleDelete} user={user} />
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} />

            </div>

            {/* Modal */}
            <AdminUsersModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editUser={editingUser} 
                rolesList={initialRoles}
                currentUser={user}
            />
        </>
    );
}