import { test, expect } from "@playwright/test";
import { ROOT_SRC } from "../util/constants";

test.describe("User is not logged in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/${ROOT_SRC}`);
  });

  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should open wallet selector modal when click sign-in", async ({
    page,
  }) => {
    const loginButton = page.getByRole("button", { name: "Login" });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    const modal = page.getByRole("heading", { name: "Connect Your Wallet" });
    await expect(modal).toBeVisible();
  });
});

test.describe("User is logged in", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/${ROOT_SRC}`);
  });

  test("should not show login if succesfully authenticated", async ({
    page,
  }) => {
    const loginButton = page.getByRole("button", { name: "Login" });
    await expect(loginButton).not.toBeVisible();
  });
});
