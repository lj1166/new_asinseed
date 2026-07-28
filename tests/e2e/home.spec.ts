import { expect, test } from "@playwright/test";

test("root redirects to the Simplified Chinese homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/cn$/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("cn homepage exposes one H1 and a self canonical without inactive hreflang targets", async ({ page }) => {
  await page.goto("/cn");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/cn$/);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
});

for (const inactiveLocale of ["en", "zh-cn", "fr"] as const) {
  test(`${inactiveLocale} remains unavailable until its localized rollout`, async ({ request }) => {
    const response = await request.get(`/${inactiveLocale}`);
    expect(response.status()).toBe(404);
  });
}
