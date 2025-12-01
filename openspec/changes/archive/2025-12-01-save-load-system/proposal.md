## Why
The user wants to save and load game progress using JSON files. This allows pausing and resuming games across sessions or devices.

## What Changes
- Implement serialization (Export to JSON) and deserialization (Import from JSON) for all games.
- Add "Save" and "Load" buttons to the game UI.
- Ensure file names follow the format `{GameName}_{Timestamp}.json`.

## Impact
- **Affected specs**:
  - `chess`: Add Save/Load requirement.
  - `loa`: Add Save/Load requirement.
  - `xiangqi`: Add Save/Load requirement.
- **Affected code**:
  - `src/games/*/logic.js`: Add `toJSON`, `fromJSON`.
  - `src/games/*/ui.js`: Add Save/Load buttons and file handling logic.

