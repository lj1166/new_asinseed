import { expect, test } from "@playwright/test";

test("sitemap exposes exactly the currently indexable locale homepages", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  const xml = await response.text();
  expect(xml).toContain("/en</loc>");
  expect(xml).toContain("/zh-cn</loc>");
  expect(xml).not.toContain("/US");
});

test("robots permits crawlers and declares the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");

  const text = await response.text();
  expect(text).toContain("User-Agent: *");
  expect(text).toContain("Allow: /");
  expect(text).toContain("Sitemap: http://localhost:3000/sitemap.xml");
});
