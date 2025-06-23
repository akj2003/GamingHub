import { test, expect, Page } from '@playwright/test';

// Helper function to send a message and wait for bot response
async function askChatbot(page: Page, message: string): Promise<string | null> {
  await page.getByTestId('chatbot-input').fill(message);
  await page.getByTestId('chatbot-send-button').click();

  // Wait for the bot's response to appear
  // We expect two messages after sending: user's and then bot's.
  // This selector targets the last bot message.
  const botResponseLocator = page.locator('[data-testid="message-bot"]').last();
  await expect(botResponseLocator).toBeVisible({ timeout: 2000 }); // Wait for bot response
  return botResponseLocator.locator('p').textContent();
}

test.describe('Chatbot Functionality', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    // Ensure chatbot is closed before each test that might open it
    const chatWindow = page.getByTestId('chatbot-window');
    if (await chatWindow.isVisible()) {
      await page.getByTestId('chatbot-close-button').click();
      await expect(chatWindow).not.toBeVisible();
    }
  });

  test('should open and close the chatbot window, and show initial message', async () => {
    const toggleButton = page.getByTestId('chatbot-toggle-button');
    const chatWindow = page.getByTestId('chatbot-window');

    // Open chat
    await expect(chatWindow).not.toBeVisible();
    await toggleButton.click();
    await expect(chatWindow).toBeVisible();
    await expect(page.getByTestId('chatbot-header')).toBeVisible();

    // Check for initial bot message
    const initialMessage = page.locator('[data-testid="message-bot"] p').first();
    await expect(initialMessage).toContainText("Hi! I'm the GameBot. Ask me how to play a game!");

    // Check message count is 1 (only initial bot message)
    await expect(page.locator('[data-testid^="message-"]')).toHaveCount(1);

    // Close chat
    await page.getByTestId('chatbot-close-button').click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('should send a message and receive a general greeting response', async () => {
    await page.getByTestId('chatbot-toggle-button').click();
    await expect(page.getByTestId('chatbot-window')).toBeVisible();

    const userInput = 'Hello';
    await page.getByTestId('chatbot-input').fill(userInput);
    await page.getByTestId('chatbot-send-button').click();

    // Check user message appears
    const userMessage = page.locator('[data-testid="message-user"] p').last();
    await expect(userMessage).toHaveText(userInput);

    // Check bot response appears and is correct
    const botResponse = page.locator('[data-testid="message-bot"] p').last();
    await expect(botResponse).toContainText('Hello there! How can I help you with the games?');

    // Total messages: initial bot, user, bot response
    await expect(page.locator('[data-testid^="message-"]')).toHaveCount(3);
  });

  test('should receive a general help response', async () => {
    await page.getByTestId('chatbot-toggle-button').click();
    const botResponseText = await askChatbot(page, 'help me');
    expect(botResponseText).toContain('You can ask me about rules, how to play, or winning conditions');
  });

  test('should receive a fallback response for unrecognized input', async () => {
    await page.getByTestId('chatbot-toggle-button').click();
    const botResponseText = await askChatbot(page, 'gibberish query');
    expect(botResponseText).toContain("I'm sorry, I'm not sure how to help with that.");
  });

  test.describe('Game-Specific Contextual Responses', () => {
    test('Tic Tac Toe: should respond to "how to play"', async () => {
      // Navigate to Tic Tac Toe to set context (if App.tsx passes it)
      await page.getByRole('button', { name: 'Tic-Tac-Toe' }).click(); // Ensure game context is set in App.tsx for the chatbot

      await page.getByTestId('chatbot-toggle-button').click(); // Open chat
      const botResponseText = await askChatbot(page, 'how to play tic tac toe');
      expect(botResponseText).toContain("Players take turns marking a square in a 3x3 grid.");
      await page.getByTestId('chatbot-close-button').click(); // Close chat for next test
    });

    test('Ludo: should respond to "rules for ludo"', async () => {
      await page.getByRole('button', { name: /Ludo \(Mini\)/i }).click();

      await page.getByTestId('chatbot-toggle-button').click();
      const botResponseText = await askChatbot(page, 'rules for ludo');
      expect(botResponseText).toContain("Players take turns rolling a single die.");
      await page.getByTestId('chatbot-close-button').click();
    });

    test('Sudoku: should respond to "win sudoku"', async () => {
      await page.getByRole('button', { name: /Sudoku \(4x4\)/i }).click();

      await page.getByTestId('chatbot-toggle-button').click();
      const botResponseText = await askChatbot(page, 'win sudoku');
      expect(botResponseText).toContain("You win Sudoku by correctly filling all empty cells");
      await page.getByTestId('chatbot-close-button').click();
    });

    // Add more tests for other games as content is available and verified
    // For example:
    // test('Memory Game: should respond to "how does memory work"', async () => {
    //   await page.getByRole('button', { name: /Memory Game/i }).click();
    //   await page.getByTestId('chatbot-toggle-button').click();
    //   const botResponseText = await askChatbot(page, 'how does memory work');
    //   expect(botResponseText).toContain("Memory Game involves finding matching pairs");
    //   await page.getByTestId('chatbot-close-button').click();
    // });
  });
});
