const SANITY_READ_BUDGET_MS = 1_500;

/**
 * Sanity is the preferred source for published operator content, but the
 * public website must still render its verified local fallback if a local
 * network, preview environment, or API edge is slow. This bounds only the
 * read wait; it does not change the document model or publish behavior.
 */
export async function readSanityWithinBudget<T>(request: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      request,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Sanity read exceeded the page render budget.")), SANITY_READ_BUDGET_MS);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
