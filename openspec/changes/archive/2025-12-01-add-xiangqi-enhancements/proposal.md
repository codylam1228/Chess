## Why
The user requested several enhancements:
1.  A "Reverse" (Undo) button for games.
2.  Deep verification of game logic.
3.  A switch to a "Light Theme".
4.  The addition of "Chinese Chess" (Xiangqi).

## What Changes
-   **UI**: Switch default theme to Light (updating CSS variables).
-   **Core**: Implement `undo()` capability in Game classes.
-   **Core**: Refine Chess and LOA logic (fix potential bugs, ensure robustness).
-   **New Game**: Implement Xiangqi (Chinese Chess) with 9x10 board and unique pieces.

## Impact
-   **Affected specs**:
    -   `chess`: Modified to add Undo.
    -   `loa`: Modified to add Undo.
    -   `xiangqi`: New capability.
-   **Affected code**:
    -   `src/styles/main.css` (Theme).
    -   `src/games/chess/` (Undo, Logic refinement).
    -   `src/games/loa/` (Undo, Logic refinement).
    -   `src/games/xiangqi/` (New implementation).

