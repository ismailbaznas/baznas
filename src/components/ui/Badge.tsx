// src/components/ui/Badge.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#075C3B] text-white shadow-sm hover:bg-[#004229]",
        secondary:
          "border-surface-variant/60 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300",
        destructive:
          "border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400",
        success:
          "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
        warning:
          "border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
        outline: "border-slate-300 dark:border-zinc-700 text-on-surface",
        inverse: "bg-white text-[#1F2937] shadow-sm"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
