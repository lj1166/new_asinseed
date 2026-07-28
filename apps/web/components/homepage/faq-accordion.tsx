import type { HomepageFaqEntry } from "@new-asinseed/contracts";

import type { HomepageCopy } from "@/lib/homepage-content";

interface FaqAccordionProps {
  heading: string;
  entries: HomepageFaqEntry[];
  contacts: HomepageCopy["faq"]["contacts"];
}

export function FaqAccordion({ heading, entries, contacts }: FaqAccordionProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>
      <div className="mb-8 flex flex-col divide-y divide-border rounded-md border">
        {entries.map((entry, index) => (
          <details key={`${entry.question}-${index}`} className="p-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">{entry.question}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{entry.answer}</p>
          </details>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {contacts.map((contact) => (
          <div key={contact.title} className="rounded-md border p-4">
            <p className="mb-1 font-medium">{contact.title}</p>
            <p className="mb-3 text-sm text-muted-foreground">{contact.body}</p>
            {contact.linkHref ? (
              <a
                href={contact.linkHref}
                target={contact.linkOpensNewTab ? "_blank" : undefined}
                rel={contact.linkOpensNewTab ? "noreferrer" : undefined}
                className="text-sm font-medium underline underline-offset-2"
              >
                {contact.linkLabel}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{contact.linkLabel}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
