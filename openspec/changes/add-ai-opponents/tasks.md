## 1. Discovery & Design
- [ ] 1.1 Review current game logic for move generation gaps (e.g., Chess lacks check/checkmate detection).
- [ ] 1.2 Confirm UI affordances for mode selection and AI turn automation in the portal.

## 2. Spec & Conventions
- [ ] 2.1 Finalize AI requirements per capability (portal, chess, loa, jeung6kei2, pentago).
- [ ] 2.2 Update `openspec/project.md` with AI constraints (client-only, perf budgets, UX).

## 3. Implementation
- [ ] 3.1 Add portal mode selector for Human vs Human / Human vs AI.
- [ ] 3.2 Implement AI move generators per game (Chess, LOA, Jeung6kei2, Pentago) respecting time/complexity limits.
- [ ] 3.3 Wire UIs to trigger AI turns and keep controls (Undo/Save/Load/Reset) intact.

## 4. Validation
- [ ] 4.1 Add/adjust tests or manual test plan for AI flows per game.
- [ ] 4.2 Verify offline behavior remains intact (service worker, manifest).
- [ ] 4.3 Run `openspec validate add-ai-opponents --strict` and fix issues.

