import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionContainerProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  /** Visually hidden heading for screen readers when no visible h2 is present */
  ariaLabel?: string;
};

export function SectionContainer({
  id,
  children,
  className,
  as: Tag = "section",
  ariaLabel,
}: SectionContainerProps) {
  return (
    <Tag id={id} aria-label={ariaLabel} className={cn("py-14 sm:py-16 lg:py-20", className)}>
      <div className="container-7xl">{children}</div>
    </Tag>
  );
}
