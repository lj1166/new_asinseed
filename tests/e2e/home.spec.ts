import { expect, test } from "@playwright/test";

test("root redirects to the English homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(/Amazon Reverse Asin Search Tool/i);
});

for (const locale of ["en", "zh-cn"] as const) {
  test(`${locale} homepage exposes one H1, canonical, and reciprocal language link`, async ({ page }) => {
    await page.goto(`/${locale}`);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en$/);
    await expect(page.locator('link[rel="alternate"][hreflang="zh-cn"]')).toHaveAttribute("href", /\/zh-cn$/);
  });
}
