# 架构

## 产品目标与边界

把旧 JSP 站点（`../../原网站代码asinseed`，Java/Dubbo 单体，**只读参考 —— 禁止编辑**）重建为 Next.js + Sanity + Vercel 的 SEO 前台站点。ASINSeed 是免费的发现层（SEO 驱动的自然流量、轻量 Reverse ASIN 查询）；SellerSprite 是付费的决策层。产品职责是在用户表现出决策级意图后干净地导流给 SellerSprite，而不是与其竞争。

**业务北极星（2026-07-26 明确化，响应 `report-agent-system-gaps.md`；与主提示词 §0 一致，非新决策，只是把已隐含的目标显式写入本文档）**：所谓"SEO 驱动的自然流量"是双重目标，不只是 Google 排名——同时优化传统搜索引擎收录排名，与生成式引擎（ChatGPT/Perplexity/Google AI Overview 等）的可引用性与推荐权重（GEO，见 `Development_Process/migration/seo-scoring-standard.md` J/K 类目），两者共同服务于同一条导流路径：获取免费流量 → 命中决策/验证意图的用户 → 通过任务型 CTA 导流到 `sellersprite.ai`。GEO 不是独立于 SEO 之外的另一套目标，而是"自然流量获取"这一既有目标在生成式引擎渠道上的延伸。

本阶段（依据 PRD §0.1）明确排除：全站迁移、真实后端接入、生产发布。完整权威范围/非目标见 `../../prd-docs/PRD.md` §0.2/§2.3，流程细节见 `../../prd-docs/prompts/00_migration_loop_master_prompt.txt`。**SDD.md 是主要的实现依据；PRD.md 用于验收/对照（§10 AC、§12 DoD），不作为主要实现规格来源。**

## 模块职责（叙述）

- **`apps/web`** —— Next.js App Router 站点。通过 RSC 渲染所有可收录页面。本阶段绝不调用真实旧后端、真实支付服务商或生产数据库。
- **`apps/studio`** —— Sanity Studio。只承载真正可变的 SEO/内容字段（SDD §10 的 `ContentEntry`、`KeywordEntry`、`MaterialAsset`）；agent 可写草稿，只有人工才能发布（SDD §11）。Content Agent（轨B）的设计已就位 —— 关键词库 → 素材库 → agent 写草稿 → 人工评审（`workflowState: draft → in_review → approved`）→ 人工设定 Sanity Content Release 定时 → 到点机械发布 —— 使用 Sanity 原生的 Content Releases API + 自定义 `workflowState` 字段，无需第三方插件（ADR-005，见 `Development_Process/DECISIONS.md` D-004）。**当前暂停**（`DECISIONS.md` D-005）：schema 已建好，但 `workflowState` actions 与 Content Releases 接线要等轨A Stage 1 试点通过后才开始。
- **`packages/contracts`** —— Reverse ASIN / Handoff / Content 的 Zod schema，由 `apps/web` 与 `packages/mock-adapters` 共用，使未来切换真实后端时无需重写调用点。
- **`packages/mock-adapters`** —— 本阶段唯一的数据层实现：`MockReverseAsinProvider`、`IdentityAdapter`、`EntitlementAdapter`（SDD §5）。形状必须匹配未来真实契约；不要求 mock 具备企业级重试/降级设计。
- **`scripts/migration`** —— 由 Migration Loop 工作流驱动的 P1-P4 阶段脚本（盘点 → schema 草案 → 导入 → 验收），每个 JSP 页面/批次对应一套脚本。

## 关键不变量

- 单一的服务端计算 `IndexDecision`（SDD §7.1）同时驱动 metadata、sitemap 与测试 —— 绝不允许三处各自计算、可能互相矛盾的值。
- 查询结果页（`/{locale}/{market}/{asin}`）永远是 `noindex`，且永远不出现在 sitemap 中。
- 每个新的可收录页面至少被另一个可收录页面链接到（不允许孤儿页面）。
- 一个结果页最多渲染一个 Handoff CTA；其目标域名必须在 `handoff-registry` 白名单内。页面代码中任何地方都不得硬编码 SellerSprite 链接。
- Sanity schema 只承载真正可变的 SEO/内容数据字段。价格数值（源自 `price.jsp`）永远硬编码，绝不存入 Sanity。
- `packages/mock-adapters` 是本阶段 Reverse ASIN / Identity / Entitlement 业务数据的唯一路径。未经 `AGENTS.md` § Boundaries 中的 HITL 批准，任何代码都不得调用真实 Java/Dubbo 后端、真实支付服务商或生产数据库。

## 数据流总览

```
User → apps/web (Next.js, Vercel)
         ├─→ Sanity Content Lake        (内容 + SEO metadata，最小化 GROQ projection)
         ├─→ packages/mock-adapters     (Reverse ASIN 查询 / Identity / Entitlement —— 仅 Mock)
         └─→ Handoff Service            (读取 handoff-registry 白名单)
                  └─→ SellerSprite      (静态深链；目标域名：sellersprite.ai)
```

真实旧后端是 `packages/mock-adapters` 未来的替换目标，本阶段不接入（触发条件：PRD `TBD-REAL-BACKEND-CUTOVER`）。

## 影响本架构的未决问题

以下延续自 `../../prd-docs/PRD.md` §0.3 —— 不得凭推断擅自解决：

- ~~Handoff 目标域名~~ —— **已于 2026-07-22 解决**：`sellersprite.ai`（业务确认；见 `DECISIONS.md` D-003）。`search.jsp` 中旧的 `sellersprite.com` 链接不迁移。
- `seo/hot/*` 程序化页面：是否收录/合并策略待内容质量评审确认（PRD `TBD-SEO-programmatic`）。
- Mock → 真实后端切换时机：待业务确认，或需一份经批准的 `legacy-contract-report.md`（PRD `TBD-REAL-BACKEND-CUTOVER`）。
