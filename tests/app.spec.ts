import { test, expect } from '@playwright/test';

test.describe('Gaming Hub App', () => {
  test('should display the main title and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Gaming Hub/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Shape & Color Game/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tic-Tac-Toe/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ludo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sudoku/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Chess/i })).toBeVisible();
  });

  test('should play a round of Shape & Color Game', async ({ page }) => {
    await page.goto('/');
    // Wait for color options to appear
    const colorButtons = page.locator('.gaming-page-option-button');
    await expect(colorButtons.first()).toBeVisible();
    // Click the first color option
    await colorButtons.first().click();
    // Should show a message or move to shape step
    await expect(page.locator('.gaming-page-message')).toBeVisible();
  });

  test('should switch to Tic-Tac-Toe and play a move', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Tic-Tac-Toe/i }).click();
    const cells = page.locator('.tictactoe-cell');
    await expect(cells.first()).toBeVisible();
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText(/X|O/);
  });

  test('should switch to Ludo and select players', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Ludo/i }).click();
    await page.getByRole('button', { name: /3 Players/i }).click();
    await expect(page.getByText(/Ludo \(Mini - 3 Players\)/i)).toBeVisible();
  });

  test('should switch to Sudoku and display the grid', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sudoku/i }).click();
    await expect(page.locator('.sudoku-grid')).toBeVisible();
  });

  test('should switch to Chess and display the board', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Chess/i }).click();
    await expect(page.locator('.chess-grid')).toBeVisible();
  });
});