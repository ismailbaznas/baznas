// src/components/ui/Logo.tsx

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface LogoProps {
    className?: string;
    variant?: "default" | "white";
    showText?: boolean;
}

export default function Logo({ className, variant = "default", showText = true }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-2.5 transition-opacity hover:opacity-95 group", className)}>
            <Image 
                src="/images/logo-header.png" 
                alt="BAZNAS Kabupaten Boven Digoel" 
                width={48}
                height={48}
                priority
                className="h-12 w-auto object-contain rounded-sm"
            />
            {showText && (
                <div className="flex flex-col justify-center text-left">
                    <span className={cn(
                        "text-lg font-bold tracking-tight leading-none font-jakarta",
                        variant === "white" ? "text-white" : "text-[#004229] dark:text-white"
                    )}>
                        BAZNAS
                    </span>
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold leading-none mt-0.5 font-jakarta",
                        variant === "white" ? "text-white/80" : "text-[#075C3B] dark:text-[#8cd6ac]"
                    )}>
                        Boven Digoel
                    </span>
                </div>
            )}
        </Link>
    );
}
