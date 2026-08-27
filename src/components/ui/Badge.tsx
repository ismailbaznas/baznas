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
          "border-transparent bg-primary text-on-primary shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80",
        destructive:
          "border-transparent bg-status-danger text-on-status-danger shadow hover:bg-status-danger/80",
        success:
          "border-transparent bg-status-success text-on-status-success shadow hover:bg-status-success/80",
        warning:
          "border-transparent bg-status-warning text-on-status-warning shadow hover:bg-status-warning/80",
        outline: "text-on-surface-variant",
        // Kemenhaj style for contrast
        inverse: "bg-on-background text-background shadow hover:bg-on-background/80"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
