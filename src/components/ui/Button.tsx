// src/components/ui/Button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075C3B] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#075C3B] text-white hover:bg-[#004229] dark:bg-[#8cd6ac] dark:text-[#002112] dark:hover:bg-[#a8f3c7] shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 border border-transparent dark:border-red-900/40 shadow-sm",
        outline: "border border-surface-variant/60 dark:border-surface-variant/80 bg-white dark:bg-surface-variant text-on-surface hover:bg-slate-50 dark:hover:bg-surface",
        "outline-gold": "border border-[#D4AF37]/50 text-[#735c00] dark:text-[#ffe088] hover:bg-[#D4AF37]/10",
        secondary: "bg-[#D4AF37] text-[#241a00] hover:bg-[#e9c349] font-bold shadow-sm",
        ghost: "text-on-surface hover:bg-slate-100 dark:hover:bg-zinc-800",
        link: "text-[#075C3B] dark:text-[#8cd6ac] underline-offset-4 hover:underline",
        inverse: "bg-white text-[#1F2937] hover:bg-white/90 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
