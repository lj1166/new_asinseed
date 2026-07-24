import type { Metadata } from "next";

import { CapabilityShowcase } from "@/components/homepage/capability-showcase";
import { ContentHubPreview } from "@/components/homepage/content-hub-preview";
import { MethodologySection } from "@/components/homepage/methodology-section";
import { SearchForm } from "@/components/homepage/search-form";
import { HOMEPAGE_COPY, HOMEPAGE_SECTIONS_COPY } from "@/lib/homepage-content";
import { getHomepageFaq, getHomepageTestimonials } from "@/lib/homepage-data";
import { LOCALES, type Locale } from "@/lib/locales";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  return (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : "en";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const copy = HOMEPAGE_COPY[locale];

  return {
    title: copy.pageTitle,
    description: copy.hero.subheading,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "zh-cn": "/zh-cn",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: copy.pageTitle,
      description: copy.hero.subheading,
      type: "website",
      locale: locale === "zh-cn" ? "zh_CN" : "en_US",
      url: `/${locale}`,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const copy = HOMEPAGE_COPY[locale];
  const sections = HOMEPAGE_SECTIONS_COPY[locale];

  const [faq, testimonials] = await Promise.all([getHomepageFaq(locale), getHomepageTestimonials(locale)]);

  return (
    <main>
      <section id="hero-search" className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">{copy.hero.heading}</h1>
        <p className="text-muted-foreground">{copy.hero.subheading}</p>
        <SearchForm locale={locale} hero={copy.hero} stations={copy.stations} />
      </section>

      <CapabilityShowcase
        header={sections.capabilities}
        features={copy.features}
        extension={copy.extension}
        video={copy.video}
      />

      <ContentHubPreview
        header={sections.contentHub}
        faqHeading={copy.faq.heading}
        faqEntries={faq}
        faqContacts={copy.faq.contacts}
      />

      <MethodologySection
        header={sections.methodology}
        testimonials={testimonials}
        partnersHeading={copy.partnersHeading}
        partners={copy.partners}
      />
    </main>
  );
}
