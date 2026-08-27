// src/components/ui/Button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-body-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:bg-primary/90 shadow-md",
        destructive: "bg-status-danger text-on-status-danger hover:bg-status-danger/90",
        outline: "border border-input bg-background hover:bg-surface-variant hover:text-on-surface-variant",
        "outline-gold": "border border-primary/40 text-primary-dark hover:bg-primary/10 hover:border-primary/60",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary/80",
        ghost: "hover:bg-surface-variant hover:text-on-surface-variant",
        link: "text-primary underline-offset-4 hover:underline",
        // Inverse for dark background compatibility (Kemenhaj style)
        inverse: "bg-on-background text-background hover:bg-on-background/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
