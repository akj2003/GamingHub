```markdown
# Memory Game Unit Tests

This document outlines the unit tests for the `MemoryGame` component located in `src/App.tsx`. These tests are designed to ensure the core functionality of the game operates as expected. We'll assume the use of a testing library like React Testing Library with Jest or Vitest.

## Test Suites and Cases

### 1. Initial State

*   **Test Case 1.1: Grid Rendering**
    *   **Description**: Verifies that the game grid renders with the correct total number of cards. For a 4x4 grid based on 8 unique card values, this means 16 cards.
    *   **Assertions**:
        *   Check that 16 card elements are present in the rendered output.
        *   Each card element should initially display its "hidden" state (e.g., shows '?' or has a specific class for being face-down).

*   **Test Case 1.2: All Cards Initially Hidden**
    *   **Description**: Ensures all cards are face-down (not revealing their actual value) when the game starts.
    *   **Assertions**:
        *   Iterate through all rendered card elements.
        *   Verify that each card does not display its actual value (e.g., 'A', 'B').
        *   Verify that each card has the appropriate ARIA attributes for a hidden card (e.g., `aria-label="Hidden card X"`).

*   **Test Case 1.3: Moves Counter Initialization**
    *   **Description**: Checks that the moves counter is initialized to 0.
    *   **Assertions**:
        *   Find the moves counter display element.
        *   Verify its text content is "Moves: 0" or similar.

*   **Test Case 1.4: Matched Pairs Initialization**
    *   **Description**: Checks that the count of matched pairs is initialized to 0.
    *   **Assertions**:
        *   (Internal state check if not displayed) Verify the `matchedPairs` state is 0.

### 2. Card Flipping Logic

*   **Test Case 2.1: Clicking a Single Hidden Card**
    *   **Description**: Tests that clicking a hidden card flips it and reveals its value.
    *   **Actions**:
        *   Render the `MemoryGame` component.
        *   Simulate a click on one of the hidden card elements.
    *   **Assertions**:
        *   Verify the clicked card now displays its actual value (e.g., 'A').
        *   Verify the card's state/class changes to "flipped".
        *   Verify other cards remain hidden.
        *   Moves counter should remain unchanged (as a full move involves two cards).

*   **Test Case 2.2: Clicking Two Different Hidden Cards**
    *   **Description**: Tests that clicking two different hidden cards flips them both.
    *   **Actions**:
        *   Render the `MemoryGame` component.
        *   Simulate a click on a first hidden card.
        *   Simulate a click on a second, different hidden card.
    *   **Assertions**:
        *   Verify both clicked cards now display their values.
        *   Verify both cards have a "flipped" state/class.

*   **Test Case 2.3: Clicking an Already Flipped Card**
    *   **Description**: Ensures clicking an already flipped card (that isn't part of a completed match evaluation) does not change its state or count as a move.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Click one card to flip it.
        *   Click the same card again.
    *   **Assertions**:
        *   The card remains flipped, showing its value.
        *   No change in moves count or game state.

*   **Test Case 2.4: Clicking a Matched Card**
    *   **Description**: Ensures clicking a card that is already part of a successful match does nothing.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Simulate gameplay to match a pair of cards (e.g., click card 'A' at index 0, then card 'A' at index 5).
        *   Wait for match confirmation.
        *   Simulate a click on one of the matched cards.
    *   **Assertions**:
        *   The card remains matched and visible.
        *   No change in moves count or game state.

### 3. Matching Pair Logic

*   **Test Case 3.1: Two Flipped Cards Form a Match**
    *   **Description**: Verifies that if two flipped cards have the same value, they are marked as matched and remain visible.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Identify two cards with the same value (e.g., find two 'A's by inspecting initial state or pre-setting shuffle).
        *   Simulate clicking the first card.
        *   Simulate clicking the second card (the matching one).
    *   **Assertions**:
        *   Both cards should remain visible and display their value.
        *   Both cards should have a "matched" state/class.
        *   The internal `matchedPairs` count should increment by 1.
        *   The `moves` counter should increment by 1.

### 4. Non-Matching Pair Logic

*   **Test Case 4.1: Two Flipped Cards Do Not Match**
    *   **Description**: Verifies that if two flipped cards have different values, they flip back to their hidden state after a delay.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Identify two cards with different values (e.g., card 'A' and card 'B').
        *   Simulate clicking the first card.
        *   Simulate clicking the second card (the non-matching one).
    *   **Assertions (after timeout)**:
        *   Use `jest.advanceTimersByTime()` or `waitFor` from React Testing Library to handle the timeout.
        *   Both cards should revert to their hidden state (not displaying their value, showing '?').
        *   Neither card should have the "matched" state/class.
        *   The `moves` counter should increment by 1.
        *   The `matchedPairs` count should remain unchanged.

### 5. Win Condition

*   **Test Case 5.1: Game Win Trigger**
    *   **Description**: Ensures the game correctly identifies a win when all pairs have been matched and triggers the win celebration.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Simulate gameplay to match all pairs of cards. This might involve programmatically setting card states or a long sequence of clicks.
    *   **Assertions**:
        *   Verify the `WinCelebration` component becomes visible/is rendered.
        *   Verify the `showCelebration` state is true.
        *   The game board might become non-interactive (all cards disabled).

### 6. Restart Game Logic

*   **Test Case 6.1: Restart Button Functionality**
    *   **Description**: Checks if clicking the "Restart" button resets the game to its initial state.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Simulate a few moves (e.g., flip some cards, make a match or two).
        *   Simulate a click on the "Restart" button.
    *   **Assertions**:
        *   All cards are reset to their hidden state.
        *   The moves counter is reset to 0.
        *   The `matchedPairs` count is reset to 0.
        *   The `WinCelebration` component, if visible, should be hidden.

*   **Test Case 6.2: Card Randomization on Restart (If Applicable)**
    *   **Description**: If the game shuffles cards on restart, this test verifies that the card order is different from the previous game.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Record the initial order/values of cards (e.g., by their `id` and `value`).
        *   Simulate a click on the "Restart" button.
        *   Record the new order/values of cards.
    *   **Assertions**:
        *   The new card order should (with high probability) be different from the initial order. This might require multiple checks or a deterministic shuffle for testing. *Alternatively, ensure the `initialCards` generation logic (with `Math.random()`) is called again.*

### 7. Instructions Modal

*   **Test Case 7.1: Show Instructions**
    *   **Description**: Verifies clicking the "Instructions" button opens the instructions modal.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Simulate a click on the "Instructions" button.
    *   **Assertions**:
        *   Verify the `InstructionsModal` component becomes visible.
        *   Verify the `showInstructions` state is true.

*   **Test Case 7.2: Close Instructions**
    *   **Description**: Verifies the instructions modal can be closed.
    *   **Actions**:
        *   Render the `MemoryGame`.
        *   Click "Instructions" button.
        *   Simulate the close action on the modal (e.g., clicking its close button or overlay).
    *   **Assertions**:
        *   Verify the `InstructionsModal` component is no longer visible.
        *   Verify the `showInstructions` state is false.
```
