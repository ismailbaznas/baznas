// src/components/ImagePlaceholder.tsx

import { Image, User } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface ImagePlaceholderProps {
    src?: string | null;
    alt?: string;
    className?: string;
}

// Simple image component that handles URL display and falls back to a placeholder icon.
const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ src, alt, className }) => {
    // Note: In a real app, this should be SafeImage using Next/Image and remote patterns.
    if (src) {
        // Warning: Using standard <img> tag here. Next.js best practice uses <Image> component.
        // This is a temporary placeholder until full SafeImage component is implemented.
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt || "Foto Anggota"} className={cn("object-cover", className)} />
        );
    }
    
    return (
        <div className={cn("flex items-center justify-center bg-surface-variant text-on-surface-variant", className)}>
            <User className="w-1/2 h-1/2" />
        </div>
    );
}

export default ImagePlaceholder;
