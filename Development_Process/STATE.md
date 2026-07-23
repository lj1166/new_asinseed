# 状态

## 现状
Stage 0 脚手架已完成：根目录 pnpm 工具链、`packages/contracts`（Zod schemas）、`packages/mock-adapters`（Mock Reverse ASIN / Identity / Entitlement）、`apps/web`（Next.js App Router + Tailwind/shadcn + 沿用旧站主题的 design tokens，占位 `[locale]` 页面）、`apps/studio`（Sanity Studio + `contentEntry`/`keywordEntry`/`materialAsset` schema —— workflow actions 尚未接入）、`tests/`（Vitest + Playwright smoke tests）。

当前处于个人/探索阶段，流程已简化 —— 见 `DECISIONS.md` D-005：skills 按需现写（目前只有 `jsp-page-inventory` 一个，原计划的其余 14 个延后）、轨B 暂停直至轨A 试点通过、`HISTORY.md` 已退役（其职能并入下方"近期变更记录"）、`WORKFLOW.md` §3 的通用功能流程改为一句话指引而非三闸门仪式。权限管控已收敛为 D-006 的一句话规则（本地可逆改动默认执行）。

**工作流位置**：本项目当前没有任何处于进行中的新功能 spec —— Stage 0 脚手架、D-005/D-006 决策落地、`Development_Process/` 中文化均按 `WORKFLOW.md` §3 的轻量直接执行路径完成，未创建 `specs/NNN-*/` 目录。若套用轻量项目的状态字符串：`SPEC.md — 不适用（本轮工作未走 spec 流程，直接执行）`。

**提交状态（本次会话结束时）**：仓库历史上已有 3 个 commit（`9106909` 建库+`Development_Process/` 骨架、`8932992` 澄清 HITL 批次粒度、`8f22fdc` 确定 Handoff 域名+激活轨B）。在这 3 个 commit 之后新产生的工作 —— Stage 0 脚手架代码、D-005/D-006 决策与 `AGENTS.md`/`Development_Process/` 相应改动、本次中文化翻译 —— 已在本次收尾时提交（见下方"近期变更记录"的对应条目取得的 commit hash；若下面仍写着"尚未提交"字样，说明提交步骤因预算未执行，以工作树实际 `git status` 为准）。

## 下一步
**立即行动**：确认上一步的收尾提交（脚手架 1 个 commit + 文档/决策 1 个 commit + 本状态文档 1 个 `chore(handoff)` 收尾 commit）已经落地；如果因为预算耗尽而未执行，先跑：
```
git add <脚手架文件与被替换的 .gitkeep> && git commit -m "feat(scaffold): ..."
git add AGENTS.md Development_Process/ .claude/skills/jsp-page-inventory/SKILL.md && git commit -m "docs: ..."
```
（具体文件清单见本文件旧版 diff 或直接跑 `git status --porcelain=v1 -uall`。）

**轨A —— Migration Loop（目前唯一在推进的战线）：**
- Stage 1 试点：`index.jsp`（首页）+ `search.jsp`/`search_keywords.jsp` 合并为一个结果路由（依据 master-prompt §7 / SDD §13 的 URL 表）。先对两个页面跑 P1（用 `jsp-page-inventory` skill）→ `migration/inventory/<page>/inventory.md` → P2（contracts 已大体就位，按需扩展）→ P3（实现）→ P4（10 项统一验收器）。
- 只有当 Stage 1 实际手工重复出现某个模式时，才新写一个 `.claude/skills/*` skill —— 不做预先设想。
- 验证状态（2026-07-23）：`pnpm install` ✓（已是最新）、`pnpm typecheck` ✓（4 个 workspace 包全部通过，此前修复了 Git Bash/Windows 会话里本地环境 `pnpm` 未加入 PATH 的问题）、`pnpm test` ✓（vitest 4/4 通过）。`pnpm test:e2e`（Playwright）目前仅卡在首次运行的基础设施步骤 —— 该环境尚未下载 chromium 浏览器二进制文件，非代码缺陷。跑一次 `pnpm exec playwright install chromium`，再重跑 `pnpm test:e2e` 即可解决。本次会话（纯文档翻译）未重跑这些 gate，因为改动不涉及代码——沿用 2026-07-23 的验证结果。
- Stage 1 通过验证后：重新评估是否恢复轨B（见 D-005），以及 Stage 2 分批是否需要新增 skills。

**轨B —— Content Agent：暂停中（见 `DECISIONS.md` D-005）。** Schema 已存在（`apps/studio/schemaTypes/{contentEntry,keywordEntry,materialAsset}.ts`），作为有效的前期铺垫；`workflowState` actions 与 Content Releases 接线尚未开始。待轨A Stage 1 试点通过后再恢复。

## 阻塞项
（无功能性阻塞。提交收尾若因预算未完成，属于会话交接遗留项而非阻塞——见上方"下一步·立即行动"。）

## 近期变更记录
自此处向下为追加式记录 —— 最新的在最上面，只追加、不改写历史。本节现在也承担了原来 `HISTORY.md` 的职能（见 `DECISIONS.md` D-005 —— `HISTORY.md` 已退役）。归档触发条件：一旦此列表超过约 15 条或跨度超过约 2 个月，就把最近 5 条之外的所有条目拆分进独立的归档/`HISTORY.md` 文件，此处只留一行指针 —— 不要让它无限增长。

- 2026-07-23：会话交接（handoff）——把 Stage 0 脚手架代码、D-005/D-006 决策落地改动、`Development_Process/` 中文化翻译，从"3 个既有 commit 之后一直未提交"的状态收尾提交（commit 拆分：脚手架一个、文档/决策一个、本状态文档收尾一个 `chore(handoff)`）。补正了此前 现状 中"尚未提交任何 commit"的表述错误——仓库实际已有 3 个更早的 commit（建库/HITL 澄清/Handoff 域名+轨B），此前的说法把"这批新工作未提交"误写成了"仓库从无提交"。本轮未产生新的架构决策、新的助手记忆缺口——D-006 已在会话过程中（用户/linter）落地并与本文档表述一致，无需额外补写。
- 2026-07-23：权限策略收敛（`DECISIONS.md` D-006）：本地可逆改动默认执行；仅生产内容、真实用户/支付/旧后端、线上 URL/流量或不可恢复删除需人工批准。同步压缩 `AGENTS.md` 与迁移主提示词，并修正 Stage 1 P1 inventory 的标准产物路径。
- 2026-07-23：文档系统中文化 —— 把 `Development_Process/` 下 5 个核心文档（`STATE.md`、`ARCHITECTURE.md`、`DECISIONS.md`、`WORKFLOW.md`、`README.md`）与 4 个空骨架映射表（`mappings/*.md`）整篇译成中文，正文与小标题均译，专业术语/文件路径/编号（D-XXX、ADR-XXX、Stage/P1-P4 等）保留英文；同步修正 `AGENTS.md` 中两处逐字引用旧英文小标题的地方（改指向"现状/下一步/阻塞项/近期变更记录"），并在其 `## Conventions` 追加一句中文文档撰写约定。`.claude/skills/jsp-page-inventory/SKILL.md` 核实已提前是中文，未改动。`prd-docs/`、`CLAUDE.md`、代码文件、测试产物均未改动（本就无需改动或明确排除在外）。
- 2026-07-23：轻量模式重组（`DECISIONS.md` D-005）：把 `HISTORY.md` 退役并入本节、暂停轨B、skills 数量收敛到已建成的这一个（`jsp-page-inventory`）、其余按需再建、把 `WORKFLOW.md` §3 的 spec 仪式精简为一句话指引、放弃独立试点计划文档改用上方"下一步"小节的说明、轻量同步更新了 `ARCHITECTURE.md`/`AGENTS.md`。
- 2026-07-23：Stage 0 脚手架搭建完成 —— 根目录工具链、`packages/contracts`、`packages/mock-adapters`、`apps/web`、`apps/studio` schema、`tests/`。写了 `.claude/skills/jsp-page-inventory`；原计划的其余 13 个 skills 有意未建（见 D-005 —— 不是遗漏）。
- 2026-07-22：Handoff 目标域名确定为 `sellersprite.ai`（用户业务决策）；内容自动化（轨B）从占位提升为主动建设范围，与轨A 并行推进。`PRD.md`/`SDD.md` 由 v0.2.0 升至 v0.3.0；`ARCHITECTURE.md`、`DECISIONS.md`（D-003、D-004）、`AGENTS.md` 相应更新。
- 2026-07-22：`Development_Process/` 建立 —— 把原 `docs/` 合并进来，新增 `mappings/`、`migration/{inventory,reports}/`。`AGENTS.md` 更新：旧站为只读参考，SDD 为主要实现依据，PRD 为验收/对照依据。
- 2026-07-22：仓库初始化，创建 `AGENTS.md`/`CLAUDE.md` 与初版文档。

## 尝试与失败记录
（暂无）
