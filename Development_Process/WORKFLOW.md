# 工作流

本仓库并行运行三条工作流。走哪一条由任务类型决定，不是凭偏好挑选 —— 一句话规则见 `AGENTS.md` § Workflow。

## 1. Migration Loop（JSP 迁移，轨A）

权威、完整的定义在 `../../prd-docs/prompts/00_migration_loop_master_prompt.txt`。本文件不重复其内容 —— 只索引结构，让 agent 知道去哪里查：

- §1 —— 两条轨道（Migration Loop / Content Agent）、命名、勿混淆规则。
- §2 —— 逐页/批次的 P1→P2→P3→P4 节拍、10 项统一验收器（§2.3）、6 个 HITL 硬门禁（§2.4，Stage 2 按批次粒度审批 —— 见 `AGENTS.md` § Boundaries）、Mock-only 数据规则（§2.5）。
- §3 —— 来自真实 JSP 扫描的已验证事实（不要重新扫描；当作既定事实）。
- §4 —— 技术栈 + 设计系统基线（shadcn/ui、design tokens）。
- §5 —— 当前可用 skill 与“按实际需求、经批准后再新增 skill”的工程配重规则。
- §6 —— Handoff Registry / CTA v1 范围。
- §7 —— Stage 0（已完成）→ Stage 1（试点：首页 + 合并搜索结果页）→ Stage 2（按模板分批）→ Stage 3（全量放行）。Stage 2 还受 Layer C 未解决 `FAIL` 阻断。

任何 JSP 迁移任务 —— 盘点、schema 起草、页面导入、批次验收 —— 都走这份文件，而不是下面的通用 spec/plan/tasks 流程。工作产物（P1 逐页 inventory、P4 批次报告、跨页汇总映射表）放在本目录下的 `migration/` 与 `mappings/` —— 具体布局见 `README.md`，为何迁出 master prompt 字面路径 `migration/...` 见 `DECISIONS.md` D-002。

### 1.1 验收三层与证据关系

| 层级 | 解决的问题 | 最低证据 | 失败影响 |
|---|---|---|---|
| Layer A | P4 的十项迁移不变量是否成立 | 源码、P4 清单、测试/运行输出 | 当前页面或批次 P4 不通过 |
| Layer B | 元数据、结构化数据、sitemap/robots 等技术边界是否实际可用 | `metadata-asset-constraints.md` + HTTP/DOM 证据 | 禁止扩批 |
| Layer C | 已交付试点是否具有 SEO/GEO 健康基础 | `seo-scoring-standard.md` 审计与修复/接受记录 | 未解决 `FAIL` 时禁止 Stage 2 和 Track B 解锁 |

三层不能互相替代。截图仅用于视觉 QA；旧站事实必须有 `路径:行号`，运行时行为必须有 HTTP、DOM 或可复现测试证据。完整取证纪律见 `AGENTS.md` § Evidence protocol。

## 2. Content Agent（博客/文章自动化，轨B）

权威定义：`../../prd-docs/PRD.md` §8/§9、`../../prd-docs/SDD.md` §10/§11/§12/ADR-005。本文件不重复其内容 —— 只索引结构：

- 流水线：`KeywordEntry`（选题输入）→ `MaterialAsset`（原始素材）→ Content Agent 写入 `ContentEntry`，`workflowState: draft`、`generatedBy: 'agent'` → 人工在 Studio 中把它推进 `draft → in_review → approved` → 人工为 `approved` 文档设定 Sanity **Content Release** 定时 → Sanity 到点机械发布（或人工直接发布，作为定时发布的替代方案）。
- 硬性规则（技术强制，非约定）：Content Agent 的 Sanity 写入身份永远不能把 `workflowState` 推进到 `approved`，也永远不能创建/修改 Content Release。任何让 agent 自动推进状态或自动发布的实现都属于 HITL 违规 —— 所需的自动化 Gate 见 `SDD.md` §12。
- 与轨A（ADR-003）在架构上独立；**当前执行暂停中**（D-005/D-007）：schema 已存在，但 `workflowState` actions 与 Content Releases 接线需等首页与合并搜索页完成 P4，且 Layer C 没有未处理的 SEO/GEO `FAIL`。具体解锁清单在 `backlog-track-b.md`。
- 本轨道**不**走下面 §3 的 spec/plan/tasks 闸门 —— 其流程已在 PRD §8/SDD §11 中完整规定，不需要每次改动重新推导。对流水线本身的小修改（≤ 约 2 个文件）按本文件末尾的比例原则直接进入实现；更大的改动直接更新 PRD/SDD，若改变了流水线形态则记一条 `DECISIONS.md` 条目。

## 3. 通用 spec 流程（既非轨A 也非轨B 的工作）

适用于不源自某个 JSP 页面、也不属于博客/内容自动化的新能力 —— 例如新的站点基础设施、工具链，或没有 JSP/内容流水线先例可循的功能。

当前个人探索阶段的轻量版本（`DECISIONS.md` D-005）：

- **≤ 约 2 个文件，不涉及 schema/API/权限面** → 直接实现即可。
- **更大的改动** → 写一份简短的 `Development_Process/specs/NNN-<name>/spec.md`（做什么/为什么，几条验收标准，边界情况，范围之外的部分），拿到一句话认可后再实现 —— 现阶段不需要单独的 `plan.md`/`tasks.md` 闸门。
- 只有当项目变成一个审计追溯比迭代速度更重要的多人项目时，才恢复完整的三闸门 spec→plan→tasks 流程（EARS 格式验收标准、逐任务覆盖检查）—— 现在不需要。

拿不准时：问一句"要不要写 spec？"
