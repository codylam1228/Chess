# Project Context

## Purpose
A minimalist web portal hosted on GitHub Pages for playing board games locally (hotseat multiplayer). The project aims to provide a simple, distraction-free environment for playing abstract strategy games like Chess and Lines of Action.

## Tech Stack
- **Frontend**: Plain HTML5, CSS3, and Modern JavaScript (ES6+).
- **Hosting**: GitHub Pages.
- **Libraries**: Minimal external dependencies. Potential use of a lightweight UI helper if UI complexity grows, but currently targeting Vanilla JS.

## Project Conventions

### Code Style
- **JavaScript**: Modern ES6+ syntax.
- **CSS**: CSS Variables for theming (supporting minimalist design).
- **Formatting**: Standard 2-space indentation.

### Architecture Patterns
- **Game Loop**: Event-driven for board games (turn-based), requestAnimationFrame for animations if needed.
- **State Management**: Simple in-memory state for current game session.
- **Component Structure**:
  - `index.html`: Main entry point / game selector.
  - `games/{game-name}/`: Directory for each game's logic and assets.
  - `shared/`: Shared styles and utilities.
- **AI Engines**: Per-game, client-side engines using lightweight JS (no backend). Expose deterministic move selection (e.g., depth-limited search with heuristics) with a target of <1s typical and <3s worst-case per AI turn on mid-tier devices.

### Git Workflow
- `main`: Production branch deployed to GitHub Pages.
- Feature branches for new games or capabilities.
- OpenSpec workflow for planning significant changes.

### UX Standards
- **Move Highlighting**: All games SHALL visually indicate valid moves when a piece is selected to improve accessibility.
- **Consistent Controls**: All games SHALL provide standard controls (Menu, Undo, Save, Load, Reset).

## Domain Context
- **Hotseat Multiplayer**: Two players sharing the same input device (mouse/touch).
- **Lines of Action (LOA)**: An abstract strategy board game played on an 8x8 checkerboard.
- **Chess**: Standard international chess rules.
- **jeung6kei2**: Cantonese version of Chinese Chess.
- **Pentago**: Abstract strategy game on a 6x6 grid with rotating quadrants.
- **Minesweeper**: Single-player puzzle about revealing safe cells while flagging mines across configurable grid sizes and difficulties.

## Important Constraints
- **No Backend**: The game must run entirely in the browser (client-side only).
- **Offline Capable**: Should ideally work without active internet after loading.
- **Device Support**: Responsive design to support desktop and potentially mobile/tablet in landscape.
- **Language**: Always use Cantonese (Traditional Chinese or Romanization) instead of Simplified Chinese.
- **AI Performance Budget**: AI computations SHALL avoid blocking the UI; aim for <3s per move with graceful fallback (e.g., shallower search) if limits are exceeded.
- **AI Save/Load**: Saved state MUST remain derivable from board/turn/history only (no hidden AI state required).
