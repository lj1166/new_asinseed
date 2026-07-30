---
name: asinseed-saas-design
description: Design, redesign, or audit AsinSeed Next.js and Sanity SaaS landing pages, tool pages, conversion pages, and resource pages. Use when a request mentions page visual quality, design direction, interaction, layout, UI polish, product experience, component design, responsive design, or a design review. Enforce AsinSeed's tool-first, Chinese-first, SEO/GEO-aware, no-legacy-replication design rules.
---

# AsinSeed SaaS Design

Build a credible, task-first SaaS product experience. Do not turn the site into an old JSP clone, a generic template, or a static marketing poster.

## Start With Facts And The User Job

1. Read `AGENTS.md` and the relevant `Development_Process/` record before changing a page.
2. Classify the page as exactly one primary role: `tool`, `conversion`, `landing`, `resource`, `trust`, or `utility`.
3. State the primary user job in one sentence: `When <context>, I want to <action>, so I can <outcome>.`
4. Separate inputs into:
   - **Verified facts** — current contracts, APIs, fields, permissions, routes, and approved assets.
   - **Original presentation** — hierarchy, explanatory copy, layout, illustration, and interaction treatment.
   - **Unverified claims** — never render as facts; omit or label as preview/mock.
5. For a new page or a page-role change, record the above in the migration rebuild brief before implementation. When the business direction is already clear, continue into local implementation; do not create an extra approval stop.

Use old JSP only for routes, field semantics, data sources, user tasks, and business boundaries. Never reuse its DOM, layout, visible copy, images, or visual language by default.

## Taste-Informed Design Read And Three Dials

Before changing markup or tokens, write one internal line in this form:

> Reading this as: `<page role>` for `<audience>`, with a `<trust / energy / density>` language, leaning toward `<original AsinSeed direction>`.

Infer from the page role, user job, confirmed brand, supplied references, audience, content/data density, and trust constraints. Ask one concise question only if two genuinely different directions would change the page role or task; otherwise declare the read and proceed.

Set these dials explicitly. They guide composition; they never override verified data, accessibility, the route contract, or the non-negotiable rules below.

| Dial | 1 | 10 | AsinSeed defaults |
|---|---|---|---|
| `DESIGN_VARIANCE` | calm/symmetric | expressive/asymmetric | homepage `6`, tool page `5`, resource page `4` |
| `MOTION_INTENSITY` | static feedback only | cinematic/scroll-led | homepage `3`, tool page `3`, resource page `2` |
| `VISUAL_DENSITY` | airy/editorial | compact/cockpit | homepage `5`, tool page `7`, resource page `5` |

- Raise variance only when it improves task orientation or creates one memorable, original focal point. Never randomize product structure.
- Keep motion at `4` or lower unless the user explicitly approves a higher value. Prefer native state transitions and CSS transforms; do not add GSAP, scroll pinning, horizontal scroll, magnetic buttons, or autoplay merely to look premium.
- Raise density on a tool page through real fields, labels, filters, states, and tables—not extra marketing cards or fabricated metrics.
- Use the dials to explain a design revision in plain language. Example: “The tool felt like a poster, so density rises from 5 to 7 while motion remains 3.”

## Existing Page Redesign Loop

For an existing AsinSeed page, work in this order. A major rebuild may replace composition completely, but it must preserve approved URL, data, SEO, Sanity, and task contracts.

1. **Scan:** inspect the route, page role, active components, tokens, runtime states, Sanity consumers, mobile behavior, and existing tests.
2. **Diagnose:** list the specific generic patterns, weak hierarchy, missing states, Chinese typography failures, and functionality that must remain intact.
3. **Remap:** define the new task sequence before styling. For example, a search tool is `input → recognition → query → result → next action`, not `hero → feature cards → CTA`.
4. **Build:** replace the weakest structural pattern first, then establish type, surface, component, and interaction hierarchy through shared primitives.
5. **Verify:** compare the implemented route against the Design Read, dials, state matrix, visual boundaries, and runtime contract. Do not call a page redesigned because only colors, radius, or a hero changed.

Keep work reviewable: preserve the framework and approved dependencies unless a concrete missing behavior requires a new dependency. Do not rewrite backend/data behavior as part of a visual task.

## Non-Negotiable AsinSeed Rules

- Use `#FF9200` only through central design tokens for brand emphasis, primary actions, and focus. Do not flood the entire page with orange.
- Use solid surfaces, purposeful borders, space, typography, SVG lines, and real task states. Do not use CSS/SVG gradients, blur, `backdrop-filter`, or glassmorphism unless the user explicitly approves that page.
- Build in simplified Chinese first. Do not expose incomplete locales, hreflang, or translated fallback UI.
- Make the primary action work as standard HTML before enhancement whenever practical. Client interaction must add useful feedback rather than hide core content.
- Do not fabricate live data, customer logos, results, statistics, integrations, permissions, or product states. Make Mock and preview data explicit.
- Keep metadata in SEO fields and visible copy in page-content fields. Every Sanity field must have one owner, one frontend consumer, and a fallback rule.
- Treat SEO/GEO as information quality: semantic SSR structure, direct answerability, clear entities, useful original content, and honest evidence. Do not add AI-keyword stuffing or decorative schema.
- Respect `prefers-reduced-motion`. Animation must explain a state change, hierarchy, or user action.

## Choose A Deliberate Visual Direction

Before writing page markup, declare one direction in 3–6 lines. Do not combine several aesthetics opportunistically.

For AsinSeed, prefer **calibrated research workspace**:

- warm off-white working surface, ink-dominant reading hierarchy, and orange only for decisions and focus;
- compact query controls, field labels, status rails, data density, and visibly honest result boundaries;
- asymmetry created by task flow and information density, not decorative floating cards;
- an original solid-line motif or small data mark may support orientation, but it must not replace the product task.

Reject these default patterns unless the page role genuinely needs them:

- giant slogan + three equal cards + FAQ + final CTA;
- every section inside the same rounded white card;
- icon-above-heading feature grids;
- oversized English-style headline settings that crush Chinese line height;
- dashboard theatre: fake charts, fluctuating metrics, or loading animation without a real task.

## Anti-Slop Audit

Run this audit once before implementation and once after the first visual build. Each `FAIL` requires a structural correction, not a cosmetic color swap.

| Check | FAIL signal | Required correction |
|---|---|---|
| Default composition | centered slogan, split hero, or three equal cards could describe any AI SaaS page | make the verified task or one page-specific proof the dominant composition |
| Empty visual theater | oversized whitespace, fake dashboard, decorative labels, or an illustration that hides the action | move the real query/task state into the first viewport and remove nonfunctional decoration |
| Card monoculture | every idea sits in the same rounded, padded white rectangle | use hierarchy, density, alignment, controlled surface shifts, or a data workspace instead of repeated cards |
| Chinese typography | compressed multi-line H1, orphaned final character/word, excessive negative tracking, or small low-contrast labels | reduce display size before crushing leading; use balanced wrapping, comfortable Chinese line height, and a deliberate text scale |
| Color without purpose | orange appears as wallpaper, multiple unrelated accents compete, or text contrast is weak | restore ink-led reading hierarchy and reserve `#FF9200` for focus, decision, and primary action |
| Motion without meaning | scroll spectacle, looping decoration, or hover movement does not clarify a state | remove it or attach it to input recognition, validation, loading, result appearance, or navigation feedback |
| Generic proof | stock-looking media, invented metrics, logos, reviews, or live-result claims | remove it; use approved evidence or an explicit Mock/preview boundary |
| Incomplete product states | only happy path exists or keyboard/focus/error/empty/loading are absent | complete the state matrix before visual polish |

Do not introduce the following common defaults: AI-purple/blue mesh, universal glass panels, floating badges, icon-above-heading feature grids, arbitrary all-caps labels, endless micro-animation, or a “premium” effect that disappears when the real task is removed.

## Design The Task, Not A Poster

### Tool page

Make the workspace the visual center. At minimum define:

1. input composition (market, ASIN/keyword, filters);
2. recognition feedback (what mode/input was detected);
3. loading, empty, error, and success states;
4. the next meaningful action after a result;
5. a visible data/provenance boundary.

Prefer native `<form>`, `<input>`, `<select>`, `<output>`, `<progress>`, `<details>`, tables, and semantic buttons. Use client enhancement for suggestions, mode changes, result transitions, and keyboard-friendly shortcuts. Do not animate merely because a CSS animation is available.

### Landing or conversion page

Make one real entry action dominant. Put product proof, a genuine tool entry, or a clearly labelled preview near the top. Keep long educational material in future resource/blog pages instead of inflating the landing page.

### Resource page

Optimize for scanning, direct answers, provenance, related task links, and readable long-form Chinese. Do not make an article look like a sales landing page.

## Build A Small, Coherent System

Use and extend shared primitives instead of styling every page ad hoc.

- **Foundation:** semantic color tokens, spacing steps, border weights, elevation only when it conveys hierarchy, and responsive container rules.
- **Typography:** define a Chinese display/body scale with comfortable multi-line leading. Use tracking sparingly; reduce heading size before tightening Chinese text into unreadable wraps.
- **Product primitives:** query composer, field label, status indicator, provenance note, result table, empty/error state, primary/secondary action, and contextual help.
- **Composition:** use one dominant surface per viewport. Vary density and alignment according to the task; do not solve every hierarchy problem by adding cards.
- **States:** design default, hover, focus, disabled, loading, empty, error, and success before calling a component complete.

Use an external component library only as an accessible behavior foundation. Do not import a template's visual identity. Tailwind + shadcn-style local primitives are sufficient unless a concrete missing behavior justifies a dependency.

## Reference Research

When the user supplies a reference site or asks for market research:

1. Extract principles: page role, task sequence, density, type scale, color roles, responsive behavior, and interaction states.
2. Record only reusable observations; do not copy markup, illustrations, copyrighted content, screenshots, or layout pixel-for-pixel.
3. Convert observations into an original AsinSeed direction that satisfies this Skill's constraints.
4. Compare the final page against the reference only for task clarity and quality—not visual equivalence.

## Review Before Delivery

Run this critique before declaring a visual task complete:

- **Purpose:** Can a first-time seller name the page's job and primary action in five seconds?
- **Hierarchy:** Does the eye reach task, input, feedback, and next step in that order?
- **Product reality:** Does every dynamic state correspond to a contract or an explicitly labelled Mock/preview?
- **Anti-template check:** Would “hero + equal cards + generic icons” describe the page? If yes, redesign the composition.
- **Chinese typography:** Are line breaks, line height, contrast, and small labels readable at desktop and mobile widths?
- **Interaction:** Are keyboard focus, disabled/loading/error/success behavior, and reduced-motion behavior meaningful?
- **SEO/GEO:** Is there one visible H1, semantic headings, a concise direct explanation where useful, and no hidden keyword manipulation?
- **Visual boundary:** Confirm no gradient, blur, glass effect, legacy artwork, or unapproved claims were introduced.
- **Taste readback:** Does the finished page still match its Design Read and dial settings? If not, correct the page rather than retrofitting the read.
- **Redesign depth:** Can the before/after difference be described as a changed task sequence and component language, not merely a new Hero or palette?

For implementation work, verify desktop and 390px mobile views, run the relevant typecheck/build/e2e tests, and report the remaining fact/data limitations separately from visual decisions.

## Required Delivery Shape

Report in this order:

1. page role and user job;
2. Design Read, three dial values, chosen visual direction, and why they fit the task;
3. implemented task and state changes;
4. Sanity field ownership and frontend consumption changes, if any;
5. validation evidence and known content/data limits.
