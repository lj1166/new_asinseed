# History

Append-only session log — one entry per session/window, never rewritten (only appended to). This is the durable narrative record; `STATE.md` is the mutable current-snapshot (Now/Next/Blockers) that gets rewritten every session; `DECISIONS.md` is only for hard-to-reverse architectural choices. When in doubt about which file to update: STATE.md always (mandatory), HISTORY.md always (mandatory, one entry), DECISIONS.md only if a hard-to-reverse choice was actually made.

Format:
```md
## <date> — <short title>
- <what happened / was decided / changed, 1-4 bullets>
```

---

## 2026-07-22 — Repo scan and constitution setup
- Scanned `原网站代码asinseed` (old JSP/Java-Dubbo site, git repo, read-only reference), `prd-docs` (PRD.md v0.2.0, SDD.md v0.2.0, master execution prompt), `new_asinseed` (empty, chosen as the actual workspace).
- Established `AGENTS.md` constitution + `docs/{ARCHITECTURE,DECISIONS,STATE,WORKFLOW}.md`, git-initialized `new_asinseed`, scaffolded SDD §4 directory layout (all placeholder, no code/deps).
- Resolved (via user confirmation) how the generic spec-driven init framework coexists with the project's own master-prompt migration process: master prompt is authoritative for all migration work; generic spec→plan→tasks gates only apply to non-migration future features. Logged as D-001 (CLAUDE.md stays a one-line pointer).
- Flagged, did not resolve: Handoff target-domain conflict between PRD §0.3 (unresolved) and master-prompt §3/§6 (asserts confirmed) — needs a human decision.
- Did not execute master-prompt Stage 0 (skills/design-tokens/handoff-registry/Mock contracts) — explicitly deferred per user instruction.

## 2026-07-22 — Development_Process consolidation
- User directive: old site read-only, SDD primary/PRD acceptance-only, `new_asinseed` is the workspace, and a single `Development_Process/` folder must unify history, feature/field/user-flow/page mapping, and project memory.
- Moved former `docs/*` into `Development_Process/`; added `HISTORY.md` (this file), `mappings/{page,field,feature,user-flow}-map.md` (empty roll-up tables), `migration/{inventory,reports}/` (empty, for P1/P4 artifacts), and reserved `Development_Process/specs/` for the generic spec-gate flow (replaces a root-level `specs/`). Logged as D-002.
- Updated `AGENTS.md` to state explicitly: never edit `原网站代码asinseed/`; SDD.md is the primary implementation reference, PRD.md is for acceptance/cross-check only.
- Still staged, not committed (git commit requires explicit user ask each time, per standing policy).

## 2026-07-22 — Scope change: Handoff domain confirmed + content automation brought forward
- User made two business decisions this session: (1) Handoff target host is `sellersprite.ai`, resolving PRD §0.3 `TBD-SELLERSPRITE-HOST`; (2) blog/article automation (track B), previously scoped as "placeholder only this phase," is now active — build the real keyword-library → material-library → agent-draft → human-review → scheduled-publish pipeline now, in parallel with track A's migration pilot.
- Clarified via AskUserQuestion: E-E-A-T fields (author/sourceCitations/methodology) stay fully optional, not made mandatory for agent-generated content; review/scheduling built on Sanity's native Content Releases API + a custom `workflowState` field, no third-party workflow plugin; track B starts now rather than waiting for the Stage 0-1 pilot to pass; PRD.md/SDD.md bumped v0.2.0 → v0.3.0.
- Edited `prd-docs/PRD.md` (§0.2, §0.3, §2.3, §4.2, §6.3 new CMS-04~06, §8 rewritten, §9, §11, §12) and `prd-docs/SDD.md` (§5.4, §9.2, §10 new `KeywordEntry`/`MaterialAsset`/`workflowState`, §11 rewritten, §12, §15, §16 new ADR-005, §17, §18) to reflect both decisions.
- Logged `DECISIONS.md` D-003 (domain) and D-004 (content automation scope). Updated `ARCHITECTURE.md` (Open questions, data-flow, module responsibilities) and `STATE.md` (removed the domain blocker, added track B to Next). Updated `AGENTS.md` § Boundaries to reflect the domain is now confirmed (future changes still require ask-first).
- Not committed (per standing policy — commits require explicit user ask).
