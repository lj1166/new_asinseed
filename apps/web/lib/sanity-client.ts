import { createClient, type SanityClient } from "@sanity/client";

/**
 * Optional Sanity client. Stage 1 pilot ships with hardcoded/placeholder
 * content (see lib/homepage-content.ts) so the page renders correctly even
 * when no Sanity project is configured yet. Once `SANITY_PROJECT_ID` /
 * `SANITY_DATASET` are set, callers can use this client to fetch the
 * `homepageFaqEntry` / `homepageTestimonialEntry` documents instead.
 */
export function getSanityClient(): SanityClient | null {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  });
}
