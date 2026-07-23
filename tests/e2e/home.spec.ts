import { expect, test } from "@playwright/test";

test("home page redirects to /en and renders the Stage 0 placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByText("ASINSeed — Stage 0 scaffold")).toBeVisible();
});
