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
    "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  );

  const contentClass = cn(
    "bg-surface rounded-xl shadow-2xl transition-all duration-300 transform p-6 md:p-8 w-full mx-4",
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
    <div className={modalClass} onClick={handleBackdropClick}>
      <div className={contentClass}>
        <div className="flex justify-between items-center pb-4 border-b border-surface-variant mb-4">
          <h2 className="text-xl font-space-grotesk font-semibold text-on-surface">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-on-surface-variant" />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
