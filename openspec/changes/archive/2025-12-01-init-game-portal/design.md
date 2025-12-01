## Context
The user wants a minimalist, offline-capable game portal hosted on GitHub Pages. The games (Chess, Lines of Action) are turn-based, local multiplayer, and static.

## Goals / Non-Goals
- **Goals**: 
  - Extremely fast load times.
  - Offline capability (PWA).
  - Minimalist aesthetic.
  - Zero build steps (if possible) or very minimal tooling.
- **Non-Goals**: 
  - Online multiplayer (server-side).
  - Complex frameworks (React/Angular) - keeping it lightweight.
  - Backend database (use LocalStorage).

## Decisions
- **Decision**: Use **Vanilla JavaScript (ES6 Modules)** without a bundler.
  - **Why**: Modern browsers support ES modules natively. This keeps the repo simple, inspectable, and easy to deploy to GitHub Pages without a CI/CD build artifact step.
  - **Trade-off**: Slightly more network requests (HTTP/2 handles this well), potential browser compatibility issues with very old browsers (acceptable).

- **Decision**: **Cache-First Service Worker** strategy.
  - **Why**: The game assets are static and rarely change. We want the game to load instantly and work offline.
  - **Mechanism**: A versioned cache name in `service-worker.js`. When a new version is deployed, the SW updates the cache.

- **Decision**: **CSS Variables** for theming.
  - **Why**: Allows easy switching between Light/Dark modes or game-specific themes without complex CSS-in-JS libraries.

## Risks / Trade-offs
- **Risk**: Service Worker caching can sometimes be "sticky", making it hard for users to see updates immediately.
  - **Mitigation**: Implement a "New version available" toast notification if the SW detects an update.

## Open Questions
- None currently.

