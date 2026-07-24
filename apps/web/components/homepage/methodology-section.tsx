import type { HomepageTestimonialEntry } from "@new-asinseed/contracts";

import { PartnersSection } from "@/components/homepage/partners-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import type { HomepageSectionsCopy, PartnerLink } from "@/lib/homepage-content";

interface MethodologySectionProps {
  header: HomepageSectionsCopy["methodology"];
  testimonials: HomepageTestimonialEntry[];
  partnersHeading: string;
  partners: PartnerLink[];
}

/**
 * Reuses the already-verified `TestimonialsSection`/`PartnersSection` as
 * plain siblings (not nested in `Container`) since each supplies its own
 * `mx-auto max-w-5xl px-4 py-12` wrapper.
 */
export function MethodologySection({ header, testimonials, partnersHeading, partners }: MethodologySectionProps) {
  return (
    <Section tone="muted" container={false}>
      <Container>
        <SectionHeader eyebrow={header.eyebrow} title={header.title} description={header.description} />

        <ol className="mb-4 grid gap-6 sm:grid-cols-3">
          {header.steps.map((step, index) => (
            <li key={step.title} className="rounded-md border bg-background p-4">
              <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <p className="mb-1 font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <h3 className="mb-2 mt-12 text-lg font-semibold">{header.credibilityHeading}</h3>
      </Container>

      <TestimonialsSection entries={testimonials} />
      <PartnersSection heading={partnersHeading} partners={partners} />
    </Section>
  );
}
