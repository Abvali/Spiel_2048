# Code Review: `js/app.js`

This document outlines the findings from the code review of `js/app.js` and provides suggestions for improvements.

## 1. Architecture & Structure

### Global Namespace Pollution
**Issue**: The game state (`board`, `score`, `timerInterval`, etc.) and helper functions are declared in the global scope.
**Impact**: This makes the code harder to maintain, test, and expand. It also increases the risk of variable name collisions if other scripts are added.
**Suggestion**: Encapsulate the game logic into a `class Game2048` or a module. This allows for better state management and potentially multiple game instances on one page.

### Separation of Concerns
**Issue**: Game logic (array manipulation) and UI logic (DOM updates) are tightly coupled. For example, `startTimer` updates the DOM directly inside the interval.
**Suggestion**: Separate the "Engine" (game rules) from the "Renderer" (UI). The Engine should emit events or call callbacks when the state changes, and the Renderer should update the UI.

## 2. Game Logic & Rules

### Random Tile Probability
**Issue**: The `twoOrFour` function has a 50/50 chance of generating a 2 or a 4.
```javascript
const twoNum = Math.floor(Math.random() * 2 + 1); // Returns 1 or 2
return twoNum == 2 ? 2 : 4;
```
**Standard 2048 Rule**: The standard game usually has a ~90% chance of spawning a 2 and ~10% chance of spawning a 4.
**Suggestion**: Adjust the probability logic to match standard gameplay or make it configurable.

### Hardcoded Grid Size
**Issue**: While `rows` and `columns` are defined as constants, the value `4` is hardcoded in `slideLeft` (line 90: `while (merged.length < 4)`).
**Suggestion**: Use the `columns` variable instead of the hardcoded `4` to ensure the game works correctly if the grid size changes.

## 3. Code Quality & Performance

### Variable Naming
- Functions like `el`, `group`, `create` are generic. Consider standard names like `$` or purely descriptive names like `qs` (querySelector).
- `twoOrFour` is descriptive but implementation-bound. `getRandomTileValue` would be better.
- `addNum` could be `spawnRandomTile`.

### Array Manipulation
**Issue**: `moveRight`, `moveUp`, and `moveDown` rely on `transpose` and `reverse`.
**Impact**: This involves creating multiple temporary arrays and iterating over the board multiple times for a single move.
**Suggestion**: While acceptable for a 4x4 grid, it's inefficient. A more robust approach involves coordinate mapping logic or passing a generic `vector` to the traversal function, reducing memory allocation.

### Timer Logic
**Issue**: `startTimer` uses `Date.now()` which is good, but the UI update happens every 1 second inside a `setInterval`.
**Suggestion**: For smoother updates or pause accuracy, `requestAnimationFrame` could be used, but `setInterval` is acceptable here. Ensure `clearInterval` is robustly called (currently looks handled).
**Minor**: `startTime = Date.now() - elapsedTime` relies on `elapsedTime` being tracked correctly on pause.

## 4. Specific Code Snippets

### `slideLeft` Implementation
```javascript
while (merged.length < 4) { // Hardcoded 4
  merged.push(0);
}
```
**Fix**: `while (merged.length < columns) { ... }`

### `renderBoard` Animation
**Issue**: The animation logic tries to deduce movement by scanning the `prevBoard`. This is O(N^2) complexity inside the render loop (nested loops finding the tile).
**Suggestion**: Track specific tile IDs or movement vectors during the logic phase (`slideLeft`) rather than deducing them after the fact. This ensures animations are always correct and 1:1 with the logic.

## Summary of Recommended Actions

1.  **Refactor to Class**: Create a `Game` class to hold state (`board`, `score`, `gameState`).
2.  **Fix Probability**: Change `twoOrFour` to favor '2'.
3.  **remove Magic Numbers**: Ensure `rows` and `columns` are used everywhere.
4.  **Optimize Animation**: Assign unique IDs to tiles to track their movement reliably instead of value-matching.
