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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Atur Hak Akses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((moduleKey) => {
          const module = BAZNAS_MODULES[moduleKey];
          const modulePermissions = ALL_PERMISSIONS.filter((p) => p.module === moduleKey);
          const allModuleSelected = modulePermissions.every((p) => selectedPermissions.includes(p.id));

          return (
            <div key={moduleKey} className="border border-surface-variant rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <input
                  type="checkbox"
                  id={`module-${moduleKey}`}
                  checked={allModuleSelected}
                  onChange={(e) => toggleModule(moduleKey, e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`module-${moduleKey}`} className={cn("font-medium", disabled ? "text-on-surface-variant" : "text-on-surface")}>
                  {module.name}
                </label>
              </div>

              <div className="space-y-1 ml-4">
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
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={permission.id} className="text-body-md text-on-surface-variant">
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
