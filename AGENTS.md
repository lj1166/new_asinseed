# ASINSeed 重构（新站）

把旧站 `原网站代码asinseed`（JSP 单体）改造为 Next.js + Sanity + Vercel 的 SEO 前台站点，发现层导流到 SellerSprite（决策层）。当前阶段：Stage 0 脚手架已完成（contracts/mock-adapters/apps 骨架/tests），个人 agent-loop 探索期，工程配重按需增长而非预先搭建（见 `Development_Process/DECISIONS.md` D-005）；尚未开始任何页面迁移（Stage 1 待启动）。

## Commands
`pnpm install`；`pnpm dev`（web）；`pnpm dev:studio`（studio，需先在 `apps/studio/.env.local` 填真实 project id/dataset）；`pnpm build`；`pnpm lint`；`pnpm typecheck`；`pnpm test`（vitest）；`pnpm test:e2e`（playwright）。注：尚未实际跑过 `pnpm install`/dev boot 验证，见 `Development_Process/STATE.md` § Next。

## Structure
- `Development_Process/` — **唯一**的工程文档与项目记忆入口：`STATE.md`（当前状态 + 追加式历史记录，见其 § 近期变更记录）、`ARCHITECTURE.md`、`DECISIONS.md`、`WORKFLOW.md`、`mappings/`（新旧页面/字段/功能/用户流程映射汇总表）、`migration/`（P1 逐页 inventory + P4 批次报告产物）、`specs/`（非迁移新功能的 spec，懒创建）。会话开始必读 `Development_Process/STATE.md`。
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
技术栈已在 SDD §2 定案，非本仓库自行决定：Next.js App Router + TypeScript strict；Tailwind + shadcn/ui（组件代码复制入仓库，非 npm 依赖）；Zod 做 BFF 契约；pnpm。真实编码细节（目录内约定、命名）在 Stage 0/P3 首次落地页面时确立，届时回填本节。`Development_Process/` 与 `.claude/skills/` 下的文档统一使用中文撰写，专业术语/标识符（技术栈专有名词、Stage/P1-P4/HITL 等流程词、schema 字段名、文件路径、D-XXX/ADR-XXX 编号）保留英文。

## Boundaries
**本地可逆改动默认执行；涉及生产内容、真实用户/支付/旧后端、线上 URL/流量或不可恢复删除时必须先获人工批准。**

Ask first 的具体边界仅包括：生产 Sanity publish/delete、生产 Schema deploy/dataset replace、真实 Legacy Adapter/支付/身份接入、线上 redirect/410/流量切换、绕过审核的自动发布、变更 `sellersprite.ai` 目标域名，以及将 `seo/hot/*` 实际纳入收录。Stage 2 同模板组可按代表页一次审批；验收未通过的页面单独升级为 HITL。

新增依赖、本地 schema 源码、Mock、草稿工件、测试与可恢复的仓库内删除默认执行并在结果中说明，不逐项请求批准。

Never：push/publish/force ops；编辑 `../原网站代码asinseed/` 下任何文件（只读参考，即便它在本仓库 git 边界之外，也不得通过文件工具修改）；把 PRD 当主要实现规格直接抄（应以 SDD 为准）；把 Mock 数据形状当生产事实源固化；密钥/token 写入仓库任何文件（含 `.env.example`，真实 token 只放 `.env.local`/Vercel Secret）。

## Workflow
本项目有三条并行但不同性质的工作流，不要混用：

1. **JSP 迁移（Migration Loop，轨A）**：唯一权威流程定义在 `../prd-docs/prompts/00_migration_loop_master_prompt.txt`——P1(发现归类)→P2(契约Schema)→P3(实现导入)→P4(验收放行) 单页节拍，Stage 0(搭loop)→1(试点)→2(分批)→3(放行) 整体节奏，10 项统一验收器。权限边界以本文件 § Boundaries 为准。`Development_Process/WORKFLOW.md` §1 只索引不复制。P1/P4 产物写入 `Development_Process/migration/`，跨页汇总写入 `Development_Process/mappings/`（见 `Development_Process/DECISIONS.md` D-002）。JSP 页面迁移相关工作走这条线。
2. **内容自动化（Content Agent，轨B，当前暂停）**：关键词库→素材库→agent 写草稿（`workflowState: draft`）→人工审核推进 `in_review`/`approved`→人工设定 Sanity Content Release 定时发布→到点机械发布。权威定义：PRD §8、SDD §10/§11/§12（不是本文件重新展开的地方）。设计上与轨A独立、不互相阻塞（ADR-003，`Development_Process/DECISIONS.md` D-004）；**当前暂停**：schema 已建好，workflowState actions / Content Releases 接线要等轨A Stage 1 试点通过验收后再开始（见 D-005）。不走本条以外的三闸门或迁移循环。agent 写入身份永远没有把状态推进到 `approved` 或创建/改动 Content Release 的权限，这是测试断言的硬 Gate，不是约定。
3. **非迁移新功能**（既不属于轨A也不属于轨B的新增能力）：判断走哪条线：源自某 JSP 页面尚未迁移完的内容/字段 → 轨A；博客/文章内容生产相关 → 轨B；其余全新能力（JSP 和内容自动化都没有对应物）→ 走 `Development_Process/WORKFLOW.md` §3 的轻量 spec 流程（当前阶段已简化为「小改动直接改，大改动写个短 spec.md 拿到一句话认可再做」，不是三闸门，见 D-005）。
4. 小改动（≤ 2 文件，不涉及 schema/API/permission）跳过 spec 流程，三条线都适用。
5. 提交前缀：迁移 `feat(migration-<page>): P<n> <summary>`；内容自动化 `feat(content-agent): <summary>`；spec 流程 `feat(NNN-<name>): <summary>`。
6. 架构性选择先查 `Development_Process/DECISIONS.md`，决定后追加记录；模块总览见 `Development_Process/ARCHITECTURE.md`。
7. 工程配重（skills / 流程闸门 / 并行轨道）按实际反复出现的需求增长，不预先搭建；这是当前阶段的默认做法，不是一次性清理，具体见 `Development_Process/DECISIONS.md` D-005。

## Session protocol
开始：读 `Development_Process/STATE.md`（含 § 近期变更记录 近期记录）+ 最近 git log。
结束（强制）：重写 `Development_Process/STATE.md`（更新 现状/下一步/阻塞项，在 § 近期变更记录 追加一条，只加不改历史）。
