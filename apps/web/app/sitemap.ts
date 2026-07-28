import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/locales";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Only enabled locales in the shared language registry are emitted.
 * Query results, account pages, payment flows, and not-yet-migrated routes are
 * deliberately absent until their own migration decision explicitly permits
 * indexation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
  }));
}
