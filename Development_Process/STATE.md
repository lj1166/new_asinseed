# 状态

## 现状

- **P0 SEO 运营闭环已完成并通过运行时验证（2026-07-27，2026-07-28 语言底座修正）**：Sanity schema（seoObject/siteSettings/homepageSeo/contentEntry seo+noindex）、Zod contracts、前端 getHomepageSeo/getSiteSettings + page.tsx generateMetadata() 全部落地。当前仅简中 `cn` 入口启用，并正确读取 Sanity `zh-cn` 文档；既有英文文档保留在数据集中但不再被路由、Studio 下拉或 sitemap 提前暴露。
  - **发现并修复一个致命回归**：`apps/web/lib/sanity-client.ts` 的 `getSanityClient()` 读取的是 `SANITY_PROJECT_ID`/`SANITY_DATASET`，但 `.env.local` 实际定义的是 `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET`——命名不一致导致该函数永远返回 `null`，SEO 与 FAQ/testimonials 的 Sanity 读取全部静默走代码兜底，此前"已完成"的说法实际从未在运行时验证过。已修复变量名并同步修正 `.env.local.example`。
  - **P4 运行时验证（真实执行，非纸面）**：当前 `/cn` 的 `document.title`/`<meta name="description">`/`<link rel="canonical">`/`og:site_name` 均确认来自已发布的 `homepageSeo-zh-cn` 文档（非代码兜底文案）；可见 H1/副标题也确认读取该文档。此前英文验证为历史证据，待简中页面验收后再按语言逐个恢复。
  - 首页重构已新增并发布 `homepageContent-zh-cn` 与 3 条 `homepageFaqEntry`；场景/方法/CTA、首屏“研究工作台”与 FAQ 均由 Sanity 消费。首页现以暖色编辑式 Hero、可点击关键词信号画布、非对称场景叙事和可切换研究路径承载产品体验；交互只解释研究方法且明确不展示真实查询结果。FAQ 不再使用占位 seed，且在真实 FAQ 存在时输出 `FAQPage` JSON-LD。客户评价仍无可核验条目，前台不展示该模块。
  - **运营可选操作**：可在 Studio 为 `homepageSeo-zh-cn` 上传 1200×630 页面专属 OG 图；未上传时前端使用已验证的 `#FF9200` 品牌 fallback，不再缺少 `og:image`。
- 轨A：批次 0 已完成全站页面组合轻扫描（`mappings/page-map.md`）：77 个前台 JSP + 1 个优惠活动 JSP 被归并为页面组，49 个后台 JSP 已列 `exclude`；已形成候选页面组合与批次 1～5。`cn-index` 重构 P2/P3 与技术 P4 已完成，详见 `migration/reports/report-cn-homepage-rebuild.md`；下一步执行合并 `search.jsp` / `search_keywords.jsp` 的工具流 P1 与 Brief。Stage 2 尚未解锁。
- 质量基线：历史 `/en` 63/100、`/zh-cn` 59/100 已不再代表当前 URL 契约；`/cn` 路由、canonical、sitemap、robots、FAQPage、`Organization`↔`WebSite` 实体关联、OG fallback 与 inactive locale 404 已由 e2e/HTTP 验证。首页的品牌/说明/转化角色已完成，实际收录与 AI 展示仍须在生产 Search Console 观察。
- 轨B：人工文章发布与后续自动化仍暂停；解锁条件和待办见 `backlog-track-b.md`。
- Presentation：本地 Viewer 环境变量已配置；`http://localhost:3000` CORS credentials 尚未确认，因此 Visual Editing 尚未实施。

## 下一步

1. 按 `mappings/page-map.md` 执行合并 `search.jsp` / `search_keywords.jsp` 的 P1 inventory 与 Brief：保留已证实的用户任务/字段/URL，重构为真实的工具承接页，不复刻旧结果页布局。
2. **[可选]** 在 Studio 为 `homepageSeo-zh-cn` 上传经过授权的 1200×630 页面专属 OG 图；它会自动覆盖技术性品牌 fallback。
3. **[生产上线后]** 验证域名、提交 `/sitemap.xml` 至 Search Console，并用索引状态、真实查询 impressions/clicks 与生成式 AI 效果报告评估实际发现/引用表现。
4. [独立] 用户完成 CORS credentials 后，接入并验收 Sanity Presentation / Visual Editing。

## 阻塞项

- **首页可信度扩展素材**：可公开核验的客户背书、Logo、量化数据和产品截图尚未提供；当前首页已省略这些未证实主张，后续补充时不得回退搬用旧素材。
- **Presentation**：需在 Sanity 项目 CORS 中加入 `http://localhost:3000` 并启用 Allow credentials。
- **实际收录与 AI 展示**：本地测试只能证明技术资格，不能证明 Google 已收录或 AI 已引用；需生产域名可访问并在 Search Console 获得真实数据。

## 近期变更记录

> 更早记录：`archive/STATE-changelog-2026-07.md`。每条不超过 5 行；超过 5 条时先迁入当月 archive，再追加新记录。

- 2026-07-28：沉淀 D-016：当用户/负责人已明确新 SaaS 重构、引流获客转化、SEO/GEO 与运营目标时，Brief 是设计记录而非默认停工门；首页已获得 P2/P3 实施授权，未证实事实只限制对应主张。
- 2026-07-28：完成 `cn-index` 重构 P2/P3/技术 P4：新增并发布首页运营内容与 FAQ，正式替换 Sanity 测试 metadata/H1，移除旧 JSP 式搜索/评价/伙伴/视频/外链布局；`pnpm build`、typecheck 与 Playwright 9/9 通过，唯一 Layer C FAIL 为缺 OG 图。
- 2026-07-29：完成品牌与 SEO/GEO 复核：主色统一为 `#FF9200`，新增品牌 OG fallback、`Organization`↔`WebSite` 关系和可定位直接回答；校正 GEO 规则，取消将 `llms.txt`/专用 AI bot 规则作为硬门槛。typecheck、build、Playwright 10/10 与桌面实页审查通过。
- 2026-07-29：首页升级为“研究工作台”视觉：Sanity `homepageContent` 增加分组和 5 个工作台字段，前台以不伪造工具结果的任务预览替换静态路径卡；兼容已发布旧内容的 fallback merge。typecheck、build、Playwright 10/10、桌面与 390px 实页均通过；本地 Next `:3000`、Studio `:3333` 均返回 200。
- 2026-07-29：将首页从静态卡片组合重构为交互式产品体验：关键词信号画布与研究路径均可点击切换状态，场景采用非对称叙事；固化 D-019，禁止再以“Hero + 平铺卡片 + FAQ + CTA”代替工具型 SaaS 体验。typecheck、build 与 Playwright 10/10 通过。

## 尝试与失败记录

- 2026-07-27：只读 `sanity cors list` 因本机 Sanity CLI 未登录而无法确认 CORS；改由用户在 Sanity 管理后台配置并确认。
- 2026-07-27：会话末尾 `AskUserQuestion` 工具内部错误（`[Tool result missing due to internal error]`），4 个前置决策问题未能获得答案；已转存阻塞项，下次会话开始时直接向用户确认。
