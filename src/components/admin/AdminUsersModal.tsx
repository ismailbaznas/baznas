// src/components/admin/AdminUsersModal.tsx

"use client";

import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { RBACUser, Role } from "@/types/rbac";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

type UserItem = {
    id: string;
    email: string;
    name: string | null;
    role: string | null;
    created_at: string;
    last_active_at: string;
    roles: { name: string } | null;
};

interface AdminUsersModalProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  editUser: UserItem | null;
  rolesList: Role[];
  currentUser: RBACUser;
}

// Initial form state
const initialFormState = {
  id: "", // Only for editing existing user
  email: "",
  name: "",
  role: "",
  password: "",
};

export default function AdminUsersModal({
  open,
  onClose,
  editUser,
  rolesList,
  currentUser,
}: AdminUsersModalProps) {
  const [form, setForm] = useState<typeof initialFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editUser;
  const isSelf = editUser?.id === currentUser?.id;

  // Load data for editing
  useEffect(() => {
    if (editUser && open) {
      setForm({
        id: editUser.id,
        email: editUser.email,
        name: editUser.name || "",
        role: editUser.role || "",
        password: "", // Never expose password
      });
      setError(null);
    } else if (open) {
      // Reset form for creation (Invitation)
      setForm(initialFormState);
      setError(null);
    }
  }, [editUser, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isEditing ? "/api/rbac/users" : "/api/rbac/invite"; // Assume we will create a general user API

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan pengguna.");
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
      title={isEditing ? `Edit Pengguna: ${editUser?.name || editUser?.email}` : "Kirim Undangan Admin Baru"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
            {error}
          </div>
        )}

        {/* Info */}
        {!isEditing && (
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center space-x-2 text-sm text-primary-dark">
                <CheckCircle className="w-5 h-5" />
                <span>Undangan akan dikirim via email. Pengguna akan mengatur password mereka sendiri.</span>
            </div>
        )}
        
        {/* Email (Readonly if editing) */}
        <div>
            <label htmlFor="email" className="block text-body-md font-medium mb-1">Email</label>
            <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={isEditing && !isSelf}
                required
            />
        </div>
        
        {/* Name & Role */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-body-md font-medium mb-1">Nama Pengguna</label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="role" className="block text-body-md font-medium mb-1">Peran (Role)</label>
                <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={isSelf} // Prevent user from changing their own role
                    className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                >
                    <option value="" disabled>-- Pilih Peran --</option>
                    {rolesList.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="space-x-2">
            <span>
              {loading
                ? "Menyimpan..."
                : isEditing
                ? "Simpan Perubahan"
                : "Kirim Undangan"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
