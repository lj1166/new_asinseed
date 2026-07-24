import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Applies a muted background band, used to separate adjacent sections without borders. */
  tone?: "default" | "muted";
  /** Renders children inside the shared max-width Container. Set false when a section needs full-bleed content. */
  container?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, tone = "default", container = true, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-16 sm:py-20", tone === "muted" && "bg-muted/50", className)}
      {...props}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  ),
);
Section.displayName = "Section";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  /** Heading level for the section title — defaults to h2 since the page H1 lives in the Hero. */
  as?: "h2" | "h3";
}

function SectionHeader({ eyebrow, title, description, className, align = "left", as: Heading = "h2" }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      ) : null}
      <Heading className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</Heading>
      {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export { Section, SectionHeader };
