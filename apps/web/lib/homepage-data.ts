import type { HomepageFaqEntry, HomepageTestimonialEntry } from "@new-asinseed/contracts";

import { getLocaleConfig, type Locale } from "./locales";
import { getSanityClient } from "./sanity-client";

export async function getHomepageFaq(locale: Locale): Promise<HomepageFaqEntry[]> {
  const client = getSanityClient();
  if (!client) {
    return [];
  }

  try {
    const entries = await client.fetch<HomepageFaqEntry[]>(
      `*[_type == "homepageFaqEntry" && locale == $locale] | order(order asc){ locale, question, answer, order }`,
      { locale: getLocaleConfig(locale).sanityLocale },
    );
    return entries;
  } catch {
    return [];
  }
}

export async function getHomepageTestimonials(locale: Locale): Promise<HomepageTestimonialEntry[]> {
  const client = getSanityClient();
  if (!client) {
    return [];
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
      { locale: getLocaleConfig(locale).sanityLocale },
    );
    return entries;
  } catch {
    return [];
  }
}
