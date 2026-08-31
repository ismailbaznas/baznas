// src/components/rbac/PermissionEditor.tsx

"use client";

import { BAZNAS_MODULES, ALL_PERMISSIONS } from "@/lib/rbac/constants";
import { PermissionId } from "@/types/rbac";
import { cn } from "@/lib/utils";

interface PermissionEditorProps {
  selectedPermissions: PermissionId[];
  onChange: (permissions: PermissionId[]) => void;
  disabled?: boolean;
}

export function PermissionEditor({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionEditorProps) {
  const modules = Object.keys(BAZNAS_MODULES) as Array<keyof typeof BAZNAS_MODULES>;

  const togglePermission = (id: PermissionId, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, id]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== id));
    }
  };

  const toggleModule = (moduleKey: keyof typeof BAZNAS_MODULES, checked: boolean) => {
    const modulePermissions = ALL_PERMISSIONS.filter((p) => p.module === moduleKey).map((p) => p.id);
    let newPermissions = selectedPermissions.filter((p) => !modulePermissions.includes(p));

    if (checked) {
      newPermissions = [...newPermissions, ...modulePermissions];
    }
    onChange(newPermissions);
  };

  return (
    <div className="space-y-4 font-jakarta">
      <h3 className="text-base font-bold text-primary dark:text-white border-b border-surface-variant/40 dark:border-zinc-800 pb-2">
        Atur Hak Akses Modul
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((moduleKey) => {
          const module = BAZNAS_MODULES[moduleKey];
          const modulePermissions = ALL_PERMISSIONS.filter((p) => p.module === moduleKey);
          const allModuleSelected = modulePermissions.every((p) => selectedPermissions.includes(p.id));

          return (
            <div key={moduleKey} className="border border-surface-variant/50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-surface-variant/40 dark:border-zinc-800">
                <input
                  type="checkbox"
                  id={`module-${moduleKey}`}
                  checked={allModuleSelected}
                  onChange={(e) => toggleModule(moduleKey, e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300 dark:border-zinc-700 text-[#075C3B] focus:ring-[#075C3B] dark:bg-zinc-800"
                />
                <label htmlFor={`module-${moduleKey}`} className={cn("text-xs font-bold uppercase tracking-wider", disabled ? "text-on-surface-variant" : "text-on-surface")}>
                  {module.name}
                </label>
              </div>

              <div className="space-y-1.5 ml-3">
                {modulePermissions.map((permission) => {
                  const isChecked = selectedPermissions.includes(permission.id);
                  return (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={isChecked}
                        onChange={(e) => togglePermission(permission.id, e.target.checked)}
                        disabled={disabled}
                        className="h-3.5 w-3.5 rounded border-gray-300 dark:border-zinc-700 text-[#075C3B] focus:ring-[#075C3B] dark:bg-zinc-800"
                      />
                      <label htmlFor={permission.id} className="text-xs font-medium text-on-surface-variant">
                        {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
