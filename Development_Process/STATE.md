# 状态

## 现状

- P0 缺陷已识别（本会话）：首页 SEO metadata 无 Sanity 可编辑来源；12 步修复计划已草拟，但 4 个前置决策问题尚未回答（见阻塞项），实现尚未启动。
- 轨A：`index.jsp` 已完成 P1→P4；下一试点是合并处理的 `search.jsp` / `search_keywords.jsp`（P0 修复优先，search 试点之后）。Stage 2 尚未解锁。
- 质量基线：`/en` SEO 审计 63/100、`/zh-cn` 59/100（修复前基线）。`sitemap.xml`、`robots.txt` 已修复为 200 并由 e2e 覆盖；JSON-LD、OG 图和元数据质量等 Layer C FAIL 仍未清零。证据见 `migration/reports/report-seo-score-*.md`。
- 轨B：人工文章发布与后续自动化仍暂停；解锁条件和待办见 `backlog-track-b.md`。
- Presentation：本地 Viewer 环境变量已配置；`http://localhost:3000` CORS credentials 尚未确认，因此 Visual Editing 尚未实施。

## 下一步

1. **[P0-立即]** 回答下方阻塞项中的 4 个架构决策问题，然后启动 SEO Sanity 闭环 12 步实现计划（详见阻塞项说明）。
2. 12 步计划概要（顺序执行）：
   - [Sanity schema] `seoMetadata` 共享对象类型 → `siteSettings` singleton 文档类型 → `homepageSeo` 每 locale 文档类型 → `contentEntry` 添加 `seo{}` 字段（视决策③）
   - [contracts] `packages/contracts/src/homepage.ts` 新增 Zod schema
   - [前端] `apps/web/lib/homepage-seo.ts`（含 fallback 到 DTO） → `apps/web/app/[locale]/page.tsx` `generateMetadata()` 改写（绝对 canonical、og:image、JSON-LD Organization） → `apps/web/app/[locale]/layout.tsx` 去掉静态 metadata override
   - [数据] 用 Sanity MCP 创建 `siteSettings`、`homepageSeo`（en + zh-cn）初始文档，满足 ≥120 chars description 等硬性下限
   - [规则] 主提示词 P2/P4 规则更新（视决策④）+ P4 新增 Studio→HTML 传播验证步骤
3. P0 完成后：执行 `search.jsp` / `search_keywords.jsp` P1 inventory。
4. [独立] 用户完成 CORS credentials 后，接入并验收 Sanity Presentation / Visual Editing。

## 阻塞项

**[P0 实现前置决策 — 下一会话开始时回答]**

① **og:image 素材来源**（`metadata-asset-constraints.md` §3 边界：AI 生成需先获批准）：
   - 选 A：现在用 Sanity `generate_image` 生成一张显式标注 `placeholder` 的 1200×630 占位图，先满足"og:image 不得完全缺失"，后续替换真实素材
   - 选 B：只接字段/渲染逻辑，Studio 里暂留空；og:image 继续缺失直到用户手动上传
   - 选 C：用户自提供已有品牌图片路径，直接用作初始 og:image

② **生产域名**（用于 canonical/hreflang/og:url/metadataBase）：
   - 选 A：`https://www.asinseed.com`（旧站链接出现过，确认这是目标生产域名）
   - 选 B：先用显式占位域名并在代码注释标注"待替换"

③ **`contentEntry` seo{} 字段**：
   - 选 A：本次顺手加（只是 schema 定义，不影响轨B暂停状态）
   - 选 B：只改首页相关 schema，contentEntry 的 seo 字段留到轨B解锁时

④ **主提示词更新范围**（`D:\asinseed重构\prd-docs\prompts\00_migration_loop_master_prompt.txt`）：
   - 选 A：本次同步更新（§铁则3/§2.3.1 加"index 页必须有可编辑 Sanity SEO 来源"硬规则）
   - 选 B：只改仓库内 `Development_Process/migration/metadata-asset-constraints.md`，prd-docs 由用户另行同步

**其他阻塞项：**
- Presentation：需在 Sanity 项目 CORS 中加入 `http://localhost:3000` 并启用 Allow credentials。
- Stage 2 / Track B：当前技术 SEO/GEO 审计仍有未解决 JSON-LD、OG 图和 metadata 质量 FAIL；详情见两份评分报告和 `backlog-track-b.md`。

## 近期变更记录

> 更早记录：`archive/STATE-changelog-2026-07.md`。每条不超过 5 行；超过 5 条时先迁入当月 archive，再追加新记录。

- 2026-07-27：[P0 识别·交接] 用户发现首页 SEO 无 Sanity 可编辑来源，完成根因分析；12 步修复计划草拟完毕，4 个前置决策问题已记录在阻塞项。因上下文耗尽触发交接，实现尚未启动，工作树无脏文件。
- 2026-07-27：本地 Visual Editing 的 Viewer Token 已仅写入被 Git 忽略的 `apps/web/.env.local`；此前未配置 Sanity Developer Token。CORS credentials 尚未确认。
- 2026-07-27：本地服务已启动：Studio `localhost:3333`、Next.js `localhost:3000/en` 均返回 HTTP 200。
- 2026-07-27：完成 Agent-Loop P0/P1：归档热状态、建立 Track B backlog；主提示词改为运行时版本，落地三层验收/Evidence Protocol，并标注缺陷报告实施状态。`pnpm typecheck` 与 3 条首页 Playwright 验收均通过。
- 2026-07-27：完成 P2 首项技术修复：新增 Next.js `sitemap.ts`/`robots.ts`，阻止 `[locale]` 将 `.xml/.txt` 误作 locale 而 500。sitemap 仅列 P2 已批准的 `/en`、`/zh-cn`；`pnpm typecheck` 和 5 条 Playwright 验收通过。

## 尝试与失败记录

- 2026-07-27：只读 `sanity cors list` 因本机 Sanity CLI 未登录而无法确认 CORS；改由用户在 Sanity 管理后台配置并确认。
- 2026-07-27：会话末尾 `AskUserQuestion` 工具内部错误（`[Tool result missing due to internal error]`），4 个前置决策问题未能获得答案；已转存阻塞项，下次会话开始时直接向用户确认。
