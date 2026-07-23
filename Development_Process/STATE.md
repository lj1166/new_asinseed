# State

## Now
Repo scaffolded (git init + SDD §4 directory layout). `Development_Process/` established as the single home for engineering docs and project memory: `ARCHITECTURE.md` / `DECISIONS.md` / `WORKFLOW.md` / this file / `HISTORY.md` / `mappings/` (page/field/feature/user-flow roll-ups, empty) / `migration/` (P1 inventory + P4 reports, empty) / `specs/` (not yet created). No code, no dependencies, no Stage 0 deliverables yet. PRD.md/SDD.md bumped to v0.3.0: Handoff target host resolved (`sellersprite.ai`) and content automation (track B) elevated from placeholder to active scope — see `DECISIONS.md` D-003/D-004.

## Next
Two parallel fronts now (tracks A and B, per ADR-003 — independent timing/permissions, neither blocks the other):

**Track A — Migration Loop:**
- On explicit go-ahead: run master-prompt Stage 0 (generate `.claude/skills/*`, design-tokens, handoff-registry draft using `sellersprite.ai`, Mock/BFF contract skeleton) — see `AGENTS.md` § Workflow. When `scripts/migration/` and the `migration-state-checkpoint` skill are built, point them at `Development_Process/STATE.md` and `Development_Process/migration/` per `DECISIONS.md` D-002 — not the master prompt's literal root `migration/` path.
- Stage 1 pilot (after Stage 0 verified): `index.jsp` (home) + `search.jsp`/`search_keywords.jsp` merged result page. First P1 pass should populate `mappings/page-map.md` and `migration/inventory/index/inventory.md` (or equivalent).

**Track B — Content Agent / automation:**
- Design `apps/studio` schemas for `ContentEntry` (+ `workflowState`/`generatedBy`), `KeywordEntry`, `MaterialAsset` per SDD §10.
- Build the custom `workflowState` document actions (draft → in_review → approved) with role-gated permissions so an agent identity cannot self-approve.
- Wire up Sanity Content Releases for human-scheduled publish of `approved` documents (SDD §11).
- Run at least one Content Agent draft through the full pipeline to human-approved + scheduled-publish, as the DoD check (PRD §12 point 6).

## Blockers
(none currently — the Handoff domain blocker is resolved, see Recently landed)

## Recently landed
- 2026-07-22: Handoff target host resolved to `sellersprite.ai` (user business decision); content automation workflow (track B) elevated from placeholder-only to active build scope, running in parallel with track A. `PRD.md`/`SDD.md` bumped v0.2.0 → v0.3.0; `ARCHITECTURE.md`, `DECISIONS.md` (D-003, D-004), `AGENTS.md` updated accordingly. See `DECISIONS.md` for full rationale.
- 2026-07-22: `Development_Process/` created per explicit user directive — consolidated former `docs/` into it, added `HISTORY.md`, `mappings/`, `migration/{inventory,reports}/`; `specs/` will live here too (not yet created). See `DECISIONS.md` D-002. `AGENTS.md` updated to reflect: old site is read-only reference, SDD is primary build reference, PRD is acceptance/cross-check reference.
- 2026-07-22: Repo initialized, `AGENTS.md`/`CLAUDE.md` + prior `docs/*` (now moved) created.

## Tried & failed
(none yet)
