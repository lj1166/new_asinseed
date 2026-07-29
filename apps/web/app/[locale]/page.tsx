import type { Metadata } from "next";
import { ArrowRight, Compass, FileSearch, SearchCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { ResearchExperience, ResearchJourney } from "@/components/home/research-experience";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { getHomepageFaq } from "@/lib/homepage-data";
import { getHomepageRebuildContent } from "@/lib/homepage-rebuild-content";
import { getHomepageSeo, getSiteSettings } from "@/lib/sanity-seo";
import { getLocaleConfig, isActiveLocale, LOCALES, type Locale } from "@/lib/locales";

/** Refresh published Sanity content without requiring a frontend deployment. */
export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

const HOME_FALLBACK = {
  title: "AsinSeed｜亚马逊关键词研究起点",
  description: "从竞品线索出发，建立更清晰的亚马逊关键词研究路径。",
  heroHeading: "从竞品线索出发，建立更清晰的关键词研究路径",
  heroSubheading: "围绕具体的商品、用户意图与业务问题，组织下一步的关键词研究。",
};

function resolveLocale(locale: string): Locale {
  if (!isActiveLocale(locale)) notFound();
  return locale;
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://asinseed.com";
}

/** Ensure the brand appears at most once in an HTML title. */
function dedupeTitle(title: string, brandName: string): string {
  const count = title.split(brandName).length - 1;
  return count <= 1 ? title : title.replace(new RegExp(`[–\\-]?\\s*${brandName}\\s*$`, "i"), "").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const siteUrl = getSiteUrl();
  const [homepageSeo, siteSettings] = await Promise.all([getHomepageSeo(locale), getSiteSettings()]);
  const brandName = siteSettings?.brandName ?? "AsinSeed";
  const title = dedupeTitle(homepageSeo?.seo?.title ?? HOME_FALLBACK.title, brandName);
  const description = homepageSeo?.seo?.description ?? HOME_FALLBACK.description;
  const canonical = homepageSeo?.seo?.canonicalOverride ?? `${siteUrl}/${locale}`;
  const ogImageUrl = homepageSeo?.seo?.ogImageUrl ?? `${siteUrl}/${locale}/opengraph-image`;
  const localeConfig = getLocaleConfig(locale);

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(LOCALES.length > 1
        ? {
            languages: Object.fromEntries(
              LOCALES.map((activeLocale) => [
                getLocaleConfig(activeLocale).hreflang,
                `${siteUrl}/${activeLocale}`,
              ]),
            ),
          }
        : {}),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: localeConfig.ogLocale,
      url: canonical,
      siteName: brandName,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${brandName}｜亚马逊关键词研究` }],
    },
  };
}

const scenarioIcons = [Compass, FileSearch, SearchCheck];

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const [content, faq, homepageSeo, siteSettings] = await Promise.all([
    getHomepageRebuildContent(locale),
    getHomepageFaq(locale),
    getHomepageSeo(locale),
    getSiteSettings(),
  ]);

  const heroHeading = homepageSeo?.heroHeading?.trim() || HOME_FALLBACK.heroHeading;
  const heroSubheading = homepageSeo?.heroSubheading?.trim() || HOME_FALLBACK.heroSubheading;
  const siteUrl = getSiteUrl();
  const brandName = siteSettings?.brandName ?? "AsinSeed";
  const metadataDescription = homepageSeo?.seo?.description ?? HOME_FALLBACK.description;
  const localeConfig = getLocaleConfig(locale);
  const organizationId = `${siteUrl}/#organization`;
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
    "@id": `${siteUrl}/#website`,
    name: brandName,
    url: siteUrl,
    inLanguage: localeConfig.htmlLang,
    publisher: { "@id": organizationId },
  };
  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
      <main className="overflow-hidden bg-[#fffaf4]">
        <section className="relative isolate overflow-hidden border-b border-brand-ink/10 bg-[#fffaf4] pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div aria-hidden="true" className="absolute -left-40 -top-52 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-3xl" />
          <div aria-hidden="true" className="absolute right-[-14rem] top-12 -z-10 h-[30rem] w-[30rem] rounded-full border-[58px] border-primary/10" />
          <Container className="grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
            <div className="relative max-w-2xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-brand-strong">{content.eyebrow}</p>
                <span className="font-mono text-xs tracking-[.16em] text-brand-ink/45">RESEARCH / 01</span>
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-brand-ink sm:text-5xl lg:text-6xl">{heroHeading}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-ink/68">{heroSubheading}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_26px_-14px_rgba(45,29,12,.55)] transition hover:-translate-y-0.5 hover:bg-brand-ink/90">
                  {content.primaryCtaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a href="#scenarios" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-ink/15 bg-white/60 px-5 py-3 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:border-primary/45 hover:bg-white">
                  {content.secondaryCtaLabel}
                </a>
              </div>
              <p className="mt-8 max-w-lg border-l-2 border-primary pl-4 text-sm leading-6 text-brand-ink/56">从一个明确的商品或竞品问题开始，建立更能解释“为什么”的研究路径。</p>
            </div>

            <ResearchExperience
              eyebrow={content.researchPanelEyebrow}
              title={content.researchPanelTitle}
              description={content.researchPanelDescription}
              signals={content.researchSignals}
              notice={content.researchPanelNotice}
            />
          </Container>
        </section>

        <Section id="scenarios" className="relative py-20 sm:py-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader eyebrow={content.scenariosEyebrow} title={content.scenariosTitle} description={content.scenariosDescription} className="mb-0 max-w-2xl" />
            <p className="max-w-xs border-l border-brand-ink/15 pl-4 text-sm leading-6 text-muted-foreground">不从关键词列表开始，而是从当前要解决的业务判断开始。</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            {content.scenarios.map((scenario, index) => {
              const Icon = scenarioIcons[index] ?? Compass;
              const featured = index === 0;
              return (
                <article
                  key={scenario.title}
                  className={
                    featured
                      ? "group relative min-h-[21rem] overflow-hidden rounded-[1.75rem] bg-brand-ink p-7 text-white lg:col-span-7 lg:p-9"
                      : index === 1
                        ? "group relative min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-brand-ink/10 bg-[#f3e9dc] p-7 text-brand-ink lg:col-span-5"
                        : "group relative min-h-[16rem] overflow-hidden rounded-[1.75rem] bg-primary p-7 text-brand-ink lg:col-span-12 lg:min-h-[15rem]"
                  }
                >
                  <div aria-hidden="true" className={featured ? "absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[42px] border-primary/25 transition duration-700 group-hover:scale-110" : "absolute -right-10 -top-10 h-44 w-44 rounded-full border-[28px] border-brand-ink/10 transition duration-700 group-hover:rotate-12"} />
                  <div className="relative flex h-full flex-col items-start">
                    <div className="flex w-full items-center justify-between">
                      <span className={featured ? "flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground" : "flex h-11 w-11 items-center justify-center rounded-xl bg-white/55 text-brand-strong"}><Icon aria-hidden="true" className="h-5 w-5" /></span>
                      <span className={featured ? "font-mono text-xs tracking-[.16em] text-primary" : "font-mono text-xs tracking-[.16em] text-brand-ink/45"}>0{index + 1} / 03</span>
                    </div>
                    <h2 className={featured ? "mt-auto max-w-md text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl" : "mt-12 max-w-sm text-2xl font-semibold tracking-[-.03em]"}>{scenario.title}</h2>
                    <p className={featured ? "mt-4 max-w-md text-sm leading-7 text-white/65" : "mt-4 max-w-sm text-sm leading-7 text-brand-ink/68"}>{scenario.body}</p>
                    <span className={featured ? "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" : "mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-strong"}>查看研究视角 <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="how-it-works" container={false} className="relative overflow-hidden bg-brand-ink py-20 text-white sm:py-28">
          <div aria-hidden="true" className="absolute -left-24 top-12 h-72 w-72 rounded-full border-[42px] border-primary/15" />
          <Container className="relative grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div>
              <SectionHeader eyebrow={content.workflowEyebrow} title={content.workflowTitle} description={content.workflowDescription} className="mb-0 [&_h2]:text-white [&_p]:text-white/65 [&_p]:leading-7 [&_p]:sm:text-lg" />
              <aside aria-labelledby="asin-research-definition" className="mt-10 border-t border-white/12 pt-6">
                <h2 id="asin-research-definition" className="text-sm font-semibold text-primary">什么是 ASIN 反查？</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/65">它是一种从具体商品线索出发，辅助研究相关搜索意图与关键词方向的方法；它不替代对市场、产品和用户需求的判断。</p>
              </aside>
            </div>
            <ResearchJourney steps={content.workflowSteps} />
          </Container>
        </Section>

        {faq.length > 0 ? (
          <Section id="faq" className="py-20 sm:py-28">
            <SectionHeader eyebrow="常见问题" title="在开始研究前，先回答几个基础问题" description="把常见概念讲清楚，避免在不完整信息下过早得出结论。" />
            <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
              {faq.map((entry, index) => (
                <details key={`${entry.order ?? 0}-${entry.question}`} className={index === 0 ? "group rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-[0_15px_32px_-28px_rgba(45,29,12,.55)] md:col-span-2" : "group rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-[0_15px_32px_-28px_rgba(45,29,12,.55)]"}>
                  <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-brand-ink marker:hidden">{entry.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.answer}</p>
                </details>
              ))}
            </div>
          </Section>
        ) : null}

        <section className="bg-[#fffaf4] pb-20 sm:pb-28">
          <Container>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/30 bg-primary px-7 py-10 text-primary-foreground sm:px-10 sm:py-12">
              <div aria-hidden="true" className="absolute -right-14 -top-14 h-60 w-60 rounded-full border-[34px] border-white/25" />
              <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold text-brand-ink/65">{content.closingEyebrow}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{content.closingTitle}</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-brand-ink/72">{content.closingDescription}</p>
                </div>
                <a href="#how-it-works" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-ink/90">
                  {content.closingCtaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
