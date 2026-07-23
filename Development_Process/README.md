# Development_Process

Single home for this project's engineering docs and working memory — nothing project-related should live in a separate `docs/` or root-level `migration/`/`specs/` again (see `DECISIONS.md` D-002 for why this consolidation happened).

Session protocol (see `AGENTS.md` § Session protocol for the authoritative version): read `STATE.md` + the last 1-2 `HISTORY.md` entries at session start; rewrite `STATE.md` and append one `HISTORY.md` entry at session end, mandatory every session.

| Path | Holds | Update trigger |
|---|---|---|
| `STATE.md` | Now / Next / Blockers / Recently landed / Tried & failed — mutable current snapshot | every session end (rewrite) |
| `HISTORY.md` | append-only session-by-session narrative log | every session end (append) |
| `ARCHITECTURE.md` | product goal, module responsibilities, invariants, data-flow | only when architecture actually changes |
| `DECISIONS.md` | append-only hard-to-reverse decision log | when a hard-to-reverse choice is made |
| `WORKFLOW.md` | index into the master-prompt migration process + the generic spec-gate templates | when the process itself changes |
| `mappings/page-map.md` | old JSP route ↔ new route, template group, migration status, index decision — roll-up across all pages | as each page enters/exits P1-P4 |
| `mappings/field-map.md` | old field ↔ new Sanity field or hardcode decision — roll-up across all pages | as each page's P1/P2 classifies fields |
| `mappings/feature-map.md` | old feature/module ↔ new implementation, status | as each feature is migrated or built |
| `mappings/user-flow-map.md` | old user journey ↔ new journey, deltas | as journeys are migrated/redesigned |
| `migration/inventory/<page>/inventory.md` | P1 per-page detailed classification (master-prompt artifact) | during P1, one per page |
| `migration/reports/report-<batch>.md` | P4 per-batch acceptance report (master-prompt artifact) | during P4, one per batch |
| `specs/NNN-<name>/{input,spec,plan,tasks}.md` | non-migration feature spec-gate flow | created lazily, first non-migration feature |

Notes:
- `mappings/*.md` are roll-up summaries, not the detailed record — keep them to one row per page/field/feature and point into `migration/inventory/<page>/` for detail, so they don't drift into unmaintainable duplicates.
- `scripts/migration/` (repo root) holds the P1-P4 script *code*; `Development_Process/migration/` holds the *data artifacts* those scripts produce. Don't confuse the two.
- Old site (`../../原网站代码asinseed`) is read-only reference — never edit. `../../prd-docs/SDD.md` is the primary build reference; `../../prd-docs/PRD.md` is for acceptance/cross-check (§10 AC, §12 DoD).
