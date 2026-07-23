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

## D-003: Handoff target host resolved to `sellersprite.ai` (2026-07-22, accepted)
- Context: PRD §0.3 `TBD-SELLERSPRITE-HOST` flagged a conflict between the live JSP CTA (`sellersprite.com`, `search.jsp`) and the master prompt's assumed allowlist (`sellersprite.ai`). Neither PRD nor SDD nor `ARCHITECTURE.md` could resolve this by inference per standing policy — required an explicit business decision.
- Decision: User confirmed the target host is `sellersprite.ai`. `sellersprite.com` is legacy and not carried into the new site's handoff-registry allowlist.
- Alternatives rejected: Keep the placeholder-domain-plus-TODO approach until a separate written sign-off — rejected, the user gave the decision directly in this session, no need to keep it open.
- Consequences: `PRD.md` §0.2/§0.3/§11, `SDD.md` §5.4/§9.2/§17, and `ARCHITECTURE.md` (data-flow + Open questions) all updated to state `sellersprite.ai` directly, no more TBD placeholder language. Any future change to this host still requires ask-first per `AGENTS.md` § Boundaries.

## D-004: Content automation workflow elevated from placeholder to active build, running in parallel with the migration pilot (2026-07-22, accepted)
- Context: PRD v0.2.0 explicitly scoped blog/article automation out of this phase (schema skeleton + placeholder skill only, §0.2 point 5 / §2.3 non-goal 4). User decided to bring it forward: build the real production→review→scheduled-publish pipeline now, using Sanity's own capabilities as much as possible, without waiting for the migration pilot (track A) to finish first — the two tracks (ADR-003) already have independent timing/permissions, so nothing structurally blocks running them concurrently.
- Decision: Content Agent (track B) is now an active work item. Pipeline: keyword library (`KeywordEntry`) → material library (`MaterialAsset`) → Content Agent writes `ContentEntry` with `workflowState: draft` → human moves it through `in_review` → `approved` in Studio → human schedules a Sanity **Content Release** for the approved doc → Sanity mechanically publishes at the scheduled time. E-E-A-T fields (`author`/`sourceCitations`/`methodology`) stay optional, not made mandatory for agent-generated content (explicit user call — validate the pipeline first, tighten later if needed). No third-party workflow plugin (see D-004's companion ADR-005 in `SDD.md` §16) — native Content Releases + a custom `workflowState` field is enough for this pipeline's actual needs.
- Alternatives rejected: (a) Wait for Stage 0-1 pilot to pass before starting track B — rejected, the tracks are already independent by design (ADR-003), no reason to serialize them. (b) Install `sanity-plugin-workflow` or similar for a richer Kanban review UI — rejected as over-engineering for the team size and actual requirement (see ADR-005). (c) Make E-E-A-T fields mandatory for agent-generated content — rejected per explicit user instruction, revisit only if quality issues surface later.
- Consequences: `PRD.md` §0.2/§2.3/§4.2/§6.3/§8/§9/§12 and `SDD.md` §10/§11/§12/§15/§16 rewritten accordingly (see PRD/SDD v0.3.0). `STATE.md` Now/Next updated to reflect two parallel fronts. Any implementation must enforce that agent-writable Sanity roles cannot move `workflowState` to `approved` or create/modify a Content Release — this is a testable Gate (SDD §12), not a convention to be trusted.
