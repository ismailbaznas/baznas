// src/components/admin/AdminRolesClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { RBACUser, Role, PermissionId } from "@/types/rbac";
import { Can } from "../rbac/Can";
import dynamic from "next/dynamic";

const AdminRolesModal = dynamic(() => import("./AdminRolesModal"), { ssr: false });

interface AdminRolesClientProps {
    initialRoles: Role[];
    user: RBACUser;
    allPermissions: PermissionId[];
}

export default function AdminRolesClient({
    initialRoles,
    user,
    allPermissions,
}: AdminRolesClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    // Function to handle modal close and potential data refetch
    const handleCloseModal = (refetch: boolean = false) => {
        setIsModalOpen(false);
        setEditingRole(null);
        if (refetch) {
            router.refresh(); // Triggers Server Component to fetch new data
        }
    }

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!can("role", "manage") || !confirm(`Apakah Anda yakin ingin menghapus peran '${id}'? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        try {
            const response = await fetch("/api/rbac/roles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal menghapus peran.");
            }

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
                        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#004229] dark:text-[#8cd6ac]">
                            Manajemen Peran & Hak Akses
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Total {initialRoles.length} peran sistem dan kustom terdaftar.
                        </p>
                    </div>
                    <Can required="role.manage">
                        <Button onClick={handleCreate} className="space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Buat Peran Baru</span>
                        </Button>
                    </Can>
                </div>

                <div className="bg-white dark:bg-[#181818] rounded-2xl shadow-sm border border-surface-variant/40 dark:border-zinc-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[10%]">ID</TableHead>
                                <TableHead className="w-[20%]">Nama Peran</TableHead>
                                <TableHead className="w-[30%]">Deskripsi</TableHead>
                                <TableHead className="w-[15%]">Hak Akses</TableHead>
                                <TableHead className="w-[10%]">Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialRoles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-on-surface-variant py-8">
                                        Tidak ada peran ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialRoles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-mono text-xs text-on-surface-variant">{role.id}</TableCell>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell className="text-sm text-on-surface-variant">{role.description || "—"}</TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {role.permission_ids?.length || 0} Hak Akses
                                        </TableCell>
                                        <TableCell>
                                            {role.is_system ? (
                                                <Badge variant="warning">
                                                    Sistem
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Kustom
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-x-2 flex justify-end">
                                                <Can required="role.manage">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(role)} title="Edit Role">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                                <Can required="role.manage">
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(role.id)} disabled={role.is_system} title="Hapus Role">
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
            </div>

            {/* Modal */}
            <AdminRolesModal 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                editRole={editingRole}
                allPermissions={allPermissions}
            />
        </>
    );
}
