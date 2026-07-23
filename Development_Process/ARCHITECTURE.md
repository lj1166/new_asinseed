# Architecture

## Product goal and boundaries

Rebuild the legacy JSP site (`../../原网站代码asinseed`, Java/Dubbo monolith, **read-only reference — never edit**) as a Next.js + Sanity + Vercel SEO front-end. ASINSeed is the free discovery layer (SEO-driven organic traffic, lightweight Reverse ASIN query); SellerSprite is the paid decision layer. Product responsibility is to hand users off cleanly to SellerSprite once they show decision-grade intent, not to compete with it.

This phase (per PRD §0.1) explicitly excludes: full-site migration, real backend integration, and production release. Full authoritative scope/non-goals: `../../prd-docs/PRD.md` §0.2/§2.3, process detail: `../../prd-docs/prompts/00_migration_loop_master_prompt.txt`. **SDD.md is the primary build reference; PRD.md is used for acceptance/cross-check (§10 AC, §12 DoD), not as the primary implementation spec.**

## Module responsibilities (prose)

- **`apps/web`** — Next.js App Router site. Renders all indexable pages via RSC. Never calls the real legacy backend, real payment provider, or production DB this phase.
- **`apps/studio`** — Sanity Studio. Holds only mutable SEO/content fields (SDD §10 `ContentEntry`); agents may write drafts, only a human publishes (SDD §11).
- **`packages/contracts`** — Zod schemas for Reverse ASIN / Handoff / Content, shared by `apps/web` and `packages/mock-adapters` so a future real-backend swap doesn't require call-site rewrites.
- **`packages/mock-adapters`** — The only data-layer implementation this phase: `MockReverseAsinProvider`, `IdentityAdapter`, `EntitlementAdapter` (SDD §5). Shape must match the future real contract; no enterprise-grade retry/fallback design is expected of a mock.
- **`scripts/migration`** — P1–P4 stage scripts (inventory → schema-draft → import → verify) driven by the Migration Loop workflow, one script family per JSP page/batch.

## Key invariants

- A single server-computed `IndexDecision` (SDD §7.1) feeds metadata, sitemap, and tests — never three separately-computed values that could disagree.
- Query-result pages (`/{locale}/{market}/{asin}`) are always `noindex` and never in the sitemap.
- Every new indexable page is linked from at least one other indexable page (no orphans).
- A result page renders at most one Handoff CTA; its target host must be in the `handoff-registry` allowlist. No hardcoded SellerSprite links anywhere in page code.
- Sanity schema holds only fields that are genuinely mutable SEO/content data. Price values (`price.jsp` origin) are always hardcoded, never stored in Sanity.
- `packages/mock-adapters` is the only path for Reverse ASIN / Identity / Entitlement business data this phase. No code calls the real Java/Dubbo backend, real payment provider, or production DB without the HITL approval in AGENTS.md § Boundaries.

## Data-flow overview

```
User → apps/web (Next.js, Vercel)
         ├─→ Sanity Content Lake        (content + SEO metadata, minimal GROQ projection)
         ├─→ packages/mock-adapters     (Reverse ASIN query / Identity / Entitlement — Mock only)
         └─→ Handoff Service            (reads handoff-registry allowlist)
                  └─→ SellerSprite      (static deep link; target host: see Open questions)
```

Real legacy backend is a future replacement target for `packages/mock-adapters`, not connected this phase (trigger condition: PRD `TBD-REAL-BACKEND-CUTOVER`).

## Open questions affecting this architecture

These are carried from `../../prd-docs/PRD.md` §0.3 — do not resolve them by inference:

- **Handoff target domain**: PRD §0.3/§11 list this as unresolved (`.com` vs `.ai`, pending written business confirmation). The master prompt (§3, §6) asserts it's already confirmed as `sellersprite.ai`. **These two source documents disagree** — flagged here rather than silently picking one; resolve with the business owner before `handoff-registry` is built in Stage 0.
- `seo/hot/*` programmatic pages: inclusion/merge strategy pending content-quality review (PRD `TBD-SEO-programmatic`).
- Mock → real backend cutover timing: pending business confirmation or an approved `legacy-contract-report.md` (PRD `TBD-REAL-BACKEND-CUTOVER`).
