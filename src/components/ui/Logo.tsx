// src/components/ui/Logo.tsx

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Zap } from "lucide-react"; // Placeholder icon

interface LogoProps {
    className?: string;
}

// Note: In a real implementation, this would use the official BAZNAS logo
export default function Logo({ className }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center space-x-2 font-space-grotesk font-bold text-xl text-primary", className)}>
            <Zap className="w-6 h-6 text-primary-dark" />
            <span className="hidden sm:inline">BAZNAS BVD</span>
        </Link>
    );
}
