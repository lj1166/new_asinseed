# Decisions

Append-only log. Never rewrite history — add a new entry to correct or supersede an old one.

```md
## D-NNN: <title> (<date>, accepted)
- Context: <1-3 lines>
- Decision: <1 line>
- Alternatives rejected: <1-2 lines, with why>
- Consequences: <1-2 lines>
```

---

## D-001: CLAUDE.md stays a one-line pointer; master-prompt §8's CLAUDE.md content lives in AGENTS.md/WORKFLOW.md instead (2026-07-22, accepted)
- Context: `../../prd-docs/prompts/00_migration_loop_master_prompt.txt` §8 specifies generating a standalone ~100-140 line `CLAUDE.md` as Stage 0's first deliverable. The project-init framework this repo follows mandates `AGENTS.md` as the single constitution, with `CLAUDE.md` reduced to a one-line `@AGENTS.md` import to prevent two divergent rule files.
- Decision: `AGENTS.md` is the constitution; `CLAUDE.md` = `@AGENTS.md`. When Stage 0 runs, master-prompt §8's required content (business north star, context management, P1-P4 map, coding conventions, Handoff/CTA minimal impl, iron rules, self-check, HITL summary, scope, reference paths) gets folded into `AGENTS.md` + `Development_Process/WORKFLOW.md`, not written into a second full file.
- Alternatives rejected: Generate `CLAUDE.md` verbatim per master-prompt §8 — rejected, creates two rule files that can drift apart over time.
- Consequences: Stage 0 execution must adapt master-prompt §8's "generate CLAUDE.md" step into "update AGENTS.md + Development_Process/WORKFLOW.md" — flag this adaptation explicitly when Stage 0 starts so it isn't a silent deviation from what the master prompt literally says.

## D-002: All engineering docs/memory consolidated under `Development_Process/`; migration artifacts relocated off the master prompt's literal path (2026-07-22, accepted)
- Context: User directive: `原网站代码asinseed/` is read-only reference (never edit); `prd-docs/SDD.md` is the primary build reference, `prd-docs/PRD.md` is for acceptance/cross-check; `new_asinseed/` is the workspace; a single `Development_Process/` folder inside it must unify history, feature/field/user-flow/page mapping relationships, and project working memory — nothing scattered across a bare `docs/`. The master prompt (§2.2, §5.6) separately specifies literal artifact paths `migration/<page>/inventory.md`, `migration/report-<batch>.md`, `migration/STATE.md`.
- Decision: Moved former `docs/{ARCHITECTURE,DECISIONS,STATE,WORKFLOW}.md` into `Development_Process/`. Added `Development_Process/HISTORY.md` (append-only session log, distinct from the mutable `STATE.md`), `Development_Process/mappings/{page,field,feature,user-flow}-map.md` (cross-page roll-up tables, old↔new), and `Development_Process/migration/{inventory,reports}/` (per-page/per-batch detail — the master prompt's P1/P4 artifacts, relocated here instead of a bare root `migration/`). `Development_Process/specs/` replaces a root-level `specs/` for the generic non-migration spec-gate flow. The master prompt's `migration/STATE.md` checkpoint is treated as this same `Development_Process/STATE.md` — not a second state file.
- Alternatives rejected: Keep `docs/` and add a separate root `migration/` + `specs/` per the master prompt's literal paths — rejected, produces 3+ scattered top-level locations for what the user explicitly wants as one unified home, and risks two divergent "current state" files (`docs/STATE.md` vs `migration/STATE.md`).
- Consequences: Any skill/script that reads or writes `migration/STATE.md`, `migration/<page>/inventory.md`, or `migration/report-<batch>.md` per the master prompt's literal text must be pointed at `Development_Process/STATE.md` / `Development_Process/migration/inventory/<page>/` / `Development_Process/migration/reports/` instead — this must be called out explicitly the first time Stage 0 builds `scripts/migration/` or `.claude/skills/migration-state-checkpoint`, so it isn't a silent deviation.
