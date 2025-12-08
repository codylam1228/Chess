## Why
Players want solo play with computer opponents for all existing games (Chess, LOA, Jeung6kei2, Pentago) while keeping the experience offline, lightweight, and consistent with current UX standards.

## What Changes
- Add AI opponent support to each game (Chess, LOA, Jeung6kei2, Pentago) with selectable Human vs Human or Human vs AI modes from the portal.
- Define per-game engine requirements (move generation, evaluation, search constraints) and UX expectations for turn automation.
- Update project conventions to document AI performance budgets and client-only constraints.

## Impact
- Affected specs: `portal`, `chess`, `loa`, `jeung6kei2`, `pentago`
- Affected code: game UIs (`src/games/*/ui.js`), game logic (`src/games/*/logic.js`), portal selector (`src/scripts/app.js`), shared UX patterns, project-level conventions.

