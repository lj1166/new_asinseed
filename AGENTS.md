# ASINSeed 重构（新站）

把旧站 `原网站代码asinseed`（JSP 单体）改造为 Next.js + Sanity + Vercel 的 SEO 前台站点，发现层导流到 SellerSprite（决策层）。当前阶段：仓库骨架已建，尚未执行 Stage 0（生成 skills/design-tokens/handoff-registry），未开始任何页面迁移。

## Commands
TBD — Stage 0 尚未执行，`package.json`/pnpm workspace 尚未生成，因此 dev/build/test/lint/migrate 命令暂无法给出真实命令。Stage 0 完成后必须回填本节。

## Structure
- `Development_Process/` — **唯一**的工程文档与项目记忆入口：`STATE.md`（当前状态）、`HISTORY.md`（追加式会话历史）、`ARCHITECTURE.md`、`DECISIONS.md`、`WORKFLOW.md`、`mappings/`（新旧页面/字段/功能/用户流程映射汇总表）、`migration/`（P1 逐页 inventory + P4 批次报告产物）、`specs/`（非迁移新功能的 spec/plan/tasks，懒创建）。会话开始必读 `Development_Process/STATE.md`，详见其 `README.md`。
- `apps/web/` — Next.js 前台站点（App Router）
- `apps/studio/` — Sanity Studio
- `packages/contracts/` — Zod schema：Reverse ASIN / Handoff / Content 契约
- `packages/mock-adapters/` — 本期唯一的数据层实现（Reverse ASIN / Identity / Entitlement 皆为 Mock）
- `scripts/migration/` — P1-P4 脚本本体（区别于 `Development_Process/migration/` 的产物/数据，前者是代码，后者是数据）

参考路径（仓库外三个同级目录，各自角色不同，不可混淆）：
- `../原网站代码asinseed/` — 旧站源码，**只读参考，禁止编辑其中任何文件**。用途仅限于理解现网内容/功能，不作为迁移目标。JSP 在 `asinseed-front/src/main/webapp/jsp/{cn,en}/__frontend`。
- `../prd-docs/SDD.md` — **主要工作依据**，日常实现细节以此为准。
- `../prd-docs/PRD.md` — **验收/对照依据**，用来做需求核对（§10 AC-01~06、§12 DoD），不作为主要实现规格来源；SDD 与 PRD 冲突时以 SDD 实现、但需在 `Development_Process/DECISIONS.md` 记一笔并提示我。
- `../prd-docs/prompts/00_migration_loop_master_prompt.txt` — 迁移流程唯一权威定义。

## Conventions
技术栈已在 SDD §2 定案，非本仓库自行决定：Next.js App Router + TypeScript strict；Tailwind + shadcn/ui（组件代码复制入仓库，非 npm 依赖）；Zod 做 BFF 契约；pnpm。真实编码细节（目录内约定、命名）在 Stage 0/P3 首次落地页面时确立，届时回填本节。

## Boundaries
Ask first（触碰任一必须停下问用户，等同主提示词 §2.4 HITL）：
- Sanity 生产 Schema deploy / dataset replace / 生产 publish / 删除内容
- 首次切换真实 Legacy Adapter（Reverse ASIN 引擎/账号体系/支付）
- Handoff 目标域名变更（`TBD-SELLERSPRITE-HOST` 未定案前禁止擅自二选一——见 `Development_Process/ARCHITECTURE.md` § Open questions）
- `seo/hot/*` 程序化页是否收录
- 试点未绿的情况下扩批
- 新增依赖、schema/data migrations、prod config、deletions

Never：push/publish/force ops；编辑 `../原网站代码asinseed/` 下任何文件（只读参考，即便它在本仓库 git 边界之外，也不得通过文件工具修改）；把 PRD 当主要实现规格直接抄（应以 SDD 为准）；把 Mock 数据形状当生产事实源固化；密钥/token 写入仓库任何文件（含 `.env.example`，真实 token 只放 `.env.local`/Vercel Secret）。

## Workflow
本项目有两条并行但不同性质的工作流，不要混用：

1. **JSP 迁移（Migration Loop 轨道）**：唯一权威流程定义在 `../prd-docs/prompts/00_migration_loop_master_prompt.txt`——P1(发现归类)→P2(契约Schema)→P3(实现导入)→P4(验收放行) 单页节拍，Stage 0(搭loop)→1(试点)→2(分批)→3(放行) 整体节奏，10 项统一验收器，6 项 HITL 硬门禁。`Development_Process/WORKFLOW.md` 只索引不复制。P1/P4 产物写入 `Development_Process/migration/`，跨页汇总写入 `Development_Process/mappings/`（见 `Development_Process/DECISIONS.md` D-002）。迁移相关的所有工作走这条线，不套用下面的 spec/plan/tasks 三闸门。
2. **非迁移新功能**（迁移完成后的新特性、与 JSP 无关的新增能力）：走 `Development_Process/specs/NNN-<name>/`（spec → plan → tasks），每个产物需我明确批准才能进入下一步，模板与闸门规则见 `Development_Process/WORKFLOW.md`。
3. 小改动（≤ 2 文件，不涉及 schema/API/permission）跳过 spec 流程，两条线都适用。
4. 迁移批次提交：`feat(migration-<page>): P<n> <summary>`；spec 流程提交：`feat(NNN-<name>): Tn <summary>`。
5. 架构性选择先查 `Development_Process/DECISIONS.md`，决定后追加记录；模块总览见 `Development_Process/ARCHITECTURE.md`。

## Session protocol
开始：读 `Development_Process/STATE.md` + 最近 1-2 条 `Development_Process/HISTORY.md` + 最近 git log。
结束（强制）：重写 `Development_Process/STATE.md`；在 `Development_Process/HISTORY.md` 追加一条本次会话记录（只加不改历史）。
