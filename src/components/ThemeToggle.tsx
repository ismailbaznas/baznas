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
          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-all duration-150 border border-white/25 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004229] shadow-sm cursor-pointer"
          aria-label={isDark ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
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
        className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all duration-150 border border-surface-variant/40 dark:border-zinc-700 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] focus-visible:ring-offset-2 shadow-sm cursor-pointer"
        aria-label={isDark ? "Beralih ke tema terang" : "Beralih ke tema gelap"}
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
