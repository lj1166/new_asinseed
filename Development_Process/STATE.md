# 状态

## 现状

- **P0 SEO 运营闭环已完成并通过运行时验证（2026-07-27）**：Sanity schema（seoObject/siteSettings/homepageSeo/contentEntry seo+noindex）、Zod contracts、前端 getHomepageSeo/getSiteSettings + page.tsx generateMetadata() 全部落地。三个 Sanity 文档已 seed 并发布（siteSettings、homepageSeo-en、homepageSeo-zh-cn）。
  - **发现并修复一个致命回归**：`apps/web/lib/sanity-client.ts` 的 `getSanityClient()` 读取的是 `SANITY_PROJECT_ID`/`SANITY_DATASET`，但 `.env.local` 实际定义的是 `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET`——命名不一致导致该函数永远返回 `null`，SEO 与 FAQ/testimonials 的 Sanity 读取全部静默走代码兜底，此前"已完成"的说法实际从未在运行时验证过。已修复变量名并同步修正 `.env.local.example`。
  - **P4 运行时验证（真实执行，非纸面）**：`/en`、`/zh-cn` 页面的 `document.title`/`<meta name="description">`/`<link rel="canonical">`/`og:site_name` 均已确认来自已发布的 Sanity 文档内容（非旧的代码兜底文案）。并完成"编辑已发布文档 → 前端 HTML 同步变化"闭环测试：通过 API 将 `homepageSeo-en` 的 title patch 为测试值，刷新页面确认标题变化（Sanity CDN 传播延迟约 20-90 秒），再 patch 回原值并确认还原——证明闭环是活的，不是一次性初始读取。
  - FAQ/testimonials（`homepage-data.ts`）共享同一个已修复的 `getSanityClient()`；当前 Sanity 中尚无 `homepageFaqEntry`/`homepageTestimonialEntry` 文档（count=0），因此仍正确走代码 seed 兜底——这是预期行为，非缺陷。
  - **待人工操作**：提供 og:image 素材（当前 `ogImageUrl` 为空，前端按设计省略 `og:image` 标签，不报错）。
- 轨A：`index.jsp` 已完成 P1→P4；下一试点是合并处理的 `search.jsp` / `search_keywords.jsx`（SEO P0 已清零，可开始 search 试点）。Stage 2 尚未解锁。
- 质量基线：`/en` SEO 审计 63/100、`/zh-cn` 59/100（修复前基线）。`sitemap.xml`、`robots.txt` 已修复为 200 并由 e2e 覆盖；og:image 缺失仍是 Layer C FAIL，其余 JSON-LD/metadata 质量问题已有 Sanity 来源可修复。证据见 `migration/reports/report-seo-score-*.md`。
- 轨B：人工文章发布与后续自动化仍暂停；解锁条件和待办见 `backlog-track-b.md`。
- Presentation：本地 Viewer 环境变量已配置；`http://localhost:3000` CORS credentials 尚未确认，因此 Visual Editing 尚未实施。

## 下一步

1. **[可选]** 在 Studio 上传 1200×630 og:image 素材至 `homepageSeo-en` / `homepageSeo-zh-cn`，清零 og:image Layer C FAIL。
2. **[可选]** 在 `apps/web/.env.local` 确认 `NEXT_PUBLIC_SITE_URL=https://asinseed.com`（当前代码有 fallback，可先跳过）。
3. 执行 `search.jsp` / `search_keywords.jsx` P1 inventory；完成后先提交页面角色驱动的 `rebuild-brief.md` 获确认，再进入 P2/P3（SEO P0 已解除阻塞，P4 运行时验证已通过）。
4. [独立] 用户完成 CORS credentials 后，接入并验收 Sanity Presentation / Visual Editing。

## 阻塞项

- **og:image**：需用户在 Studio 上传 1200×630 素材至 `homepageSeo-en`/`homepageSeo-zh-cn`，否则 og:image Layer C FAIL 不清零。
- **Presentation**：需在 Sanity 项目 CORS 中加入 `http://localhost:3000` 并启用 Allow credentials。
- **Stage 2 / Track B**：og:image 缺失是未解决 Layer C FAIL；其余 JSON-LD/metadata 问题已有 Sanity 来源，待 Studio 内容完善后可重新审计。

## 近期变更记录

> 更早记录：`archive/STATE-changelog-2026-07.md`。每条不超过 5 行；超过 5 条时先迁入当月 archive，再追加新记录。

- 2026-07-28：首页试点补齐运营可编辑 Hero：`homepageSeo.heroHeading`/`heroSubheading` 现直接覆盖可见 H1/副标题，留空时回退 locale 代码文案。`pnpm typecheck` 通过；`curl localhost:3000/zh-cn` 实测返回已发布 Sanity 测试文案。
- 2026-07-28：沉淀 D-010：P2 必须为每个 Studio 字段定义“来源→消费位置→fallback”；P4 分别验证 `<head>` metadata 与可见运营文案，禁止保留未被前台消费的伪配置。
- 2026-07-28：沉淀 D-011：JSP 仅作字段/数据源/用户任务的证据，禁止将旧 DOM、文案、图片和视觉设计作为新站迁移目标；新页面按新契约、SEO/GEO 与运营需求重建。
- 2026-07-28：沉淀 D-012：建立经验升级路由；将内容 SEO/GEO MVP 按“同批字段+消费+验证”分流进 Track B backlog，避免为暂停的文章链路预建伪配置。
- 2026-07-28：沉淀 D-013：首次页面重构/改变页面角色、IA 或 CMS 模型时，P1 后先提交 `rebuild-brief.md` 并等待确认；补入事实/创作内容边界、现代 SaaS 页面角色和 Chrome 实页体验审查，避免旧 JSP 结构与文案重新成为默认模板。

## 尝试与失败记录

- 2026-07-27：只读 `sanity cors list` 因本机 Sanity CLI 未登录而无法确认 CORS；改由用户在 Sanity 管理后台配置并确认。
- 2026-07-27：会话末尾 `AskUserQuestion` 工具内部错误（`[Tool result missing due to internal error]`），4 个前置决策问题未能获得答案；已转存阻塞项，下次会话开始时直接向用户确认。
