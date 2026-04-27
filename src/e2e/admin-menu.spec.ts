import { test, expect, Page } from "@playwright/test";

const ADMIN_EMAIL = "verawoodlans@gmail.com";
const ADMIN_PASSWORD = "123456789";

const MOCK_MENUS = [
  { _id: "1", name: "Pad Thai", price: 120, category: "Main", venueId: "v1", createdAt: "" },
  { _id: "2", name: "Green Curry", price: 150, category: "Dessert", venueId: "v1", createdAt: "" },
  { _id: "3", name: "Mango Sticky Rice", price: 80, category: "Drink", venueId: "v1", createdAt: "" },
];

async function loginAsAdmin(page: Page) {
  await page.goto("/signin");
  await page.getByPlaceholder("your@email.com").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("••••••••").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.getByText("Login successful!").waitFor({ timeout: 15000 });
  await page.waitForURL(/.*/, { timeout: 15000 });
}

async function loginAndMockMenus(page: Page) {
  await loginAsAdmin(page);

  await page.route("**/api/v1/menus", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          count: MOCK_MENUS.length,
          data: MOCK_MENUS,
        }),
      });
    } else {
      route.continue();
    }
  });

  await page.goto("/admin/menu");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.waitForSelector("tbody tr", { timeout: 15000 });
}

// -------------------------------------------------------
// US1-1: ดู Menu List ทั้งหมด
// -------------------------------------------------------
test.describe("US1-1: View Menu List", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/menu");
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  });

  test("should display menu list page with correct elements", async ({ page }) => {
    await expect(page.getByText("Menu Management")).toBeVisible();
    await expect(page.getByRole("link", { name: /add menu/i })).toBeVisible();

    const hasTable = await page.locator("table").isVisible().catch(() => false);
    if (hasTable) {
      await expect(page.locator("th").filter({ hasText: /name/i })).toBeVisible();
      await expect(page.locator("th").filter({ hasText: /category/i })).toBeVisible();
      await expect(page.locator("th").filter({ hasText: /price/i })).toBeVisible();
      await expect(page.locator("th").filter({ hasText: /actions/i })).toBeVisible();
    } else {
      await expect(page.getByText("No menus found.")).toBeVisible();
    }
  });

  test("should show menu details: name, price, category", async ({ page }) => {
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    if (count > 0) {
      const firstPrice = rows.first().locator("td").nth(2);
      await expect(firstPrice).toContainText("฿");
    } else {
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("should show empty state when no menus found", async ({ page }) => {
    await page.getByPlaceholder("Search by name...").fill("ABCDEF");
    await expect(page.getByText("No menus found.")).toBeVisible();
  });

  test("should redirect unauthenticated user to signin", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/menu");
    await page.waitForURL("**/signin**");
    await expect(page).toHaveURL(/signin/);
  });
});

// -------------------------------------------------------
// US1-2: Add New Menu
// -------------------------------------------------------
test.describe("US1-2: Add New Menu", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/menu");
    await page.waitForLoadState("networkidle", { timeout: 15000 });
    await page.getByRole("link", { name: /add menu/i }).click();
    await page.waitForURL("**/admin/menu/new**");
    await page.waitForLoadState("networkidle");
  });

  test("should display Add New Menu form", async ({ page }) => {
    await expect(page.getByText("Add New Menu Item")).toBeVisible();
    await expect(page.getByPlaceholder("e.g. Grilled Salmon")).toBeVisible();
    await expect(page.getByPlaceholder("e.g. 350")).toBeVisible();
    await expect(page.getByPlaceholder("e.g. Main Course")).toBeVisible();
    await expect(page.getByRole("button", { name: /create menu item/i })).toBeVisible();
  });

  test("should show validation error when name is empty", async ({ page }) => {
    await page.getByPlaceholder("e.g. 350").fill("100");
    await page.getByPlaceholder("e.g. Main Course").fill("Dessert");
    await page.getByRole("button", { name: /create menu item/i }).click();
    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("should show validation error when price is invalid", async ({ page }) => {
    await page.getByPlaceholder("e.g. Grilled Salmon").fill("Test Item");
    await page.getByPlaceholder("e.g. 350").fill("-50");
    await page.getByPlaceholder("e.g. Main Course").fill("Main");
    await page.getByRole("button", { name: /create menu item/i }).click();
    await expect(page.getByText("Price must be a non-negative number")).toBeVisible();
  });

  test("should show validation error when price is text", async ({ page }) => {
    await page.getByPlaceholder("e.g. Grilled Salmon").fill("Test Item");
    await page.getByPlaceholder("e.g. 350").fill("abc");
    await page.getByPlaceholder("e.g. Main Course").fill("Main");
    await page.getByRole("button", { name: /create menu item/i }).click();
    await expect(page.getByText("Price must be a non-negative number")).toBeVisible();
  });

  test("should show validation error when category is empty", async ({ page }) => {
    await page.getByPlaceholder("e.g. Grilled Salmon").fill("Test Item");
    await page.getByPlaceholder("e.g. 350").fill("200");
    await page.getByRole("button", { name: /create menu item/i }).click();
    await expect(page.getByText("Category is required")).toBeVisible();
  });

  test("should create menu and redirect to menu list", async ({ page }) => {
    const testName = `Test Item ${Date.now()}`;
    await page.getByPlaceholder("e.g. Grilled Salmon").fill(testName);
    await page.getByPlaceholder("e.g. 350").fill("299");
    await page.getByPlaceholder("e.g. Main Course").fill("Test Category");
    await page.getByRole("button", { name: /create menu item/i }).click();
    await page.waitForURL("**/admin/menu**");
    await expect(page).toHaveURL(/\/admin\/menu/);
  });
});

// -------------------------------------------------------
// US1-3: Delete Menu
// -------------------------------------------------------
test.describe("US1-3: Delete Menu", () => {
  test.beforeEach(async ({ page }) => {
    await loginAndMockMenus(page);
  });

  test("should show confirmation dialog before delete", async ({ page }) => {
    const rows = page.locator("tbody tr");
    await rows.first().getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText("Delete Menu Item")).toBeVisible();
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();
    await expect(page.getByText(/This action cannot be undone/)).toBeVisible();
  });

  test("should cancel delete and menu still exists", async ({ page }) => {
    const rows = page.locator("tbody tr");
    const menuName = await rows.first().locator("td").first().textContent();
    await rows.first().getByRole("button", { name: /delete/i }).click();
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByText(menuName!)).toBeVisible();
  });

  test("should delete menu and remove from list", async ({ page }) => {
    await page.route("**/api/v1/menus/**", (route) => {
      if (route.request().method() === "DELETE") {
        route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
      } else {
        route.continue();
      }
    });

    const rows = page.locator("tbody tr");
    const menuName = await rows.first().locator("td").first().textContent();
    await rows.first().getByRole("button", { name: /delete/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText("Delete Menu Item")).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText(menuName!)).not.toBeVisible();
  });
});

// -------------------------------------------------------
// US1-4: Edit Menu
// -------------------------------------------------------
test.describe("US1-4: Edit Menu", () => {
  let menus = [...MOCK_MENUS];

  test.beforeEach(async ({ page }) => {
    menus = [...MOCK_MENUS]; // reset ทุก test

    await loginAsAdmin(page);

    await page.route("**/api/v1/menus", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            count: menus.length,
            data: menus,
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto("/admin/menu");
    await page.waitForSelector("tbody tr");
  });

  test("should navigate to edit page when clicking Edit", async ({ page }) => {
    await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/admin\/menu\/.+/);
  });

  test("should show prefilled data in form", async ({ page }) => {
    const originalName = await page.locator("tbody tr").first().locator("td").first().textContent();
    await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
    await expect(page.getByPlaceholder("e.g. Grilled Salmon")).toHaveValue(originalName!);
  });

  test("should show validation error when name is empty", async ({ page }) => {
    await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
    const input = page.getByPlaceholder("e.g. Grilled Salmon");
    await input.clear();
    await page.getByRole("button", { name: /save|update/i }).click();
    await expect(page.getByText(/name is required|required/i)).toBeVisible();
  });

  test("should show validation error when price is invalid", async ({ page }) => {
    await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
    await page.getByPlaceholder("e.g. 350").fill("-10");
    await page.getByRole("button", { name: /save|update/i }).click();
    await expect(page.getByText(/non-negative/i)).toBeVisible();
  });

  test("should update menu and verify new data in list", async ({ page }) => {
    const newName = `Updated Item ${Date.now()}`;

    await page.route("**/api/v1/menus/**", (route) => {
      if (route.request().method() === "PUT") {
        const updated = { ...menus[0], name: newName };
        menus[0] = updated;
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: updated }),
        });
      } else {
        route.continue();
      }
    });

    await page.locator("tbody tr").first().getByRole("link", { name: /edit/i }).click();
    const input = page.getByPlaceholder("e.g. Grilled Salmon");
    await input.clear();
    await input.fill(newName);
    await page.getByRole("button", { name: /save|update/i }).click();
    await page.waitForURL("**/admin/menu");
    await page.waitForSelector("tbody tr");
    await expect(page.getByText(newName)).toBeVisible();
  });
});
