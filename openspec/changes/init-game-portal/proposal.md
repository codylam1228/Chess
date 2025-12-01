## Why
The user wants to create a GitHub Page to play simple board games, specifically Chess and Lines of Action (LOA), in a minimalist environment with local multiplayer support. The app must be installable and work offline (PWA).

## What Changes
- Create a minimalist "Game Portal" landing page.
- Implement a "Chess" game engine and UI (Hotseat multiplayer).
- Implement a "Lines of Action" game engine and UI (Hotseat multiplayer).
- Implement Progressive Web App (PWA) features (Manifest, Service Worker).
- Configure the project for GitHub Pages deployment.

## Impact
- **Affected specs**: 
  - `portal`: New capability for the landing page.
  - `games/chess`: New capability for Chess.
  - `games/loa`: New capability for Lines of Action.
  - `pwa`: New capability for Offline/Install support.
- **Affected code**:
  - `index.html`: Main entry point.
  - `manifest.json`: App metadata.
  - `service-worker.js`: Offline caching.
  - `src/games/`: Game logic.
  - `src/styles/`: Shared minimalist styles.
