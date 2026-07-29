# P1 Inventory: cn-search-tool

## Scope

| Field | Value |
|---|---|
| JSP | `D:\asinseed重构\原网站代码asinseed\asinseed-front\src\main\webapp\jsp\cn\__frontend\search.jsp`; `D:\asinseed重构\原网站代码asinseed\asinseed-front\src\main\webapp\jsp\cn\__frontend\search_keywords.jsp` |
| Locale | cn |
| Includes scanned | 17 个去重后的本地 include：`taglib`、`languages`、`styles`、`header`、`header-language`、`message`、`module-trend`、`scripts`、`extension-plugin`、`footer`、`aside`、`go-to-top`、`history-asin`、`history-keywords`、`tourist-filter-modal`、`module-popup-monthly`、`module-popup-chart`。共享 `taglib.jsp` 被多处复用，不是循环 include。 |
| Controller evidence | `D:\asinseed重构\原网站代码asinseed\asinseed-front\src\main\java\com\iyunya\asinseed\monitor\controller\frontend\SearchAsinController.java:98-133,137-142,275-307,659-662,925-927` |
| Confidence | medium：核心输入、分流和结果字段有源码证据；`/cn` locale 前缀的全局映射、真实数据源/权限规则及素材权利未在本 P1 范围内证明。 |

## Route

| Legacy URL | Method | Parameters | Evidence | Status |
|---|---|---|---|---|
| `/{market}?q=<ASIN>`（JSP 生成链接显示为 `/cn/{market}?q=...`） | annotation 未限定 method | `q`、`tracking`、`utm_asin`、`qid`、`token`、`export` | `SearchAsinController.java:98-108,128-132`; `search.jsp:241-243` | `UNRESOLVED`：Controller 证明 market dispatcher 与参数，但未在本文件中证明 `/cn` 前缀由何处挂载。 |
| `/{market}?q=<keyword>`（JSP 生成链接显示为 `/cn/{market}?q=...`） | annotation 未限定 method | `q`、`supplement`、`exactMatch`、`tracking`、`qid`、`token`、`export` | `SearchAsinController.java:98-108,130-132`; `search_keywords.jsp:194-200,255-257` | `UNRESOLVED`：同上；同一 dispatcher 按输入类型分流到另一结果视图。 |
| `/variation/{market}/{asin}` | annotation 未限定 method | path `market`、`asin` | `search.jsp:626-633`; `SearchAsinController.java:275-303` | 已确认旧 endpoint；本期真实产品/变体数据不接入。 |
| `/load-asin-info/{market}/{asin}` | annotation 未限定 method | path `market`、`asin` | `search.jsp:657-664,697-704`; `SearchAsinController.java:305-320` | 已确认旧 endpoint；本期真实产品信息不接入。 |
| `/keyword/stat/{market}?k=<keyword>` | GET（JSP AJAX） | path `market`、query `k` | `search.jsp:255-260,499-516`; `search_keywords.jsp:294-300,448-465`; `SearchAsinController.java:659-667` | 已确认旧 endpoint；趋势统计留在真实后端接入范围外。 |
| `/suggestions?station=<market>&keyword=<keyword>` | GET | `station`、`keyword` | `search_keywords.jsp:497-501`; `SearchAsinController.java:925-937` | 已确认；新站可由 Mock BFF 提供同类输入建议，不调用旧端点。 |
| `/me/query-log/history` 及批量隐藏动作 | GET / `UNRESOLVED` | 账号历史/选中项 | `base/history-asin.jsp:234-250,274-303`; `base/history-keywords.jsp:211-227,251-280` | `exclude`：账号历史属于真实身份/权益范围，Controller 未读取。 |

## Includes And Dependencies

| Dependency | Type | Resolved path | Purpose | Evidence |
|---|---|---|---|---|
| Tag library | local include | `...\jsp\cn\__frontend\base\taglib.jsp` | JSP/JSTL 与自定义标签基础；不迁移 | `search.jsp:2`; `search_keywords.jsp:2` |
| Language head | local include | `...\jsp\cn\__frontend\base\languages.jsp` | 旧站共享语言依赖；新站由集中 locale 注册表承担 | `search.jsp:8`; `search_keywords.jsp:8`; `languages.jsp:2` |
| Shared styles | local include | `...\jsp\cn\__frontend\base\styles.jsp` | 旧 JSP 样式加载；不迁移视觉 | `search.jsp:11`; `search_keywords.jsp:11` |
| Legacy header / language picker | local include | `...\base\header.jsp`; `...\base\header-language.jsp` | 旧全局导航；以新站 header 重写 | `search.jsp:88`; `header.jsp:23`; `search_keywords.jsp:85` |
| Message / extension shell | local include | `...\base\message.jsp`; `...\base\extension-plugin.jsp` | 旧消息与插件壳；不在核心工具 P2 范围 | `search.jsp:89,477`; `search_keywords.jsp:86,424` |
| Trend module | local include | `...\jsp\cn\__frontend\module-trend.jsp` | 关键词趋势弹层；真实趋势数据暂不接入 | `search.jsp:90`; `search_keywords.jsp:87`; `module-trend.jsp:160-219` |
| Legacy scripts | local include / static JS | `...\base\scripts.jsp`; `/assets-frontend/js/keywords/search-asin.js`; `/assets-frontend/js/keywords/search_keywords.js` | 旧 jQuery 行为入口；只作为端点/交互证据，不复制实现 | `search.jsp:476,485-486`; `search_keywords.jsp:423,436-437` |
| Footer / aside / go-to-top | local include | `...\base\footer.jsp`; `...\base\aside.jsp`; `...\base\go-to-top.jsp` | 旧站通用布局；不迁移 | `search.jsp:480-482`; `search_keywords.jsp:427,429-430` |
| Query history | local include | `...\base\history-asin.jsp`; `...\base\history-keywords.jsp` | 登录用户历史；本期 `exclude` | `search.jsp:483`; `search_keywords.jsp:433`; history AJAX 证据见 Route |
| Tourist / monthly / chart popups | local include | `...\base\tourist-filter-modal.jsp`; `...\base\module-popup-monthly.jsp`; `...\base\module-popup-chart.jsp` | 权限、月度/图表弹层；本期不接真实权限/数据 | `search.jsp:487-490`; `search_keywords.jsp:438` |

## SEO And Content Classification

| Element | Current value or source | Classification | Proposed new home | Evidence |
|---|---|---|---|---|
| 单一查询任务：站点 + `q`（ASIN 或关键词） | 下拉市场与搜索框，按输入类型分流 | `hardcode` | `ReverseAsinQuery`/工具表单；真实查询由现有 Mock adapter 边界承载 | `search.jsp:101-146`; `search_keywords.jsp:99-147`; `SearchAsinController.java:98-132` |
| 可选关键词条件 `supplement`、`exactMatch` | 当月关键词、词组匹配 checkbox | `hardcode` | 合并工具的“高级筛选”；仅在关键词模式可用 | `search_keywords.jsp:100-101,193-200`; `SearchAsinController.java:101-102,717-725` |
| 市场枚举 | US、JP、UK、DE、FR、IT、ES、CA、IN | `hardcode` | 集中市场常量；不把国旗图片作为页面素材迁移 | `search.jsp:121-140`; `search_keywords.jsp:121-140` |
| ASIN 反查结果 | 流量词、月搜索量、流量权重、产品/变体信息 | `hardcode` | 合并结果 DTO；当前只消费明确标识的 Mock 结果 | `search.jsp:218-330,376-405`; `SearchAsinController.java:275-320` |
| 关键词查询结果 | 关键词、趋势、旺季、月搜索量、商品数、月购买量、购买率 | `hardcode` | 合并结果 DTO；趋势与真实指标需真实后端批准后再启用 | `search_keywords.jsp:225-365`; `SearchAsinController.java:693-767` |
| 联想建议 | `/suggestions` 输入建议 | `hardcode` | Mock BFF 的输入建议；不访问旧服务 | `search_keywords.jsp:470-533`; `SearchAsinController.java:925-937` |
| 导出、购买报告、登录后全量、查询历史 | 权益、账户、价格与真实导出行为 | `exclude` | 不迁移；未来身份/权益域单独 P1 | `search.jsp:177-205,348-358`; `search_keywords.jsp:212-218,377-391`; `base/history-asin.jsp:234-303` |
| 结果页动态 title 与计数 | `${entity.asin}`、结果数量、产品标题 | `TBD-SEO` | 查询 `q` 页面强制 `noindex`；稳定工具入口另写原创 metadata，不复用动态 title | `search.jsp:9,164-173`; `search_keywords.jsp:9,166-173` |
| 高频词词云、视频图、背景图、国旗、Amazon 产品图 | 旧静态或第三方图片 URL | `UNRESOLVED` | 默认不迁移；新工具先用代码原生装饰与无版权风险的 UI，任何新媒体须单独记录来源/授权 | `search.jsp:95,115,391-394,440-467`; `search_keywords.jsp:93,115,282,397-415` |
| 旧站指向 `sellersprite.com` 的提示 | 外部导流文字与链接 | `exclude` | 如需 handoff，只使用现有集中 registry 中已批准的 `sellersprite.ai`，并重新写用途文案 | `search.jsp:154`; `search_keywords.jsp:155`; `Development_Process/DECISIONS.md` D-003 |

## Forms And Data Calls

| Trigger | Endpoint | Method | Purpose | Migration boundary | Evidence |
|---|---|---|---|---|---|
| 提交主搜索表单 | action 未声明；Controller dispatcher 匹配 `/{market}` | JSP 为 POST；Controller annotation 未限定 method | 按 `q` 判别 ASIN/关键词并返回不同 JSP | 新站统一为 `/cn/{market}?q=` 的任务状态；仅调用 Mock adapter，`q` 结果不伪装为生产数据 | `search.jsp:101-146`; `search_keywords.jsp:99-147`; `SearchAsinController.java:98-132` |
| 输入关键词 | `/suggestions` | GET | 输入建议 | 新站仅实现等价 Mock BFF/本地建议；不读旧服务 | `search_keywords.jsp:497-533`; `SearchAsinController.java:925-937` |
| 点击搜索量/统计 | `/keyword/stat/{market}?k=` | GET | 弹层展示关键词统计 | 当前 `exclude`；真实趋势/统计需要后端接入门 | `search.jsp:255-260,499-516`; `search_keywords.jsp:294-300,448-465`; `SearchAsinController.java:659-667` |
| 变体/产品信息懒加载 | `/variation/{market}/{asin}`；`/load-asin-info/{market}/{asin}` | 旧 jQuery 未声明；Controller annotation 未限定 method | 加载变体及产品信息 | 当前 `exclude`；不接旧后端，不搬运第三方产品图 | `search.jsp:626-704`; `SearchAsinController.java:275-320` |
| 复制关键词 | 浏览器剪贴板 | client-side | 将已可见关键词复制 | 可作为无后端的渐进增强；需避免复制锁定/未授权数据 | `search.jsp:442,586-590`; `search_keywords.jsp:656-665` |
| 导出 / 登录 / 升级 / 购买 / 历史 | 账号、支付、权益和导出端点 | mixed / `UNRESOLVED` | 真实身份和权益流 | `exclude`：不以 Mock 假装可用 | `search.jsp:177-205,348-358`; `search_keywords.jsp:212-218,377-391`; `base/history-keywords.jsp:211-280` |

## Index Candidate

| Candidate | Reason | P2 action | 信息架构建议（照搬 / 调整，理由） |
|---|---|---|---|
| 稳定工具入口 `/cn/{market}`（无 `q`） | 承接明确的“ASIN 反查/关键词研究工具”意图；页面有真实输入任务而非结果页复制品 | 仅确定一个主市场入口的 canonical/index 策略；其他市场入口的收录性与语言/地区策略须由 P2 明确 | 调整：两个旧 JSP 合并为一个以输入任务为中心的工具页，ASIN/关键词只决定同页结果视图，不再拆成两张结果页面。 |
| 带 `q` 的查询结果 | 高重复、用户特定、数据/权限依赖强，且旧动态 title 无稳定内容价值证据 | `IndexDecision=noindex`、不进 sitemap；canonical 回到稳定工具入口 | 调整：查询状态归入工具的动态 UI，而不是生成可收录的结果 URL 页面。 |
| 旧趋势/历史/购买/导出能力 | 依赖真实数据、身份或权益 | `exclude`，不迁移为索引候选 | 调整：功能边界保留为后续域任务，不把旧弹层和账户 UI 拼进新工具页。 |

## Risks And Blockers

- `UNRESOLVED`：Controller 仅证明 `/{market}` mapping；`/cn` locale 前缀的全局路由装配未在本 P1 读取范围内证明。P2 的 URL Map 须同时保留这一证据限制，不能假称已找到全局 mapping。
- `UNRESOLVED`：Amazon 产品图、旧背景/视频/国旗及旧可见文案没有授权或事实持续性证据，默认不迁移。
- `UNRESOLVED`：真实数据源、配额、会员解锁、导出与错误协议不得从 Controller 逻辑推断；当前只能接入已存在的 Mock adapter。
- 查询状态和市场变体易形成重复 URL；P2 必须把无 `q` 的稳定入口和有 `q` 的 `noindex` 查询状态分开。
- 当前主页链接只能指向已完成的工具入口，不能继续用“研究工作台”预览替代真实表单。

## P1 Exit Check

- [x] All local includes resolved or listed as `UNRESOLVED`.
- [x] Every route claim has Controller evidence or is `UNRESOLVED`.
- [x] Every SEO/content element has one classification.
- [x] Forms and client data calls have a migration boundary.
- [x] P1 progress snapshot is `completed`, or this P1 has no cross-session snapshot because it was completed in one pass.
- [x] Information-architecture advice was reverse-checked; if all candidates are `照搬`, `IA counterfactual` is recorded in Risks And Blockers.
- [x] No Next.js, Sanity schema, redirect or legacy-source change was made.
