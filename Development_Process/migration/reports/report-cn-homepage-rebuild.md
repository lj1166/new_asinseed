# P4 报告：cn 首页重构

日期：2026-07-28
范围：`cn-index` 的 P2/P3 与技术 P4；旧/新 URL 保持 `/cn` → `/cn`。

## 结果

首页已从旧 JSP 式“搜索框 + 能力/插件/视频 + 伙伴/评价”布局重构为简中 SaaS 品牌信任与研究方法入口。旧 DOM、旧文案、旧图片、旧伙伴/评价和旧博客外链均未进入新页面。

## 实现

- 新增 Sanity `homepageContent` 文档类型与 Zod `HomepageContentSchema`：运营可编辑 Hero 眉题、CTA 文案、三项场景、三步方法与结尾 CTA；H1/副标题仍唯一由 `homepageSeo` 管理，避免字段来源冲突。
- 新增 `homepageContent-zh-cn`、3 条 `homepageFaqEntry`，并把 `homepageSeo-zh-cn` 的验证用测试文案替换为正式 title、description、H1 和副标题。
- 前台改用 `getHomepageRebuildContent()` 的 Sanity-first 读取和安全原创 fallback；FAQ 只渲染真实 Sanity 条目，不再回退占位问答。
- 已发布内容直连 Sanity API，`/cn` 配置 ISR `revalidate = 60`，运营发布后的预期前台生效窗口为最多约 60 秒；不再受 CDN 额外传播时间影响。
- 仅在真实 FAQ 存在时输出 `FAQPage` JSON-LD；`Organization` 保留。未提供 OG 图时不虚构 `og:image`。
- 删除未使用的旧搜索框、伙伴、评价、视频、旧内容预览等首页组件，更新全局导航至实际存在的 `#scenarios` / `#how-it-works` 锚点。

## 运行时与回归证据

| 检查 | 结果 | 证据 |
|---|---|---|
| Sanity 文档写入与读取 | PASS | CLI 查询确认 `homepageContent-zh-cn`、`homepageSeo-zh-cn`、3 条 FAQ 已在 `3q1qrst9/production`。 |
| Studio schema 校验 | PASS | `pnpm exec sanity documents validate --yes --dataset production --level error`：8 份文档、0 error。 |
| 前台运行时消费 | PASS | HTTP `http://localhost:3000/cn` = 200，HTML 含正式 H1 与 `FAQPage`，不含旧“获取流量词”。 |
| Next + Studio 本地服务 | PASS | Next `localhost:3000` = 200；Studio `localhost:3333` = 200。 |
| TypeScript | PASS | `pnpm typecheck`。 |
| E2E / 路由 / SEO | PASS | `pnpm test:e2e`：9/9 通过，覆盖根重定向、单 H1/canonical、无 inactive hreflang、重构内容、390px 无横向溢出、inactive locale 404、sitemap 与 robots。 |
| 生产构建 | PASS | `pnpm build`：Studio 与 Next 均完成；`/cn` 显示 ISR 1 分钟。 |

## 未解决项

- [历史 P4 结论，已于 2026-07-29 修复] `homepageSeo-zh-cn.seo.ogImage` 为空曾导致缺少 1200×630 OG 图；现已由技术性品牌 fallback 覆盖，页面专属授权素材仍可由运营上传后优先使用。

## 2026-07-29 品牌与 SEO/GEO 复核增补

### 已完成的架构调整

- 将全站设计 token 的唯一主品牌色切换为 `#FF9200`；主 CTA、导航 CTA、focus ring、Hero 强调与关键图标均消费 token。深色 `brand-ink` 承担 Hero、解释卡和小字号内容，避免橙色小字在浅色背景上产生低对比度。
- 首页 metadata 在 Sanity `ogImageUrl` 为空时，使用 `/cn/opengraph-image` 技术性品牌 fallback。该图片只含稳定品牌和类别语言，不替代运营上传的页面专属素材；Sanity 图片一旦配置即优先。
- 首页 JSON-LD 从 `Organization` 扩展为稳定 `@id` 的 `Organization` + `WebSite.publisher` 实体关联；真实 FAQ 继续仅在页面可见时输出 `FAQPage`。
- 将“什么是 ASIN 反查？”改为可定位的语义 `h2` + 独立直接回答。它服务用户理解和生成式搜索的引用资格，不是对 AI 推荐的保证。

### 结论：不重排首页角色，调整其基础能力

首页作为品牌/说明/转化入口，不应被改造成承载所有长尾关键词的博客集合。当前 H1、三类使用场景、研究方法、直接回答和 FAQ 已构成合理的品牌入口结构；进一步把大量文章、日期、作者和长尾问题塞入首页会稀释主任务。后续应由工具结果页承接高意图查询，资源/博客页承接具体问题、方法论、第一手经验和可更新证据。

### 当前可验证状态

| 目标 | 结论 | 运行时证据 |
|---|---|---|
| 可抓取/可收录准备 | PASS（本地准备） | `/cn` 单一 H1、canonical 自指；Playwright 通过 sitemap、robots、inactive locale 与路由回归。实际 Google 收录需生产部署后在 Search Console 验证。 |
| 分享与抓取展示 | PASS（技术 fallback） | `og:image` 输出 `https://asinseed.com/cn/opengraph-image`；本地该路径 HTTP 200。 |
| 实体可理解性 | PASS | `Organization.@id` 与 `WebSite.publisher.@id` 一致；未配置可验证外部官方身份时不编造 `sameAs`。 |
| 可引用的页面解释 | PASS（入口页范围） | 可见 `h2` “什么是 ASIN 反查？”后提供独立两句定义；FAQ 与场景文本可见。 |
| 原创深度与权威证据 | PARTIAL | 未提供可公开核验的产品截图、客户证言、方法数据或作者资料；页面已避免虚构，待素材具备后再补入对应 Sanity 内容。 |
| 实际 AI 推荐/Google 排名 | UNRESOLVED | 这不能由本地测试证明；需生产站可访问、Search Console 验证、提交 sitemap 并观察真实 impressions/clicks 与 AI 功能报告。 |

### 经验修正

本次复核以 Google 官方的“针对 Google 搜索中的生成式 AI 功能优化网站”指南为准：生成式搜索依赖核心搜索排名和质量系统，重点是可抓取性、独特有用内容、清晰结构和体验；`llms.txt`、AI 专用标记、内容刻意分块或虚假提及不构成 Google AI 搜索的必要条件。相应规则已进入 D-018、主提示词与 `seo-scoring-standard.md`，不再把这些形式化信号当作阻塞项。

### 本轮验证

- `pnpm --filter web typecheck` — PASS
- `pnpm --filter web build` — PASS（`/[locale]/opengraph-image` 已编译）
- `pnpm test:e2e -- --workers=1 --reporter=list` — PASS，10/10；包含 OG fallback HTTP 200、实体 JSON-LD 关联、单一 H1/canonical、移动 390px 与 sitemap/robots 回归。
- 浏览器桌面审查（2026-07-29，1280px 宽）：`--primary = 34 100% 50%`，Hero/CTA 显示橙色主品牌层级，未见横向溢出。
- 客户评价、伙伴 Logo、量化数据与产品截图尚无可公开核验素材，因此新首页刻意不展示这些模块；它们不是页面实施阻塞项。
- 本报告的移动验收是 Playwright 的 390px 可见性与无溢出验证；如要作最终设计签收，可由负责人在浏览器进行主观视觉审阅，但不影响已通过的技术验收。
