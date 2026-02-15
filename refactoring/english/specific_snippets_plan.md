# Implementation Plan: Specific Code Snippets

This plan addresses the specific code issues identified in section "4. Specific Code Snippets" of the review.

## 1. `slideLeft` Implementation

**Issue**: The `slideLeft` function has a hardcoded value of `4` for the grid size.
```javascript
while (merged.length < 4) { // Hardcoded
  merged.push(0);
}
```

**Proposed Change**:
- Replace `4` with `this.columns` (or `GRID_SIZE` constant).
- Ensure the function adapts dynamically to the grid size defined in the class.

```javascript
while (merged.length < this.columns) {
  merged.push(0);
}
```

## 2. `renderBoard` Animation Optimization

**Issue**: The current animation logic scans `prevBoard` with nested loops (O(N^2) inside render) to find where a tile came from. This is inefficient and error-prone if multiple tiles have the same value.

**Proposed Change**:
- **Track Movement**: Instead of deducing movement *after* the fact, the `move` logic should generate a `transitions` map or array.
- **Data Structure**:
    ```javascript
    // Example structure generated during move()
    const transitions = [
      { id: 'tile-123', from: {r:0, c:0}, to: {r:0, c:1}, value: 2 },
      { id: 'tile-456', from: {r:0, c:3}, to: {r:0, c:2}, value: 4, type: 'merge' }
    ];
    ```
- **Tile IDs**:
    - Assign a unique ID to every tile when it is created.
    - Preserve this ID when moving.
    - When merging, keep the ID of the "surviving" tile or create a new merged ID.
- **Render Logic**:
    - iterate through the `transitions` list to apply CSS transforms.
    - This changes the complexity to O(N) (number of tiles) and ensures pixel-perfect animations.

## Execution

- These changes should be integrated directly into the new `Game2048` class methods `slideLeft` (or `move`) and `render`.
