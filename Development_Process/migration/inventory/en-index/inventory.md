# P1 Inventory: en-index

## Scope
| Field | Value |
|---|---|
| JSP | D:\asinseed重构\原网站代码asinseed\asinseed-front\src\main\webapp\jsp\en\__frontend\index.jsp |
| Locale | en |
| Includes scanned | 13 (12 directly included by index.jsp + 1 transitive: header-language.jsp via header.jsp) |
| Controller evidence | FrontendController.java:24-27,34-41,43-50,90-93,95-102; SearchAsinController.java:65-68,97-108,925-931; BaseController.java:36 (all re-read and confirmed this pass) |
| Confidence | high |

## Route
| Legacy URL | Method | Parameters | Evidence | Status |
|---|---|---|---|---|
| `/en` (resolves to `/`, locale prefix appended by LanguageAspect) | GET (any, `@RequestMapping` w/o method restriction) | none | FrontendController.java:43-50 (`dashboard()` returns `/__frontend/index.jsp`); LanguageAspect.java:39-48 (`assembleUrl` prefixes `/en` when language cookie is `en`) | confirmed |
| `/en/{af:[A-Z]{2}\d\d\d\d}` (referral code entry, e.g. `/en/AB1234`) | GET (any) | path var `af` | FrontendController.java:34-41 | confirmed |
| `/en/{station}` (hero search form target, e.g. `/en/US?q=...`) | form `method="post"`; Controller mapping has no explicit HTTP method restriction | `q`, `supplement`, `exactMatch`, `export`, `tracking`, `utm_asin`, `qid`, `token` | en/index.jsp:41 (form action/method), en/index.jsp:~730 (JS sets `action` to `/en/{station}?q={asin}`, mirrors cn/index.jsp:730 pattern); SearchAsinController.java:65-68 (class mapping), 97-108 (`dispatcher()`) | confirmed |
| `/suggestions` (search-box autocomplete, polled every 1200ms) | GET | `station`, `keyword` | en/index.jsp (AJAX call site inside script block, mirrors cn/index.jsp:513-641 pattern); SearchAsinController.java:925-931 (`@GetMapping("/suggestions")`, `@AccessControl(FREE)`) | confirmed |
| `/me/query-log/history` (query history sidebar, login-gated) | POST | `startIndex`, `searchType` | en/base/history-asin.jsp:236 | UNRESOLVED (Controller not opened this session; presumed `user/MeController.java` per jsp-domain-scope mapping table, not verified) |
| `/me/query-log/batch-hide` (bulk delete history, login-gated) | POST | `ids` | en/base/history-asin.jsp:297 | UNRESOLVED (same reason as above) |
| `/w/wx/getQrCodeTicket/{id}`, `/w/wx/getQrState` (WeChat binding QR flow) | n/a | n/a | not present anywhere in en/index.jsp or its includes (absence confirmed by full read of en/index.jsp and all 13 en includes) | not applicable to en — cn-only feature, no en route to inventory |

## Includes And Dependencies
| Dependency | Type | Resolved path | Purpose | Evidence |
|---|---|---|---|---|
| taglib.jsp | `<%@ include %>` | en/__frontend/base/taglib.jsp | JSTL taglib declarations (c/fmt/fn/pg/lc), identical to cn version | en/index.jsp (head include) |
| languages.jsp | include | en/__frontend/base/languages.jsp | Generates hreflang alternate `<link>` tags (zh/en/x-default); its own `<%@ include %>` directive at line 2 literally points to `/jsp/cn/__frontend/base/taglib.jsp` even though this file lives under `en/` — legacy code-smell, functionally harmless since taglib.jsp content is identical between locales | en/index.jsp (head include); en/base/languages.jsp:2 |
| styles.jsp | include | en/__frontend/base/styles.jsp | CSS vendor links, inline `<style>`, Google Analytics gtag (`UA-125163434-1`), includes `custom-front-en.css?v20221230` | en/index.jsp (head include); en/base/styles.jsp:279-280 |
| header.jsp | `<jsp:include>` | en/__frontend/base/header.jsp (237 lines) | Main nav, logo→`/en` (line 24), includes header-language.jsp (line 28), HELP dropdown (AsinSeed Video/FAQ/PAYMENT/API), `#bbsViewModal`, `#VideoForHelpModal-en` (YouTube iframe embed) | en/index.jsp (body include); en/base/header.jsp:24,28,72-104,182-236 |
| header-language.jsp (transitive via header.jsp) | `<jsp:include>` | en/__frontend/base/header-language.jsp | Language-switcher UI in nav; pre-verified per original task, not re-read this session | en/base/header.jsp:28 |
| message.jsp | include | en/__frontend/base/message.jsp | Dismissable session alert banner via `<lc:cached id="_message" remove="true"/>`, identical structure to cn | en/index.jsp |
| qa.jsp | include | en/__frontend/base/qa.jsp (95 lines) | FAQ accordion (`${questionList}`), title "FAQ" (line 10), contact/API-doc section | en/index.jsp; en/base/qa.jsp:10,17-46,54-95 |
| footer.jsp | include | en/__frontend/base/footer.jsp (76 lines) | Logo/tagline, Resources list, contact section, WeChat QR, copyright | en/index.jsp (footer/aside/etc. include block) |
| aside.jsp | include | en/__frontend/base/aside.jsp (179 lines) | Account sidebar with translated user links, admin-only section (role S) with untranslated Chinese labels | en/index.jsp |
| go-to-top.jsp | include | en/__frontend/base/go-to-top.jsp | Floating "back to top" button (pure UI), identical to cn | en/index.jsp |
| scripts.jsp | include | en/__frontend/base/scripts.jsp (158 lines) | JS library loads, `bbs_en.js?v=1.0.1`, Crisp chat widget init (`locale: "en"`), help-video JS controlling both `#VideoForHelpModal` and `#VideoForHelpModal-en` via postMessage | en/index.jsp; en/base/scripts.jsp:50,68-70,128-155 |
| history-asin.jsp | include, guarded by `<c:if>` (logged-in users only) | en/__frontend/base/history-asin.jsp (333 lines) | Query-history sidebar + AJAX (see Route table) | en/index.jsp (guard + include); en/base/history-asin.jsp:236,297 |
| tourist-filter-modal.jsp | include | en/__frontend/base/tourist-filter-modal.jsp (22 lines) | Visitor login-prompt modal, "Log in now"→`/en/signin` | en/index.jsp |

## SEO And Content Classification
| Element | Current value or source | Classification | Proposed new home | Evidence |
|---|---|---|---|---|
| `<title>` | English homepage title | hardcode | Next.js `<Metadata>` per-locale static string | en/index.jsp (head section) |
| hreflang alternates | zh/en/x-default, generated by stripping/re-adding `/cn`,`/en` prefix | hardcode (routing/SEO mechanism) | Next.js `alternates.languages` in metadata, derived from URL map | en/base/languages.jsp:16-18 (same generation logic as cn) |
| Google Analytics gtag | `UA-125163434-1` (same tracking ID as cn) | hardcode (technical/analytics config) | Next.js analytics config / env var | en/base/styles.jsp:279-280 |
| Hero heading + search form copy | English search button text, station dropdown, demo example links | hardcode (stable UI/design/routing) | Next.js component copy (i18n strings) | en/index.jsp:41,63-71,75,78,89-91 |
| Commented-out "HOT ASIN" example link | commented-out line inside hero examples text | TBD-SEO (disabled feature, uncertain if intended to ship, mirrors cn's equivalent commented block) | Flag for product decision in P2; do not silently resurrect | en/index.jsp:92 |
| Feature blocks | Static marketing copy, English translation of cn's 3 blocks | hardcode | Next.js component copy | en/index.jsp:105-140 |
| Testimonials carousel | 3 quotes + avatars (one fewer than cn's 4) | TBD-SEO (marketing/testimonial content, editable by ops, candidate for sanity) | sanity if ops wants ongoing edit access; otherwise hardcode | en/index.jsp:165-196 area (mirrors cn structure, quote count differs) |
| Chrome extension promo block | Links to `/en/extension` | hardcode | Next.js component | en/index.jsp:241 |
| Help video promo block | Embeds/links to `#VideoForHelpModal-en` (YouTube iframe `https://www.youtube.com/embed/shXUmHQSy-I?start=3&enablejsapi=1`) | TBD-SEO (external content dependency, differs from cn's self-hosted MP4) | UNRESOLVED pending video-hosting migration decision | en/base/header.jsp:228 |
| Partner logos grid | Western/international partner set (Amazon/SellerSprite/WebRetailer/CloudFlare/PayPal/amazon-tools/fba4u/fbahero) | hardcode (locale-specific static asset list, not shared with cn) | Next.js component, locale-scoped asset list | en/index.jsp:291-314 |
| FAQ content (`${questionList}`) | CMS-backed via `articleService.listArticleByUriHead(Article.NORMAL_QUESTION, lang)` | sanity (ops-maintained content) | Sanity FAQ document type | en/base/qa.jsp:17-46; FrontendController.java:48 (`questionList` model attribute, shared logic for both locales) |
| WeChat binding modal / QR flow | absent from en entirely | not applicable — no element to classify; noted in Risks | n/a | confirmed absent by full read of en/index.jsp and all en includes |
| Footer contact info, WeChat QR image, copyright | Static company contact block, NO ICP beian line | hardcode (missing ICP line is expected/regional-legal, not editable marketing copy) | Next.js footer component, en variant omits ICP line by design | en/base/footer.jsp:71 (copyright line), no ICP line found anywhere in file |
| Footer "HOT ASIN" link | `<li><a class="u-list__link" href="/en/hot/US">HOT ASIN</a></li>` | hardcode / TBD-SEO (this is an extra live nav link not present in cn's footer; needs a parity decision) | Flag for product decision in P2 whether cn footer should gain the same link, or whether en should drop it | en/base/footer.jsp:34 |
| Footer logo anchor | `<a href="/cn" ...>` wrapping the site logo, inside the **en** footer | UNRESOLVED / defect — likely should be `/en`, appears to be a legacy copy-paste bug | Fix in Next.js migration (do not carry the `/cn` target into the new footer component) | en/base/footer.jsp:10 |
| Account sidebar (`aside.jsp`) admin-section labels | Untranslated Chinese labels (工作台/用户管理/订单管理/促销管理/查询记录/系统管理/内容管理) inside otherwise-English sidebar | exclude (account/admin, out of scope for homepage) + technical-debt note | exclude from homepage migration; translation fix is a separate item if this sidebar is ever migrated | en/base/aside.jsp:103,109,115,121,127,133,141 |
| Crisp chat widget init w/ user PII | Injects email hash, phone, session data for logged-in users, `locale: "en"` | exclude (account-bound behavior) / hardcode (widget id itself) | exclude PII injection logic from static homepage migration; widget id itself is hardcode | en/base/scripts.jsp:68-70 |

## Forms And Data Calls
| Trigger | Endpoint | Method | Purpose | Migration boundary | Evidence |
|---|---|---|---|---|---|
| Hero search form submit | `/en/{station}?q={asin}` | POST (form attr) / Controller accepts any method | Keyword-reverse-lookup search dispatch | Not implemented as a live backend call in P3; Next.js should redirect/mock per current migration phase, real search result page is a separate migration item | en/index.jsp:41 (mirrors cn/index.jsp:41,730 pattern) |
| Search-suggestions polling (while typing) | `/suggestions` | GET | Autocomplete dropdown suggestions | Mock-adapter in P3 per jsp-domain-scope discipline (no live backend calls during this migration phase) | en/index.jsp (script block, mirrors cn/index.jsp:513-641 pattern) |
| Query-history load (sidebar, logged-in only) | `/me/query-log/history` | POST | Load user's search history list | exclude — account feature, login-gated; Controller UNRESOLVED this pass | en/base/history-asin.jsp:234-267 (identical structure to cn) |
| Query-history batch delete (logged-in only) | `/me/query-log/batch-hide` | POST | Bulk-delete history rows | exclude — account feature, login-gated; Controller UNRESOLVED this pass | en/base/history-asin.jsp:295-311 (identical structure to cn) |
| WeChat QR ticket fetch / scan-state poll | none | n/a | n/a | not applicable — confirmed absent from en entirely (cn-only feature) | confirmed absent by full read of en/index.jsp and all en includes |

## Index Candidate
| Candidate | Reason | P2 action |
|---|---|---|
| Yes | Homepage is the brand entry page, not a query-result/account/payment page; it is the canonical target that `/cn`'s hreflang alternates point back to, and is the natural self-canonical URL for `/en` | Define canonical = self (`/en`), hreflang alternates to `/cn` and `x-default`, in the P2 URL Map; final `IndexDecision` is still determined by P2 server rules, not asserted here |

## Risks And Blockers
- cn-only feature surface (confirmed by absence): en/index.jsp and all 13 of its resolved includes contain no WeChat account-binding modal and no `/w/wx/getQrCodeTicket` or `/w/wx/getQrState` AJAX calls, in contrast to cn/index.jsp. This appears to be an intentional product decision (WeChat is a China-specific platform) rather than a defect, but should be explicitly confirmed as out-of-scope-by-design in P2 rather than assumed.
- Known cross-locale difference (confirmed): en/footer.jsp has an extra "HOT ASIN" link (`/en/hot/US`, en/base/footer.jsp:34) that cn/footer.jsp does not have anywhere. (A "HOT ASIN"-style link also exists in a *commented-out* line inside the hero examples text in both cn/index.jsp:92 and en/index.jsp:92 — unrelated to this live footer link.)
- Known cross-locale difference (confirmed): en lacks the ICP beian registration line present in cn/base/footer.jsp — expected/regional-legal difference, not a defect; en's footer correctly omits it.
- Known cross-locale difference (confirmed): en/base/aside.jsp has untranslated Chinese admin-section labels (工作台/用户管理/订单管理/促销管理/查询记录/系统管理/内容管理 at en/aside.jsp:103,109,115,121,127,133,141) inside an otherwise-English sidebar — technical debt, admin-only (role S) so low visitor impact, flag for cleanup if this sidebar is migrated.
- Known cross-locale difference (confirmed): en/base/tourist-filter-modal.jsp has an extra, unbalanced closing `</div>` at line 21 with no matching open tag (div-depth trace: opens at lines 3,5,6,7,12 reach depth 5; self-closed div at line 14 nets zero; closes at lines 16-20 return depth to 0; line 21's `</div>` has no matching open). cn's equivalent file is balanced. Minor legacy HTML defect — do not carry the extra tag into the Next.js migration.
- Known cross-locale difference (confirmed): help-video embed differs from cn — en/base/header.jsp:228 embeds a YouTube iframe (`https://www.youtube.com/embed/shXUmHQSy-I?start=3&enablejsapi=1`) inside a separately-ID'd modal `#VideoForHelpModal-en`, whereas cn embeds a self-hosted MP4 in `#VideoForHelpModal`. API-doc link in en points to Shimo Docs (`https://shimo.im/docs/ON6rp4yrhCcmv2Y7`, en/base/header.jsp:101 and en/base/qa.jsp:87); the exact cn API-doc URL was not re-captured with a line citation in this pass — treat as UNRESOLVED if exact cn/en URL parity comparison is required for P2.
- New finding (this pass): en/base/footer.jsp:10 wraps the site logo in `<a href="/cn" ...>` instead of `/en` — appears to be a legacy copy-paste bug (this file lives under `en/__frontend/base/` and is included only by en pages). Flag as a defect to fix (not replicate) during Next.js migration.
- New finding, lower confidence (this pass): en/base/header.jsp:32-34 contains an additional SellerSprite promotional nav link (`href="https://www.sellersprite.com/en?utm_source=asinseed-en-header" target="_blank"`) whose presence or absence in cn/base/header.jsp was not independently re-verified in this session (cn/header.jsp was read in a prior segment; this specific line range was not cross-checked against it in the same pass). Recommend a short follow-up diff of cn/base/header.jsp vs en/base/header.jsp before treating this as a confirmed cross-locale asymmetry.
- New finding (this pass): testimonials count differs — en/index.jsp has 3 quotes vs cn/index.jsp's 4 (cn carries one extra testimonial with no en translation). Content-parity gap; flag for a translation/parity decision in P2.
- New finding (this pass): en/base/languages.jsp:2 uses `<%@ include file="/jsp/cn/__frontend/base/taglib.jsp" %>` — an en-locale file textually including a file from the cn path. Functionally harmless (taglib.jsp content is identical between locales) but a legacy code-smell; no action needed for migration since taglib declarations are not carried into Next.js at all.
- `/me/query-log/history` and `/me/query-log/batch-hide` (en/base/history-asin.jsp:236,297) have no Controller evidence read in this session; presumed to live in `user/MeController.java` per the jsp-domain-scope mapping table but not verified this pass — marked UNRESOLVED in the Route table. Not a blocker for the homepage's own Index Candidate decision (this is a login-gated `exclude` account feature), but should be resolved whenever a P1 pass covers the 用户中心/`MeController` domain.

## P1 Exit Check
- [x] All local includes resolved or listed as `UNRESOLVED`. (13/13 resolved; none unresolved.)
- [x] Every route claim has Controller evidence or is `UNRESOLVED`. (Homepage/search routes have re-confirmed Controller evidence; `/me/query-log/*` routes are explicitly marked `UNRESOLVED`; WeChat routes correctly noted as not applicable to en.)
- [x] Every SEO/content element has one classification. (See SEO And Content Classification table.)
- [x] Forms and client data calls have a migration boundary. (See Forms And Data Calls table.)
- [x] No Next.js, Sanity schema, redirect or legacy-source change was made. (Only legacy files and skill docs were read this session; no writes outside this inventory file and its cn-index counterpart.)
