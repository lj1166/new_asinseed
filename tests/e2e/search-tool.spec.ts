import { expect, test } from "@playwright/test";

test("stable US tool entry is indexable and exposes one task-oriented H1", async ({ page, request }) => {
  const response = await request.get("/cn/US");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toMatch(/<link rel="canonical" href="[^"]*\/cn\/US"/);
  expect(html).toContain('<meta name="robots" content="index, follow"');

  await page.goto("/cn/US");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByTestId("search-tool")).toBeVisible();
});

test("ASIN query returns an explicitly labelled Mock result and stays noindex", async ({ page, request }) => {
  const response = await request.get("/cn/US?q=B071J24FNY");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain('<meta name="robots" content="noindex, follow"');

  await page.goto("/cn/US?q=B071J24FNY");
  await expect(page.getByTestId("search-result-area")).toContainText("本地 Mock 验证数据，不代表实时查询");
  await expect(page.getByRole("columnheader", { name: "研究权重（Mock）" })).toBeVisible();
  await expect(page.getByText("验证关键词 01")).toBeVisible();
});

test("keyword query exposes keyword fields and advanced filters", async ({ page }) => {
  await page.goto("/cn/US?q=flashlight&supplement=true&exactMatch=true");

  await expect(page.getByLabel("仅显示当月关键词")).toBeChecked();
  await expect(page.getByLabel("词组匹配")).toBeChecked();
  await expect(page.getByRole("columnheader", { name: "商品数（Mock）" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "购买率（Mock）" })).toBeVisible();
});

test("market selection changes the preserved market path", async ({ page }) => {
  await page.goto("/cn/US");

  await page.locator("select").selectOption("JP");
  await expect(page).toHaveURL(/\/cn\/JP$/);
});

test("unsupported market remains unavailable", async ({ request }) => {
  expect((await request.get("/cn/CN")).status()).toBe(404);
});
