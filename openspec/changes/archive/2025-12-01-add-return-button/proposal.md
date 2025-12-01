## Why
Users currently have to refresh the page to switch games. A "Return to Menu" button is needed to improve navigation.

## What Changes
- Add a "Return" button to the UI when a game is active.
- Implement logic to unload the current game and show the game selector.

## Impact
- **Affected specs**:
  - `portal`: Add requirement for returning to menu.
- **Affected code**:
  - `src/scripts/app.js`: Handle return logic.
  - `src/games/*/ui.js`: Add the button to the game UI (or add it globally in `index.html`).
  - *Decision*: I will implement it in `src/scripts/app.js` by adding a button to the main header or injecting it into the game container, to avoid modifying every game UI separately if possible. But game UIs control their container.
  - *Better approach*: Modify `app.js` to handle a global "Return" event or inject the button.
  - *Simplest*: Add "Return" button to the control bar of each game (Chess, LOA, Xiangqi) in `ui.js`. This keeps it consistent with "Reset/Save/Load".

