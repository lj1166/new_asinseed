# 状态

## 现状

- **P0 SEO 运营闭环已完成并通过运行时验证（2026-07-27，2026-07-28 语言底座修正）**：Sanity schema（seoObject/siteSettings/homepageSeo/contentEntry seo+noindex）、Zod contracts、前端 getHomepageSeo/getSiteSettings + page.tsx generateMetadata() 全部落地。当前仅简中 `cn` 入口启用，并正确读取 Sanity `zh-cn` 文档；既有英文文档保留在数据集中但不再被路由、Studio 下拉或 sitemap 提前暴露。
  - **发现并修复一个致命回归**：`apps/web/lib/sanity-client.ts` 的 `getSanityClient()` 读取的是 `SANITY_PROJECT_ID`/`SANITY_DATASET`，但 `.env.local` 实际定义的是 `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET`——命名不一致导致该函数永远返回 `null`，SEO 与 FAQ/testimonials 的 Sanity 读取全部静默走代码兜底，此前"已完成"的说法实际从未在运行时验证过。已修复变量名并同步修正 `.env.local.example`。
  - **P4 运行时验证（真实执行，非纸面）**：当前 `/cn` 的 `document.title`/`<meta name="description">`/`<link rel="canonical">`/`og:site_name` 均确认来自已发布的 `homepageSeo-zh-cn` 文档（非代码兜底文案）；可见 H1/副标题也确认读取该文档。此前英文验证为历史证据，待简中页面验收后再按语言逐个恢复。
  - FAQ/testimonials（`homepage-data.ts`）共享同一个已修复的 `getSanityClient()`；当前 Sanity 中尚无 `homepageFaqEntry`/`homepageTestimonialEntry` 文档（count=0），因此仍正确走代码 seed 兜底——这是预期行为，非缺陷。
  - **待人工操作**：提供 og:image 素材（当前 `ogImageUrl` 为空，前端按设计省略 `og:image` 标签，不报错）。
- 轨A：批次 0 已完成全站页面组合轻扫描（`mappings/page-map.md`）：77 个前台 JSP + 1 个优惠活动 JSP 被归并为页面组，49 个后台 JSP 已列 `exclude`；已形成候选页面组合与批次 1～5。`index.jsp` 已完成技术 P1→P4，且 `cn-index/rebuild-brief.md` 已在用户授权下进入重构实施；下一步先完成简中首页 P2/P3/P4，再继续合并处理的 `search.jsp` / `search_keywords.jsp` 工具流。Stage 2 尚未解锁。
- 质量基线：历史 `/en` 63/100、`/zh-cn` 59/100 已不再代表当前 URL 契约；`/cn` 路由、canonical、sitemap、robots 与 inactive locale 404 已由 e2e/HTTP 验证。og:image 缺失仍是 Layer C FAIL；首页整体内容/信息架构须在新 `rebuild-brief.md` 获确认后重新审计。
- 轨B：人工文章发布与后续自动化仍暂停；解锁条件和待办见 `backlog-track-b.md`。
- Presentation：本地 Viewer 环境变量已配置；`http://localhost:3000` CORS credentials 尚未确认，因此 Visual Editing 尚未实施。

## 下一步

1. **[可选]** 在 Studio 上传 1200×630 og:image 素材至 `homepageSeo-zh-cn`，清零当前简中首页的 og:image Layer C FAIL。
2. **[可选]** 在 `apps/web/.env.local` 确认 `NEXT_PUBLIC_SITE_URL=https://asinseed.com`（当前代码有 fallback，可先跳过）。
3. 按 `migration/inventory/cn-index/rebuild-brief.md` 直接完成首页 P2/P3/P4：以新 SaaS 品牌信任/转化入口重写信息架构、补齐可消费的运营内容模型，移除旧 JSP 式文案/素材/外链；未证实事实只限制相应主张。完成后执行合并 `search.jsp` / `search_keywords.jsp` 的 P1 与 Brief。
4. [独立] 用户完成 CORS credentials 后，接入并验收 Sanity Presentation / Visual Editing。

## 阻塞项

- **og:image**：需用户在 Studio 上传 1200×630 素材至 `homepageSeo-zh-cn`，否则 og:image Layer C FAIL 不清零。
- **首页重构内容输入**：页面实施已获用户授权；可公开核验的客户背书、Logo、量化数据和新视觉素材尚未提供，因此必须省略这些未证实主张或使用原创无承诺内容，不能回退搬用旧素材。
- **Presentation**：需在 Sanity 项目 CORS 中加入 `http://localhost:3000` 并启用 Allow credentials。
- **Stage 2 / Track B**：og:image 缺失是未解决 Layer C FAIL；其余 JSON-LD/metadata 问题已有 Sanity 来源，待 Studio 内容完善后可重新审计。

## 近期变更记录

> 更早记录：`archive/STATE-changelog-2026-07.md`。每条不超过 5 行；超过 5 条时先迁入当月 archive，再追加新记录。

- 2026-07-28：沉淀 D-012：建立经验升级路由；将内容 SEO/GEO MVP 按“同批字段+消费+验证”分流进 Track B backlog，避免为暂停的文章链路预建伪配置。
- 2026-07-28：沉淀 D-013：首次页面重构/改变页面角色、IA 或 CMS 模型时，P1 后先提交 `rebuild-brief.md` 并等待确认；补入事实/创作内容边界、现代 SaaS 页面角色和 Chrome 实页体验审查，避免旧 JSP 结构与文案重新成为默认模板。
- 2026-07-28：完成 D-014 批次 0 全站轻扫描：77 个前台 JSP、1 个优惠活动 JSP 和 49 个后台 JSP 按业务/功能/页面角色归并；页面地图给出新站候选组合与批次 1～5，未读取全量 include/Controller，也未创建页面或 Schema。
- 2026-07-28：完成 D-015 中文优先语言底座：共享语言注册表仅启用 `/cn`，根路径/导航/Studio/sitemap/canonical 全部收敛；`/en`、`/zh-cn` 等 inactive 路径 404，Playwright 7/7、桌面/移动实页与 Studio HTTP 200 已验证。搜索/插件/帮助入口不再跳往未迁移 404。
- 2026-07-28：沉淀 D-016：当用户/负责人已明确新 SaaS 重构、引流获客转化、SEO/GEO 与运营目标时，Brief 是设计记录而非默认停工门；首页已获得 P2/P3 实施授权，未证实事实只限制对应主张。

## 尝试与失败记录

- 2026-07-27：只读 `sanity cors list` 因本机 Sanity CLI 未登录而无法确认 CORS；改由用户在 Sanity 管理后台配置并确认。
- 2026-07-27：会话末尾 `AskUserQuestion` 工具内部错误（`[Tool result missing due to internal error]`），4 个前置决策问题未能获得答案；已转存阻塞项，下次会话开始时直接向用户确认。
