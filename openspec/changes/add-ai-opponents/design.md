## Context
- All games are client-only, hotseat today. Users want an AI opponent option for every game.
- Current logic varies in completeness (e.g., Chess lacks check/checkmate detection; LOA and Pentago have clearer validation).
- Performance must stay within lightweight JS on GitHub Pages; no backend or heavy dependencies.

## Goals / Non-Goals
- Goals: Add a selectable AI opponent mode for all games; keep UX consistent; stay offline-capable; keep latency low.
- Non-Goals: Online play, ELO systems, persistent cloud profiles, multi-difficulty tuning beyond a single sensible default in v1.

## Decisions
- Per-game engine modules: extend existing logic to expose `listMoves(state)` and `chooseMove(state)` for AI use.
- Search: depth-limited minimax with alpha-beta where branching allows; fallback to heuristic greedy pick for tight budgets (Pentago/LOA may use shallow search with heuristics).
- Performance budget: target <3s per AI move on mid-tier devices; prefer <1s average; allow abort/fallback to random legal move if exceeded.
- UX: mode selection at portal; AI moves auto-trigger right after human move; AI side either fixed or selectable (TBD in tasks).
- Determinism: tie-break by stable ordering to keep reproducibility for saved games.

## Risks / Trade-offs
- Chess completeness: without check detection, AI might suggest illegal-in-check moves; requires augmenting rules—risk of scope creep.
- Pentago branching factor after rotation may need pruning or heuristic evaluation to stay responsive.
- Jeung6kei2 move generation complexity can impact performance; may need phased rollout or simplified eval.

## Migration Plan
- Add engine interfaces per game without breaking existing hotseat flows.
- Keep Save/Load stable by ensuring AI state is derivable from board/turn only (no hidden state).
- Validate offline behavior after bundling new scripts.

## Open Questions
- Do we need difficulty levels in v1 or just a single default? (Assume single default unless requested.)
- Should AI side be selectable (play as first/second) per game? (Assume yes in spec to cover both.) 

