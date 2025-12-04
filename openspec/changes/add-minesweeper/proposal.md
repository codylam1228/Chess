## Why
To expand the game library with "Minesweeper", a classic single-player puzzle game that provides a different gameplay experience from the existing multiplayer board games. Minesweeper offers strategic thinking, pattern recognition, and risk assessment in a time-based challenge format.

## What Changes
- Add new game module: `minesweeper`
- Implement game logic (grid generation, mine placement, cell revelation, win/lose conditions, auto-reveal, chord-clicking).
- Implement UI with cell interaction (left-click reveal, right-click/long-press flagging), difficulty selection, timer, mine counter, and settings menu.
- Support multiple difficulty levels (Beginner, Intermediate, Expert, Infinity/Custom).
- Implement configurable game settings (first-click safety, auto-reveal behavior, etc.).
- Register Minesweeper in the main portal.
- Include standard controls (Menu, Undo, Save, Load, Reset) per project UX standards.

## Impact
- New capability: `minesweeper`
- Affected files: `src/games/minesweeper/*`, `src/styles/minesweeper.css`, `index.html`, `src/scripts/app.js`
- UX: First single-player game in the portal (others are hotseat multiplayer)

