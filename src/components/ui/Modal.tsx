// src/components/ui/Modal.tsx

"use client";

import { X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  const modalClass = cn(
    "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 p-4",
    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  );

  const contentClass = cn(
    "bg-white dark:bg-surface border border-surface-variant/50 dark:border-surface-variant/80 rounded-2xl shadow-2xl transition-all duration-300 transform p-6 md:p-8 w-full mx-auto max-h-[90dvh] overflow-y-auto text-on-surface",
    sizeClasses[size],
    open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
  );

  // Handle outside click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={cn(modalClass, "bg-black/60 backdrop-blur-sm")} onClick={handleBackdropClick}>
      <div className={contentClass}>
        <div className="flex justify-between items-center pb-4 border-b border-surface-variant/30 dark:border-zinc-800 mb-6">
          <h2 className="text-xl font-playfair font-bold text-primary dark:text-white">{title}</h2>
          <button 
            type="button" 
            onClick={onClose}
            aria-label="Tutup dialog"
            className="text-on-surface-variant hover:text-primary dark:hover:text-white w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] dark:focus-visible:ring-[#8cd6ac] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
