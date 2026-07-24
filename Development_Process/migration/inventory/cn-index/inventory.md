# P1 Inventory: cn-index

## Scope
| Field | Value |
|---|---|
| JSP | D:\asinseed重构\原网站代码asinseed\asinseed-front\src\main\webapp\jsp\cn\__frontend\index.jsp |
| Locale | cn |
| Includes scanned | 13 (12 directly included by index.jsp + 1 transitive: header-language.jsp via header.jsp) |
| Controller evidence | FrontendController.java:24-27,34-41,43-50,90-93,95-102; SearchAsinController.java:65-68,97-108,925-931; WeChatController.java:32-36,349-353,392-399; BaseController.java:36 (all re-read and confirmed this pass) |
| Confidence | high |

## Route
| Legacy URL | Method | Parameters | Evidence | Status |
|---|---|---|---|---|
| `/cn` (resolves to `/`, locale prefix appended by LanguageAspect) | GET (any, `@RequestMapping` w/o method restriction) | none | FrontendController.java:43-50 (`dashboard()` returns `/__frontend/index.jsp`); LanguageAspect.java:39-48 (`assembleUrl` prefixes `/cn`) | confirmed |
| `/cn/{af:[A-Z]{2}\d\d\d\d}` (referral code entry, e.g. `/cn/AB1234`) | GET (any) | path var `af` | FrontendController.java:34-41 | confirmed |
| `/cn/{station}` (hero search form target, e.g. `/cn/US?q=...`) | form `method="post"`; Controller mapping has no explicit HTTP method restriction | `q`, `supplement`, `exactMatch`, `export`, `tracking`, `utm_asin`, `qid`, `token` | cn/index.jsp:41 (form action/method), cn/index.jsp:730 (JS sets `action` to `/cn/{station}?q={asin}`); SearchAsinController.java:65-68 (class mapping), 97-108 (`dispatcher()`) | confirmed |
| `/suggestions` (search-box autocomplete, polled every 1200ms) | GET | `station`, `keyword` | cn/index.jsp:537 (AJAX call site, inside script block 513-641); SearchAsinController.java:925-931 (`@GetMapping("/suggestions")`, `@AccessControl(FREE)`) | confirmed |
| `/w/wx/getQrCodeTicket/{id}?fresh=` (WeChat binding QR, cn-only) | GET | path var `id`, param `fresh` | cn/index.jsp:450; WeChatController.java:32-36 (class mapping `/w/wx`), 392-399 (`@AccessControl(LOGIN)`); BaseController.java:36 (`WAP_PREFIX="/w"`) | confirmed |
| `/w/wx/getQrState?ticket=` (WeChat scan-status poll, cn-only) | GET | `ticket` | cn/index.jsp:483; WeChatController.java:349-353 (no method-level `@AccessControl`, inherits class-level `FREE` from line 33) | confirmed |
| `/me/query-log/history` (query history sidebar, login-gated) | POST | `startIndex`, `searchType` | cn/base/history-asin.jsp:236 | UNRESOLVED (Controller not opened this session; presumed `user/MeController.java` per jsp-domain-scope mapping table, not verified) |
| `/me/query-log/batch-hide` (bulk delete history, login-gated) | POST | `ids` | cn/base/history-asin.jsp:297 | UNRESOLVED (same reason as above) |

## Includes And Dependencies
| Dependency | Type | Resolved path | Purpose | Evidence |
|---|---|---|---|---|
| taglib.jsp | `<%@ include %>` | cn/__frontend/base/taglib.jsp | JSTL taglib declarations (c/fmt/fn/pg/lc) | cn/index.jsp (head include) |
| languages.jsp | `<jsp:include>`/include | cn/__frontend/base/languages.jsp | Generates hreflang alternate `<link>` tags (zh/en/x-default) by stripping/re-adding `/cn`,`/en` prefix | cn/index.jsp (head include); languages.jsp:16-18 |
| styles.jsp | include | cn/__frontend/base/styles.jsp | CSS vendor links, inline `<style>`, Google Analytics gtag (`UA-125163434-1`) | cn/index.jsp (head include); styles.jsp:279-280 |
| header.jsp | `<jsp:include>` | cn/__frontend/base/header.jsp | Main nav, logo→`/cn`, login/signup or account-avatar dropdown, `#bbsViewModal`, `#VideoForHelpModal` (self-hosted mp4 `https://o.sellersprite.com/video/cn/AsinSeed-Tutorial-01.mp4`) | cn/index.jsp (body include) |
| header-language.jsp (transitive via header.jsp) | `<jsp:include>` | cn/__frontend/base/header-language.jsp | Language-switcher UI in nav; pre-verified 44-line file, reused evidence without re-reading per task instruction | header.jsp:23 |
| message.jsp | include | cn/__frontend/base/message.jsp | Dismissable session alert banner via `<lc:cached id="_message" remove="true"/>` | cn/index.jsp |
| qa.jsp | include | cn/__frontend/base/qa.jsp | FAQ accordion (`${questionList}`), contact/API-doc section | cn/index.jsp:390 |
| footer.jsp | include | cn/__frontend/base/footer.jsp | Logo/tagline, nav list, contact info, WeChat QR image, ICP beian line, copyright | cn/index.jsp:395-405 (footer/aside/etc. include block) |
| aside.jsp | include | cn/__frontend/base/aside.jsp | Account sidebar (`#sidebarAccount`), admin-only section (role S) | cn/index.jsp:395-405 |
| go-to-top.jsp | include | cn/__frontend/base/go-to-top.jsp | Floating "back to top" button (pure UI) | cn/index.jsp:395-405 |
| scripts.jsp | include | cn/__frontend/base/scripts.jsp | JS library loads, `bbs_cn.js` (logged-in only), Crisp chat widget init w/ user PII injection | cn/index.jsp:395-405 |
| history-asin.jsp | include, guarded by `<c:if>` (logged-in users only) | cn/__frontend/base/history-asin.jsp | Query-history sidebar (`#sidebar-history`) + AJAX (see Route table) | cn/index.jsp:80-82 (guard), 395-405 |
| tourist-filter-modal.jsp | include | cn/__frontend/base/tourist-filter-modal.jsp | Visitor login-prompt modal (`#filterModal`) | cn/index.jsp:395-405 |

## SEO And Content Classification
| Element | Current value or source | Classification | Proposed new home | Evidence |
|---|---|---|---|---|
| `<title>` | "AsinSeed - 超准确的亚马逊关键词反查工具" | hardcode | Next.js `<Metadata>` per-locale static string (or sanity if ops wants to edit copy) | cn/index.jsp:9 |
| hreflang alternates | zh/en/x-default, generated by stripping/re-adding `/cn`,`/en` prefix | hardcode (routing/SEO mechanism) | Next.js `alternates.languages` in metadata, derived from URL map, not literal content | languages.jsp:16-18 |
| Google Analytics gtag | `UA-125163434-1` | hardcode (technical/analytics config) | Next.js analytics config / env var | styles.jsp:279-280 |
| Hero heading + search form copy | "获取流量词" button, station dropdown (US/JP/UK/DE/FR/IT/ES/CA/IN), demo example links | hardcode (stable UI/design/routing) | Next.js component copy (i18n strings) | cn/index.jsp:41,63-71,75,78,89-91 |
| Commented-out "热门ASIN" example link | `<!-- /cn/hot/US -->`-style comment inside hero examples text | TBD-SEO (disabled feature, uncertain if intended to ship) | Flag for product decision in P2; do not silently resurrect | cn/index.jsp:92 |
| 3 feature blocks (真实用户搜索词/亿级关键词和商品/支持9国站点) | Static marketing copy | hardcode | Next.js component copy | cn/index.jsp:105-140 |
| Testimonials carousel (4 quotes + avatars) | Static customer quotes | TBD-SEO (marketing/testimonial content, editable by ops, candidate for sanity) | sanity (testimonials collection) if ops wants ongoing edit access; otherwise hardcode | cn/index.jsp:165-196,210-220 |
| Chrome extension promo block | Links to `/cn/extension` | hardcode | Next.js component | cn/index.jsp:241 |
| Help video promo block | Links to external blog `https://www.asinseed.com/cn/blog/amazon-keyword-moss` | TBD-SEO (external content dependency, blog post migration status unknown) | UNRESOLVED pending blog migration decision | cn/index.jsp:283 |
| Partner logos grid (~19 partners) | Static logo grid, China-market specific set | hardcode (locale-specific static asset list, not shared with en) | Next.js component, locale-scoped asset list | cn/index.jsp:302-364 |
| FAQ content (`${questionList}`) | CMS-backed via `articleService.listArticleByUriHead(Article.NORMAL_QUESTION, lang)` | sanity (ops-maintained content) | Sanity FAQ document type | qa.jsp:17-46; FrontendController.java:48 (`questionList` model attribute) |
| WeChat binding modal (`#myModal`) + QR flow | cn-only account feature | exclude (login-gated account feature, not a public SEO/content element) | exclude from Next.js homepage; revisit only if WeChat integration is in migration scope | cn/index.jsp:370-387,414-510 |
| Footer contact info, WeChat QR image, ICP beian line | Static company contact block + "蜀ICP备13020601号-6" | hardcode (ICP line is a fixed regional-legal requirement, not editable marketing copy) | Next.js footer component; ICP line must be preserved verbatim for cn only | footer.jsp:74 (address/contact block) |
| Account sidebar (`aside.jsp`) | Login-gated user/admin nav | exclude (account/admin, out of scope for homepage) | exclude | cn/index.jsp includes aside.jsp |
| Crisp chat widget init w/ user PII | Injects email hash, phone, session data for logged-in users | exclude (account-bound behavior) / hardcode (widget id itself) | exclude PII injection logic from static homepage migration; widget id itself is hardcode | scripts.jsp:54-67 |

## Forms And Data Calls
| Trigger | Endpoint | Method | Purpose | Migration boundary | Evidence |
|---|---|---|---|---|---|
| Hero search form `#form-asin-search` submit | `/cn/{station}?q={asin}` | POST (form attr) / Controller accepts any method | Keyword-reverse-lookup search dispatch | Not implemented as a live backend call in P3; Next.js should redirect/mock per current migration phase, real search result page is a separate migration item | cn/index.jsp:41,730 |
| Search-suggestions polling (every 1200ms while typing) | `/suggestions` | GET | Autocomplete dropdown suggestions | Mock-adapter in P3 per jsp-domain-scope discipline (no live backend calls during this migration phase) | cn/index.jsp:513-641 (block), 537 (call site) |
| WeChat QR ticket fetch (cn-only, on modal open) | `/w/wx/getQrCodeTicket/{id}?fresh=` | GET, login required | Generate WeChat account-binding QR code | exclude — account feature, cn-only, not part of homepage content migration | cn/index.jsp:450 |
| WeChat QR scan-state poll (cn-only) | `/w/wx/getQrState?ticket=` | GET | Poll whether user has scanned the QR | exclude — account feature, cn-only | cn/index.jsp:483 |
| Query-history load (sidebar, logged-in only) | `/me/query-log/history` | POST | Load user's search history list | exclude — account feature, login-gated; Controller UNRESOLVED this pass | history-asin.jsp:234-267 |
| Query-history batch delete (logged-in only) | `/me/query-log/batch-hide` | POST | Bulk-delete history rows | exclude — account feature, login-gated; Controller UNRESOLVED this pass | history-asin.jsp:295-311 |

## Index Candidate
| Candidate | Reason | P2 action |
|---|---|---|
| Yes | Homepage is the brand entry page, not a query-result/account/payment page; it is the canonical target that `/en`'s hreflang alternates point back to (languages.jsp:16-18), and is the natural self-canonical URL for `/cn` | Define canonical = self (`/cn`), hreflang alternates to `/en` and `x-default`, in the P2 URL Map; final `IndexDecision` is still determined by P2 server rules, not asserted here |

## Risks And Blockers
- cn-only feature surface: the homepage embeds a WeChat account-binding modal (`#myModal`, cn/index.jsp:370-387) plus AJAX polling (`/w/wx/getQrCodeTicket`, `/w/wx/getQrState`, cn/index.jsp:414-510) that has no counterpart anywhere in en/index.jsp (confirmed by full read of both files). Needs an explicit scope decision in P2 — most likely `exclude` from the initial Next.js homepage parity build.
- Known cross-locale difference (confirmed): en/footer.jsp has an extra "HOT ASIN" link (`/en/hot/US`, en/base/footer.jsp:34) that cn/footer.jsp does not have anywhere. (Note: a "热门ASIN"/"HOT ASIN" example link exists in a *commented-out* line inside the hero "示例/Examples" text in **both** cn/index.jsp:92 and en/index.jsp:92 — that commented block is unrelated to the uncommented en footer link and should not be conflated with it.)
- Known cross-locale difference (confirmed): en lacks the ICP beian registration line present at cn/base/footer.jsp:74 ("蜀ICP备13020601号-6") — expected/regional-legal, not a defect; this line must not be ported to en and must be preserved verbatim for cn.
- Known cross-locale difference (confirmed): en/base/aside.jsp has untranslated Chinese admin-section labels (工作台/用户管理/订单管理/促销管理/查询记录/系统管理/内容管理 at en/aside.jsp:103,109,115,121,127,133,141) inside an otherwise-English sidebar — technical debt in the legacy en page, admin-only (role S) so low visitor impact, flag for cleanup if this sidebar is migrated.
- Known cross-locale difference (confirmed): en/base/tourist-filter-modal.jsp has an extra, unbalanced closing `</div>` at line 21 with no matching open tag; cn's equivalent file is balanced (5 opens / 5 closes, ends cleanly at line 20). Minor legacy HTML defect — do not carry the extra tag into the Next.js migration.
- Known cross-locale difference (confirmed): help-video embed differs — cn/base/header.jsp embeds a self-hosted MP4 (`https://o.sellersprite.com/video/cn/AsinSeed-Tutorial-01.mp4`) in `#VideoForHelpModal`; en/base/header.jsp:227-231 embeds a YouTube iframe (`https://www.youtube.com/embed/shXUmHQSy-I`) in a separately-ID'd modal `#VideoForHelpModal-en`. API-doc link also differs (en points to `https://shimo.im/docs/ON6rp4yrhCcmv2Y7`); the exact cn API-doc URL was not re-captured with a line citation in this pass — treat as UNRESOLVED if exact cn URL parity is required for P2, recommend a short follow-up read of cn/base/header.jsp and cn/base/qa.jsp before finalizing that specific string.
- New finding (this pass): cn/index.jsp's testimonials carousel has 4 quotes; en/index.jsp's has only 3 — cn carries one extra testimonial with no en translation. Content-parity gap, not previously listed; flag for a translation/parity decision in P2.
- New finding (this pass): the partner/logo grid is entirely different between locales by design (cn/index.jsp:302-364 lists ~19 China-market partners; en/index.jsp:291-314 lists a different Western/international set) — expected market-specific content, not a defect, but must be modeled as locale-specific content (not a shared hardcoded asset) in P2/P3.
- New finding (this pass): `cn/__frontend/base/` contains one extra file, `jweixin.jsp`, absent from `en/__frontend/base/`. Neither locale's `index.jsp` references it directly, so it was out of this P1's reading scope, but it signals a broader cn-only WeChat-integration surface that may warrant its own domain-scope pass if WeChat features are ever brought into migration scope.
- `/me/query-log/history` and `/me/query-log/batch-hide` (history-asin.jsp:236,297) have no Controller evidence read in this session; presumed to live in `user/MeController.java` per the jsp-domain-scope mapping table but not verified this pass — marked UNRESOLVED in the Route table. Not a blocker for the homepage's own Index Candidate decision (this is a login-gated `exclude` account feature), but should be resolved whenever a P1 pass covers the 用户中心/`MeController` domain.

## P1 Exit Check
- [x] All local includes resolved or listed as `UNRESOLVED`. (13/13 resolved; none unresolved.)
- [x] Every route claim has Controller evidence or is `UNRESOLVED`. (Homepage/search/WeChat routes have re-confirmed Controller evidence; `/me/query-log/*` routes are explicitly marked `UNRESOLVED`.)
- [x] Every SEO/content element has one classification. (See SEO And Content Classification table.)
- [x] Forms and client data calls have a migration boundary. (See Forms And Data Calls table.)
- [x] No Next.js, Sanity schema, redirect or legacy-source change was made. (Only legacy files and skill docs were read this session; no writes outside this inventory file and its en-index counterpart.)
