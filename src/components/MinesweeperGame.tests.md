```markdown
# Minesweeper Game Unit Tests

This document outlines unit tests for the `MinesweeperGame` component, located within `src/App.tsx`. These tests are designed to ensure the core functionality and game logic behave as expected. We'll assume the use of a testing framework like React Testing Library combined with Jest or Vitest.

## Test Suites and Cases

### 1. Initial State

*   **Test Case 1.1: Grid Rendering and Dimensions**
    *   **Description**: Verifies the grid is rendered with the correct number of cells (e.g., 8x8 = 64 cells).
    *   **Assertions**:
        *   Check that `gridSize * gridSize` cell elements are present in the rendered output.
        *   Each cell should initially be in a hidden/unrevealed state.

*   **Test Case 1.2: Mine Placement Count**
    *   **Description**: Ensures the correct number of mines (`numMines`) are placed on the grid. This might require a helper function or inspecting the `grid` state directly if cell properties are not visually exposed without interaction.
    *   **Assertions**:
        *   Iterate through the `grid` state (or simulate gameplay to reveal all cells upon a loss) and count cells where `isMine` is true.
        *   Verify this count equals `numMines` (e.g., 10).

*   **Test Case 1.3: All Cells Initially Hidden**
    *   **Description**: Confirms all cells are unrevealed and not flagged at the start of the game.
    *   **Assertions**:
        *   For each cell, verify its `isRevealed` state is false and `isFlagged` state is false.
        *   Visually, cells should not show numbers, mines, or flags.

*   **Test Case 1.4: Mine Counter Initialization**
    *   **Description**: Checks that the mine counter correctly displays the total number of mines (or `numMines - flagsPlaced`, which is `numMines` initially).
    *   **Assertions**:
        *   Find the mine counter display element.
        *   Verify its text content shows the initial number of mines (e.g., "Mines: 10").

*   **Test Case 1.5: Flag Mode Off**
    *   **Description**: Ensures flag mode is disabled by default.
    *   **Assertions**:
        *   Verify the `flagMode` state is false.
        *   The "Toggle Flag" button should indicate that flag mode is OFF.

### 2. Cell Interaction (Reveal Mode - Flag Mode OFF)

*   **Test Case 2.1: Clicking a Mine Cell**
    *   **Description**: Tests the game over condition when a mine is clicked.
    *   **Actions**:
        *   Identify a cell that contains a mine (requires knowing mine locations, possibly by pre-setting the grid state for testability or by finding one).
        *   Simulate a click on this mine cell.
    *   **Assertions**:
        *   The `gameStatus` state changes to 'lost'.
        *   A "Game Over" message is displayed.
        *   All cells containing mines should be revealed and display a mine icon/style.
        *   Further clicks on other cells should have no effect (game interaction disabled).

*   **Test Case 2.2: Clicking a Non-Mine Cell with Adjacent Mines**
    *   **Description**: Tests revealing a safe cell that is adjacent to one or more mines.
    *   **Actions**:
        *   Identify a non-mine cell that has adjacent mines.
        *   Simulate a click on this cell.
    *   **Assertions**:
        *   The cell's `isRevealed` state becomes true.
        *   The cell displays a number corresponding to `adjacentMines` count.
        *   `gameStatus` remains 'playing'.

*   **Test Case 2.3: Clicking a Non-Mine Cell with Zero Adjacent Mines (Flood Fill)**
    *   **Description**: Tests the flood fill feature when a cell with no adjacent mines is clicked.
    *   **Actions**:
        *   Identify a non-mine cell with `adjacentMines === 0`.
        *   Simulate a click on this cell.
    *   **Assertions**:
        *   The clicked cell is revealed (displaying nothing or '0').
        *   All adjacent non-mine cells are recursively revealed until cells with `adjacentMines > 0` are found and revealed (but not their neighbors beyond them).
        *   Flagged cells should not be revealed by flood fill.
        *   `gameStatus` remains 'playing'.

*   **Test Case 2.4: Clicking a Revealed Cell**
    *   **Description**: Ensures clicking an already revealed cell does nothing.
    *   **Actions**:
        *   Click a safe cell to reveal it.
        *   Click the same (now revealed) cell again.
    *   **Assertions**:
        *   No change in game state (`grid`, `gameStatus`, `flagsPlaced`).

*   **Test Case 2.5: Clicking a Flagged Cell (in Reveal Mode)**
    *   **Description**: Ensures a flagged cell cannot be revealed when not in flag mode.
    *   **Actions**:
        *   Place a flag on a cell.
        *   Ensure flag mode is OFF.
        *   Simulate a click on the flagged cell.
    *   **Assertions**:
        *   The cell remains flagged and unrevealed.
        *   No change in game state.

### 3. Flagging Logic

*   **Test Case 3.1: Toggle Flag Mode Button**
    *   **Description**: Verifies the "Toggle Flag" button correctly switches `flagMode` state.
    *   **Actions**:
        *   Click the "Toggle Flag" button.
    *   **Assertions**:
        *   `flagMode` state becomes true. Button text/style updates to "Flag Mode (ON)".
        *   Click again. `flagMode` state becomes false. Button text/style updates to "Flag Mode (OFF)".

*   **Test Case 3.2: Placing a Flag**
    *   **Description**: Tests placing a flag on an unrevealed cell when in flag mode.
    *   **Actions**:
        *   Enable flag mode.
        *   Click an unrevealed, unflagged cell.
    *   **Assertions**:
        *   The cell's `isFlagged` state becomes true. It displays a flag icon.
        *   The `flagsPlaced` count increments.
        *   The mine counter display decrements (e.g., "Mines: 9").

*   **Test Case 3.3: Removing a Flag**
    *   **Description**: Tests removing a flag from a cell when in flag mode.
    *   **Actions**:
        *   Enable flag mode and place a flag on a cell.
        *   Click the same (now flagged) cell again.
    *   **Assertions**:
        *   The cell's `isFlagged` state becomes false. The flag icon is removed.
        *   The `flagsPlaced` count decrements.
        *   The mine counter display increments (e.g., back to "Mines: 10").

*   **Test Case 3.4: Flagging a Revealed Cell**
    *   **Description**: Ensures a revealed cell cannot be flagged.
    *   **Actions**:
        *   Reveal a safe cell.
        *   Enable flag mode.
        *   Click the revealed cell.
    *   **Assertions**:
        *   The cell remains revealed and does not become flagged.
        *   `flagsPlaced` count and mine counter do not change.

*   **Test Case 3.5: Flag Limit (Optional - if implemented)**
    *   **Description**: Tests if the game prevents placing more flags than the total number of mines.
    *   **Actions**:
        *   Enable flag mode.
        *   Place flags on `numMines` cells.
        *   Attempt to place one more flag on another unrevealed cell.
    *   **Assertions**:
        *   The additional flag is not placed.
        *   `flagsPlaced` count remains `numMines`.
        *   Mine counter remains "Mines: 0".

### 4. Win Condition

*   **Test Case 4.1: All Non-Mine Cells Revealed**
    *   **Description**: Verifies the win condition when all safe cells are revealed.
    *   **Actions**:
        *   Systematically reveal all non-mine cells (or setup a grid state where only non-mines are left to be revealed and reveal them).
    *   **Assertions**:
        *   `gameStatus` state changes to 'won'.
        *   `WinCelebration` component is displayed.
        *   A success message is shown.
        *   (If implemented) Any unflagged mines are automatically flagged. `flagsPlaced` becomes `numMines`.
        *   Game interaction (revealing/flagging) is disabled.

### 5. Loss Condition (Reinforcement)

*   **Test Case 5.1: Game Over on Mine Click**
    *   **Description**: Confirms all aspects of loss condition.
    *   **Actions**: Click a mine.
    *   **Assertions**:
        *   `gameStatus` is 'lost'.
        *   "Game Over" message is displayed.
        *   All mines on the board are revealed.
        *   No further interaction with cells is possible.

### 6. Restart Game Logic

*   **Test Case 6.1: Restart Button Functionality**
    *   **Description**: Checks if the "Restart Game" button correctly resets the game.
    *   **Actions**:
        *   Reveal some cells, place some flags.
        *   Click the "Restart Game" button.
    *   **Assertions**:
        *   A new grid is generated (mine positions should likely differ).
        *   All cells are reset to unrevealed and unflagged.
        *   `gameStatus` is 'playing'.
        *   `flagsPlaced` is 0. Mine counter is reset to `numMines`.
        *   `flagMode` is false.
        *   `WinCelebration` (if visible) is hidden.

### 7. Instructions Modal

*   **Test Case 7.1: Toggle Instructions Modal**
    *   **Description**: Verifies the "Instructions" button shows/hides the modal.
    *   **Actions**:
        *   Click the "Instructions" button.
    *   **Assertions**:
        *   `InstructionsModal` becomes visible (`showInstructions` state is true).
    *   **Actions (Part 2)**: Click the modal's close mechanism.
    *   **Assertions (Part 2)**: `InstructionsModal` is hidden (`showInstructions` state is false).
```
