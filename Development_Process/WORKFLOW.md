# Workflow

This repo runs two workflows side by side. Which one applies is decided by task type, not by preference — see `AGENTS.md` § Workflow for the one-line rule.

## 1. Migration Loop (JSP migration work)

Authoritative, complete definition: `../../prd-docs/prompts/00_migration_loop_master_prompt.txt`. This file does not duplicate it — only indexes the shape so an agent knows where to look:

- §1 — two tracks (Migration Loop / Content Agent), naming, do-not-confuse rule.
- §2 — the P1→P2→P3→P4 per-page/batch cadence, the 10-item unified verifier (§2.3), the 6 HITL hard gates (§2.4), the Mock-only data rule (§2.5).
- §3 — verified facts from the real JSP scan (do not re-scan; treat as ground truth).
- §4 — tech stack + design-system baseline (shadcn/ui, design tokens).
- §5 — the `.claude/skills/*` to build in Stage 0.
- §6 — Handoff Registry / CTA v1 scope.
- §7 — Stage 0 (build the loop) → Stage 1 (pilot: home + one result page) → Stage 2 (batched by template) → Stage 3 (full acceptance).
- §8 — what Stage 0's constitution content must cover (folded into `AGENTS.md` per `DECISIONS.md` D-001, not a separate file).

Any JSP-migration task — inventory, schema drafting, page import, batch verification — follows this file, not the generic spec/plan/tasks flow below. Working artifacts (P1 per-page inventory, P4 batch reports, cross-page roll-up maps) live under `migration/` and `mappings/` in this same folder — see `README.md` for the exact layout and `DECISIONS.md` D-002 for why these were relocated off the master prompt's literal `migration/...` path.

## 2. Generic spec flow (non-migration new features)

For work that isn't sourced from a JSP page — new capabilities added after migration, or infrastructure unrelated to the migration batches. Lives in `Development_Process/specs/NNN-<kebab-name>/` (created lazily; doesn't exist yet — first feature creates `specs/001-<name>/`).

### Gate rules (both gates require explicit approval after the artifact is shown; feedback is amended in place, not regenerated)

1. **`spec.md`** — what/why, no tech stack:
   ```md
   # <feature>
   ## Summary
   ## User stories       As a <role>, I want <capability>, so that <benefit>. (P1/P2/P3)
   ## Acceptance criteria  (one EARS pattern per criterion: WHEN/IF/WHILE/invariant SHALL)
   ## Edge cases
   ## Out of scope
   ## Clarifications
   ```
   Intake: save raw input verbatim to `specs/NNN-<name>/input.md` first. Multi-feature input → propose a split, confirm, spec only the first, stub the rest under `STATE.md` § Next. Tech-stack mandates in the input go into `plan.md`, not `spec.md`. Ambiguity → `[NEEDS CLARIFICATION: ...]`, never a silent guess.

   Clarification loop: one batch, ≤5 questions, multiple-choice with a recommended option where possible. Deferred/over-budget markers → adopt the most reasonable default, log under `## Clarifications` as "Assumption — override if wrong", treat as resolved.

   **Gate 1**: zero unresolved `[NEEDS CLARIFICATION]` markers, every criterion objectively testable. Ask: "Does the spec look good? If so, I'll write the technical plan."

2. **`plan.md`** — how: technical context (language/deps/storage/testing + constraints carried from `input.md`), design (components/interfaces/data-model/error handling), consistency check against `ARCHITECTURE.md`/`DECISIONS.md`, simplicity check (no future-proofing without a one-line justification per new abstraction/dependency).

   **Gate 2**: "Does the plan look good? If so, I'll break it into tasks."

3. **`tasks.md`** — execution checklist:
   ```md
   - [ ] T1 <task> (files: <paths>) — verify: <how> — refs: AC 1.1, 1.2
   ```
   Max two levels, each task independently implementable/verifiable, executable only (no research/doc-only tasks), dependency order, every task cites the acceptance criteria it satisfies. Coverage check: every AC in `spec.md` cited by ≥1 task, or explicitly approved as out of scope.

   **Gate 3**: "Do the tasks look good? If so, I'll start implementing."

4. **Implement**: per task — implement → run gates (lint/typecheck/tests/build) → check the box → commit `feat(NNN-<name>): Tn <summary>`. Never mark done without gates passing; never modify tests to force a pass. Mechanical spec corrections (wrong path, renamed symbol) amend in place with a dated note; any change to approved acceptance criteria/scope/behavior stops for re-approval and is logged under a `## Revisions` block in `spec.md`.

Proportionality: bug fixes / small changes (≤ ~2 files, no schema/API/permission surface) skip this flow entirely, for either track. When in doubt: ask "spec or direct?"
