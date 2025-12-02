## Why
Users need visual feedback to know which moves are valid for a selected piece, similar to the Lines of Action (LOA) implementation. This improves accessibility and usability.

## What Changes
- Update Chess UI to highlight valid moves when a piece is selected.
- Add `valid-move` style to Chess CSS.

## Impact
- Affected specs: `chess`
- Affected code: `src/games/chess/ui.js`, `src/styles/chess.css`

