# 状态

## 现状
Stage 0 脚手架已完成：根目录 pnpm 工具链、`packages/contracts`（Zod schemas）、`packages/mock-adapters`（Mock Reverse ASIN / Identity / Entitlement）、`apps/web`（Next.js App Router + Tailwind/shadcn + 沿用旧站主题的 design tokens，占位 `[locale]` 页面）、`apps/studio`（Sanity Studio + `contentEntry`/`keywordEntry`/`materialAsset` schema —— workflow actions 尚未接入）、`tests/`（Vitest + Playwright smoke tests）。

当前处于个人/探索阶段，流程已简化 —— 见 `DECISIONS.md` D-005：skills 按需现写（目前只有 `jsp-page-inventory` 一个，原计划的其余 14 个延后）、轨B 暂停直至轨A 试点通过、`HISTORY.md` 已退役（其职能并入下方"近期变更记录"）、`WORKFLOW.md` §3 的通用功能流程改为一句话指引而非三闸门仪式。权限管控已收敛为 D-006 的一句话规则（本地可逆改动默认执行）。

**工作流位置**：本项目当前没有任何处于进行中的新功能 spec —— Stage 0 脚手架、D-005/D-006 决策落地、`Development_Process/` 中文化均按 `WORKFLOW.md` §3 的轻量直接执行路径完成，未创建 `specs/NNN-*/` 目录。若套用轻量项目的状态字符串：`SPEC.md — 不适用（本轮工作未走 spec 流程，直接执行）`。

**提交状态**：git 历史上已有 6 个 commit（`9106909`→`8f22fdc`→`132f121`→`71fe4c1`→`6b1b486`，均已核实落地），工作树干净。

## 下一步
**立即行动（新会话直接开始）**：对 `index.jsp` 跑 P1——用 `jsp-page-inventory` skill，`cn/__frontend/index.jsp` + `en/__frontend/index.jsp` 两个 locale 都要看，产出 `Development_Process/migration/inventory/index/inventory.md`；然后对 `search.jsp`/`search_keywords.jsp` 跑同样的 P1（两者判定为待合并，见 master-prompt §3，不得并列迁移成两条可索引 URL）。两页 P1 都完成后再进 P2（contracts 已有基座，见下）→ P3 → P4。

前置条件已核实就绪（2026-07-23 复核，非假设）：
- 目标 JSP 源文件确认存在：`cn/__frontend/{index,search,search_keywords}.jsp` + 对应 `en/` 镜像。
- P1 工具：`.claude/skills/jsp-page-inventory` 已建成。
- P2 契约基座已有：`packages/contracts/src/{index-decision,content,handoff,reverse-asin}.ts`，按页扩展字段即可，非从零写。
- P3 实现基座已有：`apps/web/app/[locale]/page.tsx` 占位、shadcn/ui 已配置（`components.json`）、`globals.css` 里有旧站主题草案 token（文件内注释明确标注为估算值——对照真实页面精修正是 Stage 1 该做的事，不是阻塞项）。
- Mock 数据层已有：`packages/mock-adapters` 的 reverse-asin/identity/entitlement。
- 工具链验证仍然有效（2026-07-23）：`pnpm install` ✓、`pnpm typecheck` ✓（4 个 workspace 包全过）、`pnpm test` ✓（vitest 4/4）。

**e2e 测试（Playwright）本次决定暂缓**：用户明确"暂时不用，之后再说"。`pnpm test:e2e` 目前卡在 chromium 浏览器二进制未下载这一步，不作为 Stage 1 P1-P3 的阻塞项；只有真正推进到 P4 验收且验收器需要跑 e2e 时，才决定是否补跑 `pnpm exec playwright install chromium`。

**已识别但暂不动手的点（Stage 1 试点跑完一次之后再评估，按 D-005 不预先动）：**
- `jsp-page-inventory` SKILL.md 可能的冗余：Scope 表 "Controller evidence" 字段与 Route 表逐行证据重复；"Index Candidate" 章节对明显可/不可索引的页面读起来像仪式；"Confidence" 字段目前没有下游消费者。先跑一遍试点再判断是否精简。
- 不要主动新建 Next.js 页面创作 skill、SEO 打分 skill 或迁移完整性校验 skill——后两者与主提示词 P4 十项统一验收器功能重叠；除非试点验收后发现验收器本身不够用，否则不建（且任何新 skill 都要先过 `AGENTS.md` §Workflow 第7条的必要性/价值权重说明 + 用户批准闸门）。

Stage 1 通过验证后：重新评估是否恢复轨B（见 D-005），以及 Stage 2 分批是否需要新增 skills。

**轨B —— Content Agent：暂停中（见 `DECISIONS.md` D-005）。** Schema 已存在（`apps/studio/schemaTypes/{contentEntry,keywordEntry,materialAsset}.ts`），作为有效的前期铺垫；`workflowState` actions 与 Content Releases 接线尚未开始。待轨A Stage 1 试点通过后再恢复。

## 阻塞项
（无功能性阻塞。提交收尾若因预算未完成，属于会话交接遗留项而非阻塞——见上方"下一步·立即行动"。）

## 近期变更记录
自此处向下为追加式记录 —— 最新的在最上面，只追加、不改写历史。本节现在也承担了原来 `HISTORY.md` 的职能（见 `DECISIONS.md` D-005 —— `HISTORY.md` 已退役）。归档触发条件：一旦此列表超过约 15 条或跨度超过约 2 个月，就把最近 5 条之外的所有条目拆分进独立的归档/`HISTORY.md` 文件，此处只留一行指针 —— 不要让它无限增长。

- 2026-07-23：为下一个全新会话（Stage 1 试点：`index.jsp` + `search.jsp`/`search_keywords.jsp`）做交接准备 —— (a) `AGENTS.md` §Workflow 第7条新增 skill 创建审批闸门：agent 不得自行新建 skill，判断某模式值得封装时须先向用户说明必要性与价值权重，经批准后才能创建 `.claude/skills/*`；(b) 复核确认 Stage 1 前置条件均就绪（git log 6 个既有 commit 均已落地、两个 locale 的目标 JSP 源文件路径核实存在、`packages/contracts`/`packages/mock-adapters`/`apps/web` 脚手架核实到位、工具链验证仍有效）；(c) 用户决定暂缓 `pnpm test:e2e`（Playwright），非本阶段必要项，留到真正推进到 P4 需要时再补装 chromium；(d) 记录了 `jsp-page-inventory` SKILL.md 的三处潜在冗余（Controller evidence 重复、Index Candidate 仪式感、未消费的 Confidence 字段）与"暂不新建"的三个候选 skill（Next.js 页面创作、SEO 打分、迁移完整性校验——后两者与 P4 十项验收器重叠），留待试点跑完一次后评估，本次不改动。
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
