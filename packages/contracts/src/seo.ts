import { z } from "zod";

import { HOMEPAGE_LOCALES } from "./homepage";

// ---------------------------------------------------------------------------
// Shared SEO object (mirrors the `seo` Sanity object type)
// ---------------------------------------------------------------------------

export const SeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImageUrl: z.string().url().optional(),
  canonicalOverride: z.string().url().optional(),
});
export type Seo = z.infer<typeof SeoSchema>;

// ---------------------------------------------------------------------------
// Site Settings singleton
// ---------------------------------------------------------------------------

export const SiteSettingsSchema = z.object({
  siteUrl: z.string().url(),
  brandName: z.string(),
  sameAs: z.array(z.string().url()).optional(),
  defaultSeo: SeoSchema.optional(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

// ---------------------------------------------------------------------------
// Homepage SEO document (one per locale)
// ---------------------------------------------------------------------------

export const HomepageSeoSchema = z.object({
  locale: z.enum(HOMEPAGE_LOCALES),
  seo: SeoSchema,
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
});
export type HomepageSeo = z.infer<typeof HomepageSeoSchema>;

// ---------------------------------------------------------------------------
// ContentEntry SEO extension
// ---------------------------------------------------------------------------

export const ContentEntrySeoSchema = z.object({
  seo: SeoSchema.optional(),
  noindex: z.boolean().optional(),
});
export type ContentEntrySeo = z.infer<typeof ContentEntrySeoSchema>;
