// src/components/admin/AdminRolesModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PermissionId, Role } from "@/types/rbac";
import { useState, useEffect } from "react";
import { PermissionEditor } from "../rbac/PermissionEditor";
import { CheckCircle, XCircle } from "lucide-react";

interface AdminRolesModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editRole: Role | null;
  allPermissions: PermissionId[];
}

// Initial form state
const initialFormState = {
  id: "",
  name: "",
  description: "",
  permission_ids: [] as PermissionId[],
  is_system: false,
};

export default function AdminRolesModal({
  open,
  onClose,
  editRole,
}: AdminRolesModalProps) {
  const [form, setForm] = useState<typeof initialFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editRole;
  const isSystem = editRole?.is_system;

  // Load data for editing
  useEffect(() => {
    if (editRole && open) {
      setForm({
        id: editRole.id,
        name: editRole.name,
        description: editRole.description || "",
        permission_ids: editRole.permission_ids || [],
        is_system: editRole.is_system,
      });
      setError(null);
    } else if (open) {
      // Reset form for creation
      setForm(initialFormState);
      setError(null);
    }
  }, [editRole, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permissions: PermissionId[]) => {
    setForm((prev) => ({
      ...prev,
      permission_ids: permissions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch("/api/rbac/roles", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan peran.");
      }

      onClose(true); // Close and signal refetch
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={isEditing ? `Edit Peran: ${editRole?.name}` : "Buat Peran Baru"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Role ID & Name */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="id" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    ID Peran (Slug)
                </label>
                <Input
                    id="id"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    disabled={isEditing}
                    required
                />
                <p className="text-xs text-on-surface-variant mt-1">
                    ID tidak dapat diubah setelah dibuat.
                </p>
            </div>
            <div>
                <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Nama Peran
                </label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Deskripsi
          </label>
          <Input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* System Role Indicator */}
        {isEditing && isSystem && (
            <div className="p-3 bg-status-warning/10 border border-status-warning text-status-warning rounded-lg flex items-center space-x-2 text-sm">
                <CheckCircle className="w-5 h-5 text-status-warning" />
                <span>Peran ini adalah Peran Sistem. Anda dapat menyesuaikan hak aksesnya, tetapi perannya tidak dapat dihapus.</span>
            </div>
        )}
        
        {/* Permission Editor */}
        <PermissionEditor
            selectedPermissions={form.permission_ids}
            onChange={handlePermissionChange}
            disabled={loading}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="space-x-2">
            <span>
              {loading
                ? "Menyimpan..."
                : "Simpan Peran"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
