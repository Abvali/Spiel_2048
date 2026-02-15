# Implementation Plan - Game2048 Class Refactoring

This plan outlines the steps to encapsulate the existing functional code from `js/app.js` into a structured `Game2048` class.

## Goal
Convert the global variables and standalone functions in `js/app.js` into a cohesive `Game2048` class. This will improve code organization, allow for multiple game instances, and fix the scope pollution issues.

## Proposed Class Structure

I will create a new file `js/Game2048.js` (or replace `js/app.js`) with the following structure:

```javascript
class Game2048 {
  constructor(elementSelector) {
    this.rows = 4;
    this.columns = 4;
    this.score = 0;
    this.bestScore = localStorage.getItem("bestScore") || 0;
    this.board = [];
    this.gameState = "playing"; // playing, paused, gameover
    this.container = document.querySelector(elementSelector);
    
    // Bind methods if necessary
    this.handleInput = this.handleInput.bind(this);
  }

  init() {
    this.createBoard();
    this.setupEventListeners();
    this.startTimer();
  }

  createBoard() {
    // Logic to initialize board (was createBoard)
  }

  addRandomTile() {
    // Logic to add a tile (was addNum)
  }

  // Movement Logic
  move(direction) {
    // Unified move handler calling specific direction methods
  }
  
  moveLeft() { ... }
  moveRight() { ... }
  moveUp() { ... }
  moveDown() { ... }

  // Rendering
  render() {
    // Logic to update the DOM (was renderBoard)
  }

  // Utilities
  transpose(matrix) { ... }
}

// Usage
const game = new Game2048("#board");
game.init();
```

## Changes Required

### [js/app.js](file:///home/sebtro/DEVOPS/repos/maryam/Spiel_2048/js/app.js)

1.  **Wrap Logic**: Move all `let` variables (`board`, `score`, `timerInterval`, etc.) into the `constructor`.
2.  **Refactor Functions**: Convert functions like `createBoard`, `twoOrFour`, `slideLeft` into class methods.
3.  **Update DOM References**: Instead of hardcoding selectors like `#board` everywhere, use `this.container` or scoped lookups.
4.  **Event Listeners**: Move global event listeners into a `setupEventListeners` method inside the class.

## Verification Plan

### Manual Verification
1.  Reload the browser.
2.  Verify the board initializes correctly.
3.  Test arrow keys for movement.
4.  Test New Game and Pause buttons.
5.  Check if Score and Timer update correctly.
