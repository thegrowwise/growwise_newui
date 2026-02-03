import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<'div'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    const normalizeChild = (child: any) => {
      if (typeof child === 'boolean') return String(child)
      if (child === null) return ''
      return child
    }

    const normalizedChildren =
      typeof props.children === 'boolean' ||
      props.children === null ||
      typeof props.children === 'number' ||
      typeof props.children === 'string'
        ? normalizeChild(props.children)
        : React.Children.map(props.children, (child) => normalizeChild(child))

    return (
      <Comp
        ref={ref as any}
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {normalizedChildren}
      </Comp>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };