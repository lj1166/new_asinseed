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
