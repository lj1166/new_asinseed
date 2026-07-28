import { createClient, type SanityClient } from "@sanity/client";

/**
 * Optional Sanity client. The rebuilt homepage has safe local fallbacks so it
 * remains renderable before an operator creates content documents. Once
 * `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` are set,
 * callers can fetch published homepage, FAQ, SEO, and site-setting documents.
 */
export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    // Homepage SEO and operator content must reflect a Studio publish on the
    // predictable ISR window below. Direct API reads avoid the extra,
    // uncontrolled CDN propagation delay while still requesting public,
    // published documents only.
    useCdn: false,
  });
}
