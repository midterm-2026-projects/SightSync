import { test, expect } from "@playwright/test";

test("Prediction Dashboard Workflow", async ({ page }) => {
  await page.goto("/");

  // Open Prediction Dashboard
  await page
    .getByRole("button", { name: "Prediction Dashboard" })
    .click();

  // Verify page heading
  await expect(
    page.getByRole("heading", {
      name: "Prediction Dashboard",
    })
  ).toBeVisible();

  // Verify description
  await expect(
    page.getByText(
      "AI-based prediction of frequently used lenses and frames."
    )
  ).toBeVisible();

  // Verify section headings
  await expect(
    page.getByRole("heading", {
      name: "Frequently Used Lenses",
    })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Frequently Used Frames",
    })
  ).toBeVisible();

  // Wait until prediction data loads
  await page.waitForResponse(
    (response) =>
      response.url().includes("/prediction") &&
      response.status() === 200
  );

  // Verify at least one lens is displayed
  await expect(
    page.locator("ul").first().locator("li").first()
  ).toBeVisible();

  // Verify at least one frame is displayed
  await expect(
    page.locator("ul").nth(1).locator("li").first()
  ).toBeVisible();
});