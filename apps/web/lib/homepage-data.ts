import type { HomepageFaqEntry, HomepageTestimonialEntry } from "@new-asinseed/contracts";

import { HOMEPAGE_FAQ_SEED, HOMEPAGE_TESTIMONIALS_SEED } from "./homepage-content";
import type { Locale } from "./locales";
import { getSanityClient } from "./sanity-client";

export async function getHomepageFaq(locale: Locale): Promise<HomepageFaqEntry[]> {
  const client = getSanityClient();
  if (!client) {
    return HOMEPAGE_FAQ_SEED[locale];
  }

  try {
    const entries = await client.fetch<HomepageFaqEntry[]>(
      `*[_type == "homepageFaqEntry" && locale == $locale] | order(order asc){ locale, question, answer, order }`,
      { locale },
    );
    return entries.length > 0 ? entries : HOMEPAGE_FAQ_SEED[locale];
  } catch {
    return HOMEPAGE_FAQ_SEED[locale];
  }
}

export async function getHomepageTestimonials(locale: Locale): Promise<HomepageTestimonialEntry[]> {
  const client = getSanityClient();
  if (!client) {
    return HOMEPAGE_TESTIMONIALS_SEED[locale];
  }

  try {
    const entries = await client.fetch<HomepageTestimonialEntry[]>(
      `*[_type == "homepageTestimonialEntry" && locale == $locale] | order(order asc){
        locale,
        quoteText,
        authorName,
        authorTitle,
        "avatarUrl": avatar.asset->url,
        order
      }`,
      { locale },
    );
    return entries.length > 0 ? entries : HOMEPAGE_TESTIMONIALS_SEED[locale];
  } catch {
    return HOMEPAGE_TESTIMONIALS_SEED[locale];
  }
}
