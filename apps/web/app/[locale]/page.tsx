import type { Metadata } from "next";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { notFound } from "next/navigation";

import { HomeQueryEntry } from "@/components/search/home-query-entry";
import { Container } from "@/components/ui/container";
import { getHomepageRebuildContent } from "@/lib/homepage-rebuild-content";
import { getHomepageSeo, getSiteSettings } from "@/lib/sanity-seo";
import { getLocaleConfig, isActiveLocale, LOCALES, type Locale } from "@/lib/locales";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

const HOME_FALLBACK = {
  title: "AsinSeed｜亚马逊关键词研究工具",
  description: "从一个 ASIN 或关键词开始，进入清晰、可解释的亚马逊关键词研究工具。",
  heroHeading: "从一个商品或需求，开始可解释的关键词研究",
  heroSubheading: "先识别研究对象，再进入匹配的字段与下一步判断。AsinSeed 将查询任务放在首页，而不是把它藏在营销文案之后。",
};

function resolveLocale(locale: string): Locale {
  if (!isActiveLocale(locale)) notFound();
  return locale;
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://asinseed.com";
}

function dedupeTitle(title: string, brandName: string): string {
  const count = title.split(brandName).length - 1;
  return count <= 1 ? title : title.replace(new RegExp("[–\\-]?\\s*" + brandName + "\\s*$", "i"), "").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const siteUrl = getSiteUrl();
  const [homepageSeo, siteSettings] = await Promise.all([getHomepageSeo(locale), getSiteSettings()]);
  const brandName = siteSettings?.brandName ?? "AsinSeed";
  const title = dedupeTitle(homepageSeo?.seo?.title ?? HOME_FALLBACK.title, brandName);
  const description = homepageSeo?.seo?.description ?? HOME_FALLBACK.description;
  const canonical = homepageSeo?.seo?.canonicalOverride ?? siteUrl + "/" + locale;
  const ogImageUrl = homepageSeo?.seo?.ogImageUrl ?? siteUrl + "/" + locale + "/opengraph-image";

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(LOCALES.length > 1
        ? { languages: Object.fromEntries(LOCALES.map((activeLocale) => [getLocaleConfig(activeLocale).hreflang, siteUrl + "/" + activeLocale])) }
        : {}),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: getLocaleConfig(locale).ogLocale,
      url: canonical,
      siteName: brandName,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: brandName + "｜亚马逊关键词研究" }],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const [content, homepageSeo, siteSettings] = await Promise.all([
    getHomepageRebuildContent(locale),
    getHomepageSeo(locale),
    getSiteSettings(),
  ]);

  const heroHeading = homepageSeo?.heroHeading?.trim() || HOME_FALLBACK.heroHeading;
  const heroSubheading = homepageSeo?.heroSubheading?.trim() || HOME_FALLBACK.heroSubheading;
  const siteUrl = getSiteUrl();
  const brandName = siteSettings?.brandName ?? "AsinSeed";
  const metadataDescription = homepageSeo?.seo?.description ?? HOME_FALLBACK.description;
  const localeConfig = getLocaleConfig(locale);
  const organizationId = siteUrl + "/#organization";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: brandName,
    url: siteUrl,
    description: metadataDescription,
    ...(siteSettings?.sameAs?.length ? { sameAs: siteSettings.sameAs } : {}),
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": siteUrl + "/#website",
    name: brandName,
    url: siteUrl,
    inLanguage: localeConfig.htmlLang,
    publisher: { "@id": organizationId },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <main className="overflow-hidden bg-[#f5f0e8]">
        <section className="border-b border-brand-ink/15">
          <Container className="py-10 sm:py-14 lg:py-16">
            <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(29rem,1.02fr)] xl:gap-12">
              <header className="max-w-xl border-l-4 border-primary pl-5 sm:pl-7 xl:pt-8">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-brand-strong">{content.eyebrow.toUpperCase()}</p>
                  <span aria-hidden="true" className="h-px flex-1 bg-brand-ink/18" />
                  <span className="font-mono text-[10px] text-brand-ink/48">01 / START</span>
                </div>
                <h1 className="mt-7 max-w-xl text-[clamp(2.4rem,4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-brand-ink [text-wrap:balance]">{heroHeading}</h1>
                <p className="mt-7 max-w-lg text-base leading-8 text-brand-ink/68 sm:text-lg">{heroSubheading}</p>
                <dl className="mt-9 grid max-w-md grid-cols-3 border-y border-brand-ink/16 text-sm">
                  <div className="py-4 pr-3">
                    <dt className="font-mono text-[10px] font-semibold tracking-[0.12em] text-brand-ink/45">INPUT</dt>
                    <dd className="mt-2 font-semibold text-brand-ink">ASIN / 关键词</dd>
                  </div>
                  <div className="border-l border-brand-ink/16 px-3 py-4">
                    <dt className="font-mono text-[10px] font-semibold tracking-[0.12em] text-brand-ink/45">RECOGNITION</dt>
                    <dd className="mt-2 font-semibold text-brand-ink">匹配研究视图</dd>
                  </div>
                  <div className="border-l border-brand-ink/16 pl-3 py-4">
                    <dt className="font-mono text-[10px] font-semibold tracking-[0.12em] text-brand-ink/45">NEXT</dt>
                    <dd className="mt-2 font-semibold text-brand-ink">进入工作台</dd>
                  </div>
                </dl>
              </header>

              <HomeQueryEntry locale={locale} submitLabel={content.toolSubmitLabel} hint={content.toolHint} />
            </div>
          </Container>
        </section>

        <section id="method" aria-labelledby="homepage-method-title" className="bg-brand-ink text-white">
          <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(16rem,0.66fr)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:pt-2">
              <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-primary">RESEARCH PROTOCOL</p>
              <h2 id="homepage-method-title" className="mt-4 max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl">{content.methodTitle}</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/64 sm:text-base">{content.methodDescription}</p>
              <a href={"/" + locale + "/US"} className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-2 text-sm font-semibold text-primary transition hover:text-white">
                打开完整研究工作台
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>

            <ol className="border-t border-white/18">
              {content.methodPoints.map((point, index) => (
                <li key={point.title} className="grid gap-4 border-b border-white/18 py-6 sm:grid-cols-[4.25rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
                  <span className="font-mono text-xs font-semibold text-primary">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.025em] text-white">{point.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">{point.body}</p>
                  </div>
                  <CornerDownRight aria-hidden="true" className="hidden h-5 w-5 text-primary sm:block" />
                </li>
              ))}
            </ol>
          </Container>
        </section>
      </main>
    </>
  );
}
