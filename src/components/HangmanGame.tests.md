```markdown
# Hangman Game Unit Tests

This document outlines unit tests for the `HangmanGame` component, which is part of `src/App.tsx`. These tests aim to verify the core game logic and user interactions. We assume a testing environment like React Testing Library with Jest or Vitest.

## Test Suites and Cases

### 1. Initial State

*   **Test Case 1.1: Word Initialization and Display**
    *   **Description**: Verifies that a word is selected upon game initialization and displayed correctly as underscores.
    *   **Assertions**:
        *   Check that `selectedWord` state has a value from the `wordList`.
        *   Verify the displayed word consists of only underscores, matching the length of `selectedWord`. For example, if "REACT" is chosen, `_ _ _ _ _` should be displayed.

*   **Test Case 1.2: Hangman Figure Initial State**
    *   **Description**: Ensures the Hangman SVG figure is in its initial state (e.g., only the gallows, no body parts drawn).
    *   **Assertions**:
        *   Check that the number of drawn Hangman parts (e.g., `circle`, `line` elements corresponding to head, body, etc., beyond the gallows) is 0.
        *   Verify the `incorrectGuesses` state is 0.

*   **Test Case 1.3: Guessed Letters Initialization**
    *   **Description**: Confirms that no letters are marked as guessed at the start.
    *   **Assertions**:
        *   Verify the `guessedLetters` state array is empty.
        *   All buttons on the on-screen keyboard should be enabled and not styled as "guessed".

### 2. Letter Guessing Logic

*   **Test Case 2.1: Correct Letter Guess (Input Field & Keyboard)**
    *   **Description**: Tests functionality when a correct letter is guessed, both via input field and on-screen keyboard.
    *   **Actions**:
        *   Identify a letter present in the `selectedWord` (e.g., 'A' if word is "REACT").
        *   *Scenario 1 (Input):* Simulate typing the letter into the input field and submitting the form.
        *   *Scenario 2 (Keyboard):* Simulate clicking the corresponding letter button on the on-screen keyboard.
    *   **Assertions (for both scenarios)**:
        *   The letter is revealed in the displayed word (e.g., `_ A _ _ _` if 'A' was guessed for "REACT").
        *   The guessed letter is added to the `guessedLetters` state.
        *   The on-screen keyboard button for the guessed letter should be styled as correct (e.g., green background) and disabled.
        *   The `incorrectGuesses` state remains unchanged.
        *   The Hangman SVG figure remains unchanged.

*   **Test Case 2.2: Incorrect Letter Guess (Input Field & Keyboard)**
    *   **Description**: Tests functionality when an incorrect letter is guessed.
    *   **Actions**:
        *   Identify a letter *not* present in the `selectedWord` (e.g., 'Z' if word is "REACT").
        *   *Scenario 1 (Input):* Simulate typing 'Z' into the input field and submitting.
        *   *Scenario 2 (Keyboard):* Simulate clicking 'Z' on the on-screen keyboard.
    *   **Assertions (for both scenarios)**:
        *   The displayed word (underscores) remains unchanged.
        *   The guessed letter 'Z' is added to the `guessedLetters` state.
        *   The on-screen keyboard button for 'Z' should be styled as incorrect (e.g., red background) and disabled.
        *   The `incorrectGuesses` state increments by 1.
        *   One more part of the Hangman SVG figure is rendered.

*   **Test Case 2.3: Repeated Letter Guess**
    *   **Description**: Ensures that guessing the same letter multiple times (whether it was initially correct or incorrect) has no further effect.
    *   **Actions**:
        *   Guess a letter (e.g., 'A'). Note the game state (displayed word, incorrect guesses, Hangman figure).
        *   Guess the same letter 'A' again.
    *   **Assertions**:
        *   The game state (displayed word, `incorrectGuesses` count, Hangman figure, `guessedLetters` array) should be identical to the state after the first guess of 'A'.
        *   The input field should be cleared.

*   **Test Case 2.4: Invalid Input Handling (e.g., numbers, multiple characters)**
    *   **Description**: Tests how the input field handles invalid entries.
    *   **Actions**:
        *   Simulate typing "5" into the input field and submitting.
        *   Simulate typing "AB" into the input field and submitting.
        *   Simulate submitting an empty input field.
    *   **Assertions**:
        *   The `guessedLetters` state should not change.
        *   The `incorrectGuesses` state should not change.
        *   The Hangman figure should not change.
        *   The input field should be cleared or reject the input.
        *   No error should be thrown.

*   **Test Case 2.5: Case Insensitive Guess**
    *   **Description**: Ensures guesses are case-insensitive (e.g., 'a' is treated as 'A').
    *   **Actions**:
        *   Assume `selectedWord` is "REACT".
        *   Simulate typing 'r' (lowercase) into the input field and submitting.
    *   **Assertions**:
        *   The letter 'R' should be revealed in the display.
        *   'R' (uppercase) should be in `guessedLetters`.

### 3. Win Condition

*   **Test Case 3.1: Guessing All Letters Correctly**
    *   **Description**: Verifies that the game correctly identifies a win when all letters of the `selectedWord` are guessed.
    *   **Actions**:
        *   For the `selectedWord`, simulate guessing each unique letter correctly.
    *   **Assertions**:
        *   The full word should be displayed (no underscores).
        *   The `WinCelebration` component should be visible/rendered (or `gameStatus` is 'won' and `showWinCelebration` is true).
        *   A success message should be displayed.
        *   All letter input (input field and on-screen keyboard) should be disabled.

### 4. Loss Condition

*   **Test Case 4.1: Reaching Maximum Incorrect Guesses**
    *   **Description**: Verifies that the game correctly identifies a loss when `maxIncorrectGuesses` is reached.
    *   **Actions**:
        *   Simulate making `maxIncorrectGuesses` number of incorrect letter guesses.
    *   **Assertions**:
        *   The Hangman SVG figure should be fully drawn (all 6 parts visible).
        *   The `gameStatus` state should be 'lost'.
        *   A "Game Over" message should be displayed.
        *   The `selectedWord` should be revealed to the player.
        *   All letter input (input field and on-screen keyboard) should be disabled.

### 5. Restart Game Logic

*   **Test Case 5.1: Restart Button Functionality**
    *   **Description**: Checks that clicking the "Restart Game" / "New Word" button resets the game to a clean initial state with a new word.
    *   **Actions**:
        *   Make a few guesses (some correct, some incorrect).
        *   Note the `selectedWord`, `guessedLetters`, `incorrectGuesses`, and displayed word.
        *   Simulate clicking the "Restart Game" button.
    *   **Assertions**:
        *   A new `selectedWord` is chosen (should be different from the previous one with high probability, or ensure `initializeGame` logic is re-run).
        *   The displayed word is reset to all underscores, matching the new word's length.
        *   `guessedLetters` array is empty.
        *   `incorrectGuesses` count is 0.
        *   The Hangman SVG figure is reset to its initial state.
        *   `gameStatus` is 'playing'.
        *   `WinCelebration` (if previously visible) is hidden.
        *   Input field is clear and enabled. On-screen keyboard is reset.

### 6. Instructions Modal

*   **Test Case 6.1: Toggle Instructions Modal Visibility**
    *   **Description**: Verifies that the "Instructions" button correctly shows and hides the instructions modal.
    *   **Actions**:
        *   Render the `HangmanGame`.
        *   Simulate clicking the "Instructions" button.
    *   **Assertions**:
        *   The `InstructionsModal` component becomes visible (`showInstructions` state is true).
    *   **Actions (Part 2)**:
        *   Simulate clicking the close mechanism of the modal (or the "Instructions" button again if it's a toggle – though typically it's a one-way open, and modal has its own close).
    *   **Assertions (Part 2)**:
        *   The `InstructionsModal` is hidden (`showInstructions` state is false).
```
