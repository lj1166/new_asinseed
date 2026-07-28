import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CapabilityShowcase } from "@/components/homepage/capability-showcase";
import { ContentHubPreview } from "@/components/homepage/content-hub-preview";
import { MethodologySection } from "@/components/homepage/methodology-section";
import { SearchForm } from "@/components/homepage/search-form";
import { HOMEPAGE_COPY, HOMEPAGE_SECTIONS_COPY } from "@/lib/homepage-content";
import { getHomepageFaq, getHomepageTestimonials } from "@/lib/homepage-data";
import { getHomepageSeo, getSiteSettings } from "@/lib/sanity-seo";
import { getLocaleConfig, isActiveLocale, LOCALES, type Locale } from "@/lib/locales";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!isActiveLocale(locale)) notFound();
  return locale;
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://asinseed.com";
}

/** Ensure brand name appears at most once in a title string. */
function dedupeTitle(title: string, brandName: string): string {
  const count = title.split(brandName).length - 1;
  if (count <= 1) return title;
  // Strip trailing " – BrandName" or "-BrandName" duplicates
  return title.replace(new RegExp(`[–\\-]?\\s*${brandName}\\s*$`, "i"), "").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const copy = HOMEPAGE_COPY[locale];
  const siteUrl = getSiteUrl();

  const [homepageSeo, siteSettings] = await Promise.all([
    getHomepageSeo(locale),
    getSiteSettings(),
  ]);

  const brandName = siteSettings?.brandName ?? "AsinSeed";
  const siteName = brandName;

  const rawTitle = homepageSeo?.seo?.title ?? copy.pageTitle;
  const title = dedupeTitle(rawTitle, brandName);
  const description = homepageSeo?.seo?.description ?? copy.hero.subheading;
  const ogImageUrl = homepageSeo?.seo?.ogImageUrl;
  const canonical = homepageSeo?.seo?.canonicalOverride ?? `${siteUrl}/${locale}`;
  const localeConfig = getLocaleConfig(locale);
  const languages =
    LOCALES.length > 1
      ? Object.fromEntries(
          LOCALES.map((activeLocale) => [
            getLocaleConfig(activeLocale).hreflang,
            `${siteUrl}/${activeLocale}`,
          ]),
        )
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: localeConfig.ogLocale,
      url: canonical,
      siteName,
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }] }
        : {}),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const copy = HOMEPAGE_COPY[locale];
  const sections = HOMEPAGE_SECTIONS_COPY[locale];

  const [faq, testimonials, homepageSeo, siteSettings] = await Promise.all([
    getHomepageFaq(locale),
    getHomepageTestimonials(locale),
    getHomepageSeo(locale),
    getSiteSettings(),
  ]);

  const siteUrl = getSiteUrl();
  const brandName = siteSettings?.brandName ?? "AsinSeed";
  // Visible Hero copy has an operator-controlled override, while code copy remains
  // the safe locale fallback when the Studio fields are intentionally left blank.
  const heroHeading = homepageSeo?.heroHeading?.trim() || copy.hero.heading;
  const heroSubheading = homepageSeo?.heroSubheading?.trim() || copy.hero.subheading;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    ...(siteSettings?.sameAs?.length ? { sameAs: siteSettings.sameAs } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main>
        <section id="hero-search" className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">{heroHeading}</h1>
          <p className="text-muted-foreground">{heroSubheading}</p>
          <SearchForm hero={copy.hero} stations={copy.stations} />
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
    </>
  );
}
