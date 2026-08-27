// src/components/admin/AdminSettingsClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { RBACUser } from "@/types/rbac";
import { Can } from "../rbac/Can";
import { createServiceRoleClient } from "@/lib/supabase";
import { AlertTriangle, Save } from "lucide-react";

type Setting = {
    key: string;
    name: string;
    value: string;
};

interface AdminSettingsClientProps {
    initialSettings: Setting[];
    user: RBACUser;
}

export default function AdminSettingsClient({
    initialSettings,
    user,
}: AdminSettingsClientProps) {
    const router = useRouter();
    const { can } = useAdmin();
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const canUpdate = can("settings", "update");

    const handleChange = (key: string, value: string) => {
        setSettings(prev => prev.map(setting => 
            setting.key === key ? { ...setting, value } : setting
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!canUpdate) {
            setError("Anda tidak memiliki izin untuk mengubah pengaturan.");
            setLoading(false);
            return;
        }

        const supabase = createServiceRoleClient();
        
        // Prepare data for upsert
        const dataToUpsert = settings.map(setting => ({
            key: setting.key,
            value: { value: setting.value }, // Wrap value in JSONB object as per schema
            description: setting.name,
        }));

        const { error: dbError } = await (supabase.from("site_settings") as any).upsert(dataToUpsert);

        if (dbError) {
            setError("Gagal menyimpan pengaturan: " + dbError.message);
        } else {
            setSuccess("Pengaturan berhasil disimpan.");
            router.refresh();
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-headline-md font-space-grotesk">
                Pengaturan Situs
            </h1>
            
            {!canUpdate && (
                <div className="p-3 bg-status-warning/10 border border-status-warning text-status-warning rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-body-md">Anda hanya memiliki izin baca. Anda tidak dapat menyimpan perubahan.</p>
                </div>
            )}

            {error && (
                <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-status-success/10 border border-status-success text-status-success rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-xl shadow-lg border border-surface-variant">
                <div className="space-y-4">
                    {settings.map((setting) => (
                        <div key={setting.key}>
                            <label htmlFor={setting.key} className="block text-body-md font-medium mb-1">
                                {setting.name}
                            </label>
                            <Input
                                id={setting.key}
                                name={setting.key}
                                value={setting.value}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                disabled={!canUpdate || loading}
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Can required="settings.update">
                        <Button type="submit" disabled={loading || !canUpdate} className="space-x-2">
                            <Save className="w-5 h-5" />
                            <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
                        </Button>
                    </Can>
                </div>
            </form>
        </div>
    );
}
