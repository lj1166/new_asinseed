import type { HomepageSeo, SearchToolSeo, SiteSettings } from "@new-asinseed/contracts";

import { getLocaleConfig, type Locale } from "./locales";
import { getSanityClient } from "./sanity-client";
import { readSanityWithinBudget } from "./sanity-request";

// ---------------------------------------------------------------------------
// GROQ projections
// ---------------------------------------------------------------------------

const SEO_PROJECTION = `{
  title,
  description,
  "ogImageUrl": ogImage.asset->url,
  canonicalOverride,
}`;

// ---------------------------------------------------------------------------
// getSiteSettings — singleton, Sanity-first with no hardcoded fallback
// (returns null when Studio not configured or doc not yet created)
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    const doc = await readSanityWithinBudget(client.fetch<SiteSettings | null>(
      `*[_type == "siteSettings"][0]{ siteUrl, brandName, sameAs, defaultSeo ${SEO_PROJECTION} }`,
    ));
    return doc ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// getHomepageSeo — per-locale, Sanity-first with null fallback
// ---------------------------------------------------------------------------

export async function getHomepageSeo(locale: Locale): Promise<HomepageSeo | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    const doc = await readSanityWithinBudget(client.fetch<HomepageSeo | null>(
      `*[_type == "homepageSeo" && locale == $locale][0]{
        locale,
        seo ${SEO_PROJECTION},
        heroHeading,
        heroSubheading,
      }`,
      { locale: getLocaleConfig(locale).sanityLocale },
    ));
    return doc ?? null;
  } catch {
    return null;
  }
}

export async function getSearchToolSeo(locale: Locale): Promise<SearchToolSeo | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    const doc = await readSanityWithinBudget(client.fetch<SearchToolSeo | null>(
      `*[_type == "searchToolSeo" && locale == $locale][0]{ locale, seo ${SEO_PROJECTION} }`,
      { locale: getLocaleConfig(locale).sanityLocale },
    ));
    return doc ?? null;
  } catch {
    return null;
  }
}
