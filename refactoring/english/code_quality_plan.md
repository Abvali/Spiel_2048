# Implementation Plan: Code Quality & Performance

This plan focuses on improving the readability, maintainability, and performance of the 2048 game code, addressing the issues identified in the "Code Quality & Performance" section of the review.

## 1. Naming Conventions & Readability

**Goal**: Replace generic or ambiguous names with descriptive standard names.

-   **Helper Functions**:
    -   Rename `el(css)` -> `qs(selector)` (Query Selector) or remove entirely if usage is low.
    -   Rename `group(css)` -> `qsa(selector)` (Query Selector All).
    -   Rename `create(html)` -> `createNode(tag)`.
-   **Game Logic**:
    -   Rename `twoOrFour()` -> `generateRandomTileValue()`.
    -   Rename `addNum()` -> `spawnRandomTile()`.
    -   Rename `rows`/`columns` -> `GRID_SIZE` (if square) or keep but ensure usage is consistent.

## 2. Optimization: Array Manipulation

**Goal**: Reduce unnecessary array creation and iteration during moves.

-   **Current Approach**:
    -   `moveRight` = `board` -> `reverse` -> `slideLeft` -> `reverse`.
    -   `moveUp` = `board` -> `transpose` -> `slideLeft` -> `transpose`.
    -   This creates multiple intermediate arrays and iterates the grid multiple times per move.

-   **Proposed Optimized Approach**:
    -   Implement a single `traverseAndMerge(vector)` method.
    -   Iterate through the grid using coordinate math based on the vector `(dx, dy)`.
    -   Move tiles directly to their destination without creating full temporary board copies for rotation/reversal.
    -   **Benefit**: Reduces memory allocation and CPU cycles, crucial for mobile performance or larger grids.

## 3. Timer Logic Improvements

**Goal**: Decouple game logic from UI updates and improve precision.

-   **Logic**:
    -   Store `startTime` and `accumulatedTime`.
    -   Use `requestAnimationFrame` for updating the UI display (timer digits) to ensure it doesn't block or lag the main thread, though `setInterval` is acceptable if checking `document.visibilityState`.
-   **Encapsulation**:
    -   Create a `Timer` class or object that handles `start`, `stop`, `reset`, and `getFormattedTime`.
    -   Game loop simply queries the timer.

## 4. General Code cleanup

-   **Magic Numbers**: Define constants for animation durations (e.g., `ANIMATION_DURATION = 400`).
-   **Event Delegation**: Ensure event listeners are attached efficiently.
-   **Strict Equality**: Verify usage of `===` everywhere.

## Execution Strategy

These changes can be applied alongside the **Class Refactoring** or as a separate pass.
-   **Recommended**: Apply *during* the Class Refactoring to avoid rewriting the same logic twice. The new `Game2048` class should use the new naming and optimized logic from the start.
