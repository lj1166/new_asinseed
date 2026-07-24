import Image from "next/image";

import type { HomepageTestimonialEntry } from "@new-asinseed/contracts";

interface TestimonialsSectionProps {
  entries: HomepageTestimonialEntry[];
}

export function TestimonialsSection({ entries }: TestimonialsSectionProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry, index) => (
          <blockquote key={`${entry.authorName}-${index}`} className="flex flex-col gap-3 rounded-md border p-4">
            <p className="text-sm text-muted-foreground">{entry.quoteText}</p>
            <footer className="mt-auto flex items-center gap-3">
              {entry.avatarUrl ? (
                <Image
                  src={entry.avatarUrl}
                  alt={entry.authorName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : null}
              <div>
                <p className="text-sm font-medium">{entry.authorName}</p>
                {entry.authorTitle ? <p className="text-xs text-muted-foreground">{entry.authorTitle}</p> : null}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
