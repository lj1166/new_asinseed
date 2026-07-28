import type { Metadata } from "next";
import { ArrowRight, Compass, FileSearch, ListChecks, SearchCheck, Sparkles } from "lucide-react";
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
  const ogImageUrl = homepageSeo?.seo?.ogImageUrl;
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
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: brandName }] } : {}),
    },
  };
}

const scenarioIcons = [Compass, FileSearch, SearchCheck];
const workflowIcons = [FileSearch, ListChecks, Sparkles];

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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    ...(siteSettings?.sameAs?.length ? { sameAs: siteSettings.sameAs } : {}),
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
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
      <main>
        <section className="relative isolate overflow-hidden bg-[#082f2d] py-16 text-white sm:py-24">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_16%_0%,rgba(20,184,166,.28),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(251,191,36,.16),transparent_32%)]" />
          <Container className="grid items-center gap-12 lg:grid-cols-[1.06fr_.94fr]">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-teal-100">
                {content.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">{heroHeading}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">{heroSubheading}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
                  {content.primaryCtaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a href="#scenarios" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  {content.secondaryCtaLabel}
                </a>
              </div>
            </div>

            <div aria-label="关键词研究路径示意" className="rounded-2xl border border-white/15 bg-slate-950/35 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm text-slate-300">
                <span>研究路径</span>
                <span className="rounded-full bg-teal-300/15 px-2.5 py-1 text-xs text-teal-100">可解释的下一步</span>
              </div>
              <div className="mt-6 space-y-3">
                {["明确研究对象", "连接竞品与搜索意图", "形成待验证的假设"].map((label, index) => (
                  <div key={label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[.06] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-300/15 text-sm font-semibold text-teal-100">{index + 1}</span>
                    <span className="text-sm font-medium text-slate-100">{label}</span>
                    {index < 2 ? <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 text-teal-200/70" /> : <SearchCheck aria-hidden="true" className="ml-auto h-4 w-4 text-amber-200" />}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">先把问题说清楚，再决定需要研究什么。真实查询任务会在结果工具重构完成后独立承接。</p>
            </div>
          </Container>
        </section>

        <Section id="scenarios">
          <SectionHeader eyebrow={content.scenariosEyebrow} title={content.scenariosTitle} description={content.scenariosDescription} align="center" />
          <div className="grid gap-4 md:grid-cols-3">
            {content.scenarios.map((scenario, index) => {
              const Icon = scenarioIcons[index] ?? Compass;
              return (
                <article key={scenario.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h2 className="mt-6 text-xl font-semibold tracking-tight">{scenario.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.body}</p>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="how-it-works" tone="muted">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <SectionHeader eyebrow={content.workflowEyebrow} title={content.workflowTitle} description={content.workflowDescription} className="mb-0" />
            <ol className="grid gap-4 sm:grid-cols-3">
              {content.workflowSteps.map((step, index) => {
                const Icon = workflowIcons[index] ?? Sparkles;
                return (
                  <li key={step.title} className="rounded-2xl border bg-background p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                      <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="mt-8 text-lg font-semibold">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside className="mt-10 rounded-2xl border border-teal-900/10 bg-teal-950 px-6 py-5 text-teal-50 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <p className="text-sm font-semibold text-teal-100">什么是 ASIN 反查？</p>
              <p className="mt-1 text-sm leading-6 text-teal-50/80">它是一种从具体商品线索出发，辅助研究相关搜索意图与关键词方向的方法；它不替代对市场、产品和用户需求的判断。</p>
            </div>
            <a href="#scenarios" className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100 sm:mt-0">查看适用场景 <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
          </aside>
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

        <section className="bg-primary py-16 text-primary-foreground sm:py-20">
          <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-100">{content.closingEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{content.closingTitle}</h2>
              <p className="mt-4 text-base leading-7 text-teal-50/85">{content.closingDescription}</p>
            </div>
            <a href="#how-it-works" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-teal-50">
              {content.closingCtaLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Container>
        </section>
      </main>
    </>
  );
}
