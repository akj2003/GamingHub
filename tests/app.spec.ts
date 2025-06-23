import { test, expect } from '@playwright/test';

test.describe('Gaming Hub Application', () => {
  test('should load the main page and display the title', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Check if the main title "🎲 Gaming Hub" is visible
    // Assuming the title is an h1 element. Adjust selector if needed.
    const title = page.locator('header h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('🎲 Gaming Hub');

    // Optional: Check for the presence of the navigation buttons container
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();
  });

  test('should display login button when not authenticated', async ({ page }) => {
    // For this test, we assume a logged-out state.
    // Playwright tests run with a fresh browser context by default, so no user should be logged in.
    await page.goto('/');

    // Look for the "Login with Google" button.
    // The selector might need adjustment based on actual button text/attributes.
    const loginButton = page.getByRole('button', { name: /Login with Google/i });
    await expect(loginButton).toBeVisible();
  });

  // Add more basic app-level tests here if needed
});
