// src/components/ThemeToggle.tsx

"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  showLabel?: boolean;
  variant?: "default" | "footer";
  className?: string;
}

export function ThemeToggle({ showLabel = false, variant = "default", className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;
  const labelText = isDark ? "Mode Gelap" : "Mode Terang";

  if (variant === "footer") {
    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        {showLabel && (
          <span className="text-white/90 font-medium text-xs select-none">
            {labelText}
          </span>
        )}
        <button
          onClick={toggleTheme}
          type="button"
          title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-all duration-200 border border-white/25 hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Ubah tema tampilan"
        >
          {isDark ? (
            <Sun className="h-4 w-4 fill-amber-300 text-amber-300" />
          ) : (
            <Moon className="h-4 w-4 fill-white text-white" />
          )}
        </button>
      </div>
    );
  }

  // Default variant (used in TopAppBar Header)
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {showLabel && (
        <span className="text-xs font-semibold text-on-surface-variant select-none">
          {labelText}
        </span>
      )}
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all duration-200 border border-surface-variant/40 dark:border-zinc-700 hover:scale-105 active:scale-95 shadow-sm"
        aria-label="Ubah tema tampilan"
      >
        {isDark ? (
          <Sun className="h-4 w-4 fill-amber-400 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 fill-[#004229] text-[#004229]" />
        )}
      </button>
    </div>
  );
}
