import { expect, test } from "@playwright/test";

test("the home page lists the insurance products", async ({ page }) => {
  await page.goto("/sites/forsure/home.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Insurance that keeps its promises",
  );
  await expect(page.getByRole("link", { name: "Car insurance" }).first()).toBeVisible();
});
