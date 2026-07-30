import type { Metadata } from "next";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SearchMarketSchema, SEARCH_MARKETS, type SearchMarket } from "@new-asinseed/contracts";

import { SearchToolClient } from "@/components/search/search-tool-client";
import { Container } from "@/components/ui/container";
import { getLocaleConfig, isActiveLocale, LOCALES, type Locale } from "@/lib/locales";
import { getSearchToolContent } from "@/lib/search-tool-content";
import { getSearchToolSeo, getSiteSettings } from "@/lib/sanity-seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; market: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const TOOL_FALLBACK = {
  title: "ASIN 反查与关键词研究工具｜AsinSeed",
  description: "输入 ASIN 或关键词，按市场启动一轮可解释的关键词研究。稳定工具入口提供任务说明；具体查询状态不进入搜索收录。",
};

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://asinseed.com").replace(/\/$/, "");
}

function resolveLocale(value: string): Locale {
  if (!isActiveLocale(value)) notFound();
  return value;
}

function resolveMarket(value: string): SearchMarket {
  const parsed = SearchMarketSchema.safeParse(value.toUpperCase());
  if (!parsed.success) notFound();
  return parsed.data;
}

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.slice(0, 120).trim() : "";
}

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) => SEARCH_MARKETS.map((market) => ({ locale, market })));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ locale: rawLocale, market: rawMarket }, rawSearchParams] = await Promise.all([params, searchParams]);
  const locale = resolveLocale(rawLocale);
  const market = resolveMarket(rawMarket);
  const query = getSingleParam(rawSearchParams.q);
  const stableEntry = market === "US" && !query;
  const [seoDocument, siteSettings] = await Promise.all([getSearchToolSeo(locale), getSiteSettings()]);
  const siteUrl = getSiteUrl();
  const canonicalEntry = siteUrl + "/" + locale + "/US";
  const title = seoDocument?.seo?.title ?? TOOL_FALLBACK.title;
  const description = seoDocument?.seo?.description ?? TOOL_FALLBACK.description;
  const canonical = stableEntry ? (seoDocument?.seo?.canonicalOverride ?? canonicalEntry) : canonicalEntry;

  return {
    title,
    description,
    alternates: { canonical },
    robots: stableEntry ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      locale: getLocaleConfig(locale).ogLocale,
      url: canonical,
      siteName: siteSettings?.brandName ?? "AsinSeed",
      images: [{ url: seoDocument?.seo?.ogImageUrl ?? siteUrl + "/" + locale + "/opengraph-image", width: 1200, height: 630, alt: "AsinSeed 搜索工具" }],
    },
  };
}

export default async function SearchToolPage({ params, searchParams }: PageProps) {
  const [{ locale: rawLocale, market: rawMarket }, rawSearchParams] = await Promise.all([params, searchParams]);
  const locale = resolveLocale(rawLocale);
  const market = resolveMarket(rawMarket);
  const query = getSingleParam(rawSearchParams.q);
  const content = await getSearchToolContent(locale);
  const supplement = rawSearchParams.supplement === "true";
  const exactMatch = rawSearchParams.exactMatch === "true";

  return (
    <main className="min-h-screen bg-[#f5f0e8] pb-16 sm:pb-20">
      <section className="border-b border-brand-ink/16">
        <Container className="py-6 sm:py-8">
          <div className="grid gap-7 border-l-4 border-primary pl-5 sm:pl-7 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-12">
            <header className="max-w-3xl">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-strong">{content.eyebrow.toUpperCase()}</p>
                <span aria-hidden="true" className="h-px flex-1 bg-brand-ink/18" />
                <span className="font-mono text-[10px] text-brand-ink/48">WORKBENCH / 01</span>
              </div>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.045em] text-brand-ink sm:text-4xl [text-wrap:balance]">{content.introTitle}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-ink/65 sm:text-base">{content.introDescription}</p>
            </header>
            <aside className="border-t border-brand-ink/16 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-ink/44">INDEXING BOUNDARY</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-brand-ink">稳定入口可被发现；带查询条件的结果页保持 noindex。</p>
            </aside>
          </div>
        </Container>
      </section>

      <Container className="pt-6 sm:pt-8">
        <SearchToolClient key={market + "-" + query + "-" + supplement + "-" + exactMatch} locale={locale} market={market} initialQuery={query} initialSupplement={supplement} initialExactMatch={exactMatch} />

        <section id="method" aria-labelledby="tool-method-title" className="mt-14 border-t border-brand-ink/16 pt-10 sm:mt-16 sm:pt-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(14rem,0.52fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-strong">HOW TO READ THIS TOOL</p>
              <h2 id="tool-method-title" className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-brand-ink sm:text-3xl">{content.methodTitle}</h2>
            </div>
            <ol className="border-t border-brand-ink/16">
              {content.methodPoints.map((point, index) => (
                <li key={point.title} className="grid gap-3 border-b border-brand-ink/16 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-5">
                  <span className="font-mono text-xs font-semibold text-brand-strong">0{index + 1}</span>
                  <div>
                    <h3 className="text-base font-semibold text-brand-ink">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-brand-ink/62">{point.body}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="hidden h-4 w-4 text-primary sm:block" />
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-7 flex items-start gap-2 border-l-2 border-primary pl-3 text-sm leading-6 text-brand-ink/62"><CornerDownRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" />真实数据、账号权益、导出与历史记录未接入。请把当前工具视为可验证的研究交互底座，而不是已上线的数据承诺。</p>
        </section>
      </Container>
    </main>
  );
}
