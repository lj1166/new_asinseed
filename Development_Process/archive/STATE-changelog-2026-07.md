# STATE 历史变更记录：2026-07

> 由 D-007 于 2026-07-27 从 `STATE.md` 迁入。`STATE.md` 仅保留当前快照和最近五条记录；本文件是冷记忆，不作为会话必读材料。

## 2026-07-27

- 2026-07-28：完成 D-014 批次 0 全站轻扫描：77 个前台 JSP、1 个优惠活动 JSP 和 49 个后台 JSP 按业务/功能/页面角色归并；页面地图给出新站候选组合与批次 1～5，未读取全量 include/Controller，也未创建页面或 Schema。（自 `STATE.md` 近期记录归档，2026-07-29）

- 2026-07-28：沉淀 D-013：首次页面重构/改变页面角色、IA 或 CMS 模型时，P1 后先提交 `rebuild-brief.md` 并等待确认；补入事实/创作内容边界、现代 SaaS 页面角色和 Chrome 实页体验审查，避免旧 JSP 结构与文案重新成为默认模板。（自 `STATE.md` 近期记录归档，2026-07-29）

- 2026-07-28：沉淀 D-011：JSP 仅作字段/数据源/用户任务的证据，禁止将旧 DOM、文案、图片和视觉设计作为新站迁移目标；新页面按新契约、SEO/GEO 与运营需求重建。
- 2026-07-28：沉淀 D-012：建立经验升级路由；将内容 SEO/GEO MVP 按“同批字段+消费+验证”分流进 Track B backlog，避免为暂停的文章链路预建伪配置。

- 沉淀 D-010：P2 必须为每个 Studio 字段定义“来源→消费位置→fallback”；P4 分别验证 `<head>` metadata 与可见运营文案，禁止保留未被前台消费的伪配置。（自 `STATE.md` 近期记录归档，2026-07-28）
- 首页试点补齐运营可编辑 Hero：`homepageSeo.heroHeading`/`heroSubheading` 现直接覆盖可见 H1/副标题，留空时回退 locale 代码文案；`pnpm typecheck` 与本地 Sanity 发布内容读取验证通过。（自 `STATE.md` 近期记录归档，2026-07-28）
- P0 SEO 运营闭环完成并经运行时验证：Sanity schema、Zod contracts、前台 metadata 与已发布文档更新闭环均已落地；发现并修复 `sanity-client.ts` 环境变量命名不一致导致的静默代码兜底。详情以随后 STATE 现状为准。（自 `STATE.md` 近期记录归档，2026-07-28）
- 补齐真实后端接入门（D-009）：只有人工批准后才可由模板创建 `legacy-contract-report.md`；未知接口不得实现。并将 `ContentEntry.body` 的 Zod `string`/Studio Portable Text 不一致列为 Track B 人工发布闭环的首项，未新增真实 API、认证或高可用设计。（自 `STATE.md` 近期记录归档，2026-07-28）
- 主提示词补强：仅对已有证据的 `exclude` 页面允许跳过 P1→P4，并要求 P4 FAIL 记录 Failure trace（层级、证据、原因、回退阶段、复验命令）。（自 `STATE.md` 近期记录归档，2026-07-28）
- 基于 Claude Code 对话式约束完成 D-008 最小优化：P1 跨会话快照 `.p1-progress.md` 与全“照搬”IA counterfactual 已写入既有 skill/主提示词；未新增 hooks、脚本、依赖或 Markdown 解析器。（自 `STATE.md` 近期记录归档，2026-07-28）
- 完成 P2 首项技术修复：新增 Next.js `sitemap.ts`/`robots.ts`，阻止 `[locale]` 将 `.xml/.txt` 误作 locale 而 500。sitemap 仅列 P2 已批准的 `/en`、`/zh-cn`；`pnpm typecheck` 和 5 条 Playwright 验收通过。（自 `STATE.md` 近期记录归档，2026-07-28）
- 补齐试点页 SEO 运营闭环（P0 缺陷全部落地）。Sanity schema/Zod contracts/`sanity-seo.ts`/`page.tsx generateMetadata()` 完成；三个 Sanity draft 文档已 seed；主提示词 Layer A/P2/P4 升级为硬规则。后续运行时验证及发布状态以 STATE 现状为准。（自 `STATE.md` 近期记录归档，2026-07-28）
- 本地服务已启动：Studio `localhost:3333`、Next.js `localhost:3000/en` 均返回 HTTP 200。（自 `STATE.md` 近期记录归档，2026-07-28）
- 完成 Agent-Loop P0/P1：归档热状态、建立 Track B backlog；主提示词改为运行时版本，落地三层验收/Evidence Protocol，并标注缺陷报告实施状态。`pnpm typecheck` 与 3 条首页 Playwright 验收均通过。（自 `STATE.md` 近期记录归档，2026-07-28）
- 本地 Visual Editing 的 Viewer Token 已仅写入被 Git 忽略的 `apps/web/.env.local`；此前未配置 Sanity Developer Token。`http://localhost:3000` 的 CORS credentials 尚未确认。（迁自 STATE.md 近期记录，2026-07-27 归档）
- [P0 识别·交接] 用户发现首页 SEO 无 Sanity 可编辑来源，完成根因分析；12 步修复计划草拟完毕，4 个前置决策问题已记录在后续 STATE 的阻塞项。因上下文耗尽触发交接，实现尚未启动。
- 完成 Sanity MCP 官方文档调研；MCP 不参与当前 Presentation，Presentation 使用 web 端 Viewer Token。未配置 Developer Token 或 MCP 客户端。（迁自 STATE.md 近期记录，2026-07-27 归档）
- 用户提供《ASINSeed Agent-Loop 完整缺陷总结与架构优化指南》并要求按影响排序执行。对照确认的高优先级问题是：STATE 热记忆膨胀、AGENTS 开篇阶段过期、主提示词仍含已完成的 Stage 0 搭建指令、验证取证规则与首页 e2e 基线缺失；P1 的“信息架构建议”栏位已在现有 skill 中实施，无需重复建设。
- 用户要求按 Sanity 官方 Next.js App Router Visual Editing 文档接入 Presentation（P0+P1），并明确缺 token/CORS 时不得硬做。已完成只读预检与官方文档核对：当前 `next-sanity` 为 9.12.3（官方当前 Visual Editing 指引要求 13.1.5+），`apps/web/.env.local` 当时不存在；只读 `sanity cors list` 也因 CLI 未登录而无法确认 `http://localhost:3000` 是否已启用 credentials。未修改依赖、代码、CORS 或云端配置。
- 按官方能力复核人工文章发布草案：可落地且无需另建后端；草案新增 Studio 配置档/字典、官方文档级国际化、Next.js 前台和两篇测试文章的实施顺序。未安装插件、未改代码。
- 用户将博客工作流收敛为“先打通人工创建、审核、发布与前台收录”，删除此前 Gateway/Worker/队列/重试等超前设计；草案随后补充运营可维护的 `EditorialProfile` 下拉配置和双语文章关联方案。均为 Draft，未实现 schema 或 Studio 功能。
- 完成内容自动化模型接入调研：建议生产链路使用服务端 Gateway + 正式模型 API，Codex/Claude Code 仅作工程辅助，Sanity 为 CMS/审核/发布事实来源；用户随后明确当前不需要生产级设计，相关建议降为未来可选项。

## 2026-07-26

- 完成 `/en`、`/zh-cn` SEO 技术审计：分别为 63/100、59/100。证据来自浏览器/网络实测；发现 sitemap/robots 500、无 JSON-LD、缺 OG 图、标题重复和 description 过短等 FAIL，并修复 `/zh-cn` 五处 `/cn/` 内链前缀。详见 `migration/reports/report-seo-score-en.md`、`report-seo-score-zh-cn.md`。
- 基于审计产出 `migration/reports/report-agent-system-gaps.md`；形成 GEO、信息架构、元数据约束、Track B 暂停期任务、视觉锚点和 sitemap/robots/CTA 六项演进提案。
- 将 Track B 恢复门槛收紧为“页面 P4 通过且 SEO/GEO 审计无未解决 FAIL”；具体暂停任务已迁入 `../backlog-track-b.md`。

## 2026-07-24

- 完成 `index.jsp` P1→P4：P4 十项验收器为 8 PASS / 2 N/A / 1 已披露 FAQ 占位风险；详细证据见 `migration/reports/report-pilot-index.md`。Stage 2 仍须等待合并后的 `search.jsp` 试点完成。
- 完成首页 UI 基础设施和六段信息架构：设计 token、布局原语、站点 Header/Footer/MobileNav、能力/内容/方法论区块和 locale metadata。验证：typecheck、build、Vitest 通过；当时 e2e 有一个旧占位断言失败，后续由 D-007 后的验证基线任务处理。
- 完成 `index.jsp` P2：Homepage contract、Sanity FAQ/Testimonial schema、`migration/url-map.md` 和 locale 导出修复。
- 完成 `index.jsp` P1：中英 JSP/13 个 include 递归盘点、Controller 证据和 inventory 工件；记录跨 locale 差异供 P2 决策。

## 2026-07-23

- 新建 `jsp-domain-scope`，用于在正式 P1 前收敛旧站阅读范围；与 `jsp-page-inventory` 保持分工。
- 安装 Chromium 并验证 Playwright；开始并完成 index 试点 P1 的前置盘点。
- 提交 Stage 0 脚手架、文档与状态交接；采用 D-006 风险边界和 D-005 轻量/按需流程。
- `Development_Process/` 核心文档与映射表中文化；D-005 退役独立 `HISTORY.md`，保留按需 Skill 和轻量 spec 流程。

## 2026-07-22

- 确定 handoff 目标为 `sellersprite.ai`；内容自动化进入主动建设范围。
- 建立 `Development_Process/`，明确旧站只读、SDD 为主要实现依据、PRD 为验收对照。
- 初始化仓库，创建 `AGENTS.md`、`CLAUDE.md` 与初版文档。
