import { test, expect } from "@playwright/test";

test("Inventory Management Workflow", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Open Inventory Management
  await page.getByRole("button", { name: "Inventory Management" }).click();

  // Verify page
  await expect(
    page.getByRole("heading", { name: "Inventory Management" })
  ).toBeVisible();

  // Fill form
    await page.getByLabel("Product Name").fill("RayBan Classic");

    await page.getByLabel("Product Type").selectOption("Frame");

    await page.getByLabel("Price ($)").fill("2500");

    await page.getByLabel("Stock Quantity").fill("35");

  // Submit
  await page.getByRole("button", { name: "Add Product" }).click();

  // Verify added product row
    const row = page.getByRole("row").filter({
    has: page.getByText("RayBan Classic"),
    });

    await expect(row).toBeVisible();
    await expect(row).toContainText("Frame");
    await expect(row).toContainText("$2500.00");
    await expect(row).toContainText("35");
    await expect(row).toContainText("Available");

});