import type { HomepageFaqEntry } from "@new-asinseed/contracts";

import { FaqAccordion } from "@/components/homepage/faq-accordion";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import type { HomepageCopy, HomepageSectionsCopy } from "@/lib/homepage-content";

interface ContentHubPreviewProps {
  header: HomepageSectionsCopy["contentHub"];
  faqHeading: string;
  faqEntries: HomepageFaqEntry[];
  faqContacts: HomepageCopy["faq"]["contacts"];
}

/**
 * Reuses the already-verified `FaqAccordion` as-is (rendered as a plain
 * sibling, not nested in `Container`) since it supplies its own
 * `mx-auto max-w-* px-4 py-12` wrapper — wrapping it again here would
 * double-apply container padding.
 */
export function ContentHubPreview({ header, faqHeading, faqEntries, faqContacts }: ContentHubPreviewProps) {
  return (
    <Section id="resources" container={false}>
      <Container>
        <SectionHeader eyebrow={header.eyebrow} title={header.title} description={header.description} />

        <div className="mb-4 grid gap-6 sm:grid-cols-2">
          {header.cards.map((card) => (
            <div key={card.title} className="rounded-md border p-4">
              <span className="mb-2 inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {card.badge}
              </span>
              <p className="mb-1 font-medium">{card.title}</p>
              <p className="text-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <FaqAccordion heading={faqHeading} entries={faqEntries} contacts={faqContacts} />
    </Section>
  );
}
