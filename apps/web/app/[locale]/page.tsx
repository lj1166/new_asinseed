import type { Metadata } from "next";
import { ArrowRight, Compass, Crosshair, FileSearch, Layers3, Lightbulb, ListChecks, SearchCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

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
const workflowIcons = [FileSearch, ListChecks, Sparkles];
const researchSignalIcons = [Crosshair, Layers3, Lightbulb];

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
      <main>
        <section className="relative isolate overflow-hidden bg-brand-ink py-16 text-white sm:py-24 lg:py-28">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-80 [background:radial-gradient(circle_at_12%_0%,rgba(255,146,0,.42),transparent_32%),radial-gradient(circle_at_92%_28%,rgba(255,212,144,.16),transparent_28%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
          <Container className="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-primary">
                  {content.eyebrow}
                </p>
                <span className="text-xs font-medium tracking-wide text-white/55">RESEARCH-FIRST</span>
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">{heroHeading}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">{heroSubheading}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90">
                  {content.primaryCtaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a href="#scenarios" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/[.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10">
                  {content.secondaryCtaLabel}
                </a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-4 text-sm">
                {[
                  ["01", "从对象开始"],
                  ["02", "连接信号"],
                  ["03", "形成假设"],
                ].map(([index, label]) => (
                  <div key={index} className="px-3 first:pl-0">
                    <span className="block font-mono text-xs text-primary">{index}</span>
                    <span className="mt-1 block text-xs text-white/70 sm:text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <section data-testid="research-workbench" aria-label="关键词研究工作台示意" className="relative">
              <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/20 blur-3xl" />
              <div className="rounded-[1.5rem] border border-white/15 bg-[#24180f]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">{content.researchPanelEyebrow}</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{content.researchPanelTitle}</h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">方法预览</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/62">{content.researchPanelDescription}</p>
                <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-white/50">
                    <span>研究入口</span>
                    <span className="font-mono text-primary/80">ASIN / TERM / COMPETITOR</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="研究对象类型">
                    {["ASIN", "商品词", "竞品场景"].map((item, index) => (
                      <span key={item} className={`rounded-md border px-3 py-2 text-xs font-medium ${index === 0 ? "border-primary/35 bg-primary/10 text-primary" : "border-white/10 bg-white/[.04] text-white/65"}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <ol className="mt-4 space-y-2.5">
                  {content.researchSignals.map((signal, index) => {
                    const Icon = researchSignalIcons[index] ?? Crosshair;
                    return (
                      <li key={signal.title} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3.5 transition hover:border-primary/30 hover:bg-white/[.06]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">{signal.title}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-white/55">{signal.body}</span>
                        </span>
                        <span className="ml-auto font-mono text-xs text-white/25">0{index + 1}</span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 rounded-lg border border-primary/15 bg-primary/[.06] px-3 py-2 text-xs leading-5 text-white/58">{content.researchPanelNotice}</p>
              </div>
            </section>
          </Container>
        </section>

        <Section id="scenarios">
          <SectionHeader eyebrow={content.scenariosEyebrow} title={content.scenariosTitle} description={content.scenariosDescription} align="center" />
          <div className="grid gap-4 md:grid-cols-3">
            {content.scenarios.map((scenario, index) => {
              const Icon = scenarioIcons[index] ?? Compass;
              return (
                <article key={scenario.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_12px_36px_-28px_rgba(45,29,12,.45)] transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_45px_-26px_rgba(255,146,0,.35)]">
                  <span aria-hidden="true" className="absolute right-5 top-4 font-mono text-4xl font-semibold tracking-[-.08em] text-brand-ink/[.055]">0{index + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-brand-strong"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h2 className="mt-6 text-xl font-semibold tracking-tight">{scenario.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-strong">研究视角 <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="how-it-works" tone="muted">
          <div className="overflow-hidden rounded-[1.75rem] bg-brand-ink px-6 py-8 text-white sm:px-10 sm:py-12">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <SectionHeader eyebrow={content.workflowEyebrow} title={content.workflowTitle} description={content.workflowDescription} className="mb-0 [&_h2]:text-white [&_p]:text-white/65 [&_p]:leading-7 [&_p]:sm:text-lg" />
              <ol className="grid gap-3 sm:grid-cols-3">
                {content.workflowSteps.map((step, index) => {
                  const Icon = workflowIcons[index] ?? Sparkles;
                  return (
                    <li key={step.title} className="rounded-2xl border border-white/10 bg-white/[.06] p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-primary">0{index + 1}</span>
                        <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="mt-8 text-lg font-semibold">{step.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-white/62">{step.body}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
            <aside aria-labelledby="asin-research-definition" className="mt-8 border-t border-white/10 pt-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <h2 id="asin-research-definition" className="text-sm font-semibold text-primary">什么是 ASIN 反查？</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-white/70">它是一种从具体商品线索出发，辅助研究相关搜索意图与关键词方向的方法；它不替代对市场、产品和用户需求的判断。</p>
              </div>
              <a href="#scenarios" className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:text-orange-200 sm:mt-0">查看适用场景 <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
            </aside>
          </div>
        </Section>

        {faq.length > 0 ? (
          <Section id="faq">
            <SectionHeader eyebrow="常见问题" title="在开始研究前，先回答几个基础问题" align="center" />
            <div className="mx-auto max-w-3xl divide-y rounded-2xl border bg-card px-6">
              {faq.map((entry) => (
                <details key={`${entry.order ?? 0}-${entry.question}`} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 text-base font-semibold marker:hidden">{entry.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.answer}</p>
                </details>
              ))}
            </div>
          </Section>
        ) : null}

        <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
          <div aria-hidden="true" className="absolute right-[-6rem] top-[-7rem] h-64 w-64 rounded-full border-[36px] border-white/20" />
          <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-ink/80">{content.closingEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{content.closingTitle}</h2>
              <p className="mt-4 text-base leading-7 text-brand-ink/80">{content.closingDescription}</p>
            </div>
            <a href="#how-it-works" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-soft">
              {content.closingCtaLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Container>
        </section>
      </main>
    </>
  );
}
