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

test("cn homepage exposes a shareable image and connected brand entities", async ({ page, request }) => {
  await page.goto("/cn");

  const ogImageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImageUrl).toBeTruthy();
  const ogImage = new URL(ogImageUrl!);
  if (ogImage.pathname.endsWith("/cn/opengraph-image")) {
    expect((await request.get(ogImage.pathname)).status()).toBe(200);
  }

  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "{}")),
  );
  const organization = jsonLd.find((entry) => entry["@type"] === "Organization");
  const website = jsonLd.find((entry) => entry["@type"] === "WebSite");
  expect(organization?.["@id"]).toBeTruthy();
  expect(website?.publisher?.["@id"]).toBe(organization?.["@id"]);
  await expect(page.getByRole("heading", { level: 2, name: "什么是 ASIN 反查？" })).toBeVisible();
});

test("cn homepage is the rebuilt research entry rather than the legacy search-and-partner layout", async ({ page }) => {
  await page.goto("/cn");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("从竞品线索出发");
  await expect(page.getByRole("link", { name: "了解反查方法" }).first()).toHaveAttribute("href", "#how-it-works");
  await expect(page.getByTestId("research-workbench")).toContainText("关键词研究工作台");
  await expect(page.getByTestId("research-workbench")).toContainText("不展示或承诺真实查询结果");
  await expect(page.locator("#scenarios")).toContainText("把关键词研究放回真实的业务问题里");
  await expect(page.locator("#how-it-works")).toContainText("什么是 ASIN 反查？");
  await expect(page.getByText("合作伙伴")).toHaveCount(0);
  await expect(page.getByText("获取流量词")).toHaveCount(0);
  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => script.textContent ?? ""),
  );
  expect(jsonLd.some((value) => value.includes('"@type":"FAQPage"'))).toBe(true);
});

test("cn homepage keeps its primary action usable on a 390px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cn");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "了解反查方法" }).first()).toBeVisible();
  expect(await page.locator("html").evaluate((element) => element.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const inactiveLocale of ["en", "zh-cn", "fr"] as const) {
  test(`${inactiveLocale} remains unavailable until its localized rollout`, async ({ request }) => {
    const response = await request.get(`/${inactiveLocale}`);
    expect(response.status()).toBe(404);
  });
}
