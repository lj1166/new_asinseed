# Development_Process

本项目工程文档与项目工作记忆的唯一存放处 —— 任何项目相关内容都不应再散落到独立的 `docs/` 或根目录级 `migration/`/`specs/`（这次整合的原因见 `DECISIONS.md` D-002）。

会话协议（权威版本见 `AGENTS.md` § Session protocol）：会话开始时读热 `STATE.md` + 最近 git log；会话结束时更新快照并保留最近五条短记录。更早记录迁入 `archive/STATE-changelog-YYYY-MM.md`，避免热记忆膨胀（见 `DECISIONS.md` D-007）。

| 路径 | 内容 | 更新触发条件 |
|---|---|---|
| `STATE.md` | 现状 / 下一步 / 阻塞项 / 最近五条短记录 / 尝试与失败记录 —— 热快照 | 每次会话结束（更新快照；第六条记录出现前先归档） |
| `archive/STATE-changelog-YYYY-MM.md` | 已归档的会话历史 —— 冷记忆，非每次会话必读 | 每月或热记录超过五条时 |
| `ARCHITECTURE.md` | 产品目标、模块职责、不变量、数据流 | 仅当架构实际发生变化时 |
| `DECISIONS.md` | 追加式的、难以撤销的决策日志 | 做出一个难以撤销的选择时 |
| `WORKFLOW.md` | 指向 master-prompt 迁移流程 + 通用 spec 闸门模板的索引 | 流程本身发生变化时 |
| `mappings/page-map.md` | 旧 JSP 路由 ↔ 新路由、模板分组、迁移状态、收录决策 —— 跨全部页面的汇总 | 每个页面进入/退出 P1-P4 时 |
| `mappings/field-map.md` | 旧字段 ↔ 新 Sanity 字段或硬编码决策 —— 跨全部页面的汇总 | 每个页面的 P1/P2 完成字段归类时 |
| `mappings/feature-map.md` | 旧功能/模块 ↔ 新实现、状态 | 每个功能被迁移或构建时 |
| `mappings/user-flow-map.md` | 旧用户旅程 ↔ 新旅程、差异点 | 用户旅程被迁移/重新设计时 |
| `migration/inventory/<page>/inventory.md` | P1 逐页详细分类（master-prompt 产物） | P1 阶段，每页一份 |
| `migration/reports/report-<batch>.md` | P4 逐批次验收报告（master-prompt 产物） | P4 阶段，每批次一份 |
| `specs/NNN-<name>/spec.md` | 非迁移功能流程，现阶段从轻处理：小改动完全跳过此流程，较大改动只需一份简短 `spec.md` 加一句话认可 —— 现阶段不需要单独的 `plan.md`/`tasks.md` 闸门（见 `WORKFLOW.md` §3、`DECISIONS.md` D-005） | 懒创建，第一个需要它的非迁移功能出现时 |

补充说明：
- `mappings/*.md` 是汇总摘要，不是详细记录 —— 保持每页/字段/功能一行，细节指向 `migration/inventory/<page>/`，避免它们膨胀成难以维护的重复内容。
- `scripts/migration/`（仓库根目录）存放 P1-P4 脚本的*代码*；`Development_Process/migration/` 存放这些脚本产出的*数据产物*。两者不要混淆。
- 旧站（`../../原网站代码asinseed`）是只读参考 —— 绝不编辑。`../../prd-docs/SDD.md` 是主要的实现依据；`../../prd-docs/PRD.md` 用于验收/对照（§10 AC、§12 DoD）。
