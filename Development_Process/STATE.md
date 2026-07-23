# State

## Now
Repo scaffolded (git init + SDD §4 directory layout). `Development_Process/` established as the single home for engineering docs and project memory: `ARCHITECTURE.md` / `DECISIONS.md` / `WORKFLOW.md` / this file / `HISTORY.md` / `mappings/` (page/field/feature/user-flow roll-ups, empty) / `migration/` (P1 inventory + P4 reports, empty) / `specs/` (not yet created). No code, no dependencies, no Stage 0 deliverables yet.

## Next
- Resolve the Handoff target-domain conflict between PRD §0.3 (unresolved, pending business confirmation) and master-prompt §3/§6 (asserts `sellersprite.ai` already confirmed) — see `ARCHITECTURE.md` § Open questions. Blocks Stage 0's `handoff-registry` draft.
- On explicit go-ahead: run master-prompt Stage 0 (generate `.claude/skills/*`, design-tokens, handoff-registry draft, Mock/BFF contract skeleton) — see `AGENTS.md` § Workflow. When `scripts/migration/` and the `migration-state-checkpoint` skill are built, point them at `Development_Process/STATE.md` and `Development_Process/migration/` per `DECISIONS.md` D-002 — not the master prompt's literal root `migration/` path.
- Stage 1 pilot (after Stage 0 verified): `index.jsp` (home) + `search.jsp`/`search_keywords.jsp` merged result page. First P1 pass should populate `mappings/page-map.md` and `migration/inventory/index/inventory.md` (or equivalent).

## Blockers
- Handoff target domain unresolved between source docs (see above) — needs a human decision before `handoff-registry` can be built without guessing.

## Recently landed
- 2026-07-22: `Development_Process/` created per explicit user directive — consolidated former `docs/` into it, added `HISTORY.md`, `mappings/`, `migration/{inventory,reports}/`; `specs/` will live here too (not yet created). See `DECISIONS.md` D-002. `AGENTS.md` updated to reflect: old site is read-only reference, SDD is primary build reference, PRD is acceptance/cross-check reference.
- 2026-07-22: Repo initialized, `AGENTS.md`/`CLAUDE.md` + prior `docs/*` (now moved) created.

## Tried & failed
(none yet)
