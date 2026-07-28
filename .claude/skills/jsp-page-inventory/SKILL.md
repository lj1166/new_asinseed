---
name: jsp-page-inventory
description: 在迁移任一旧 JSP 页面前的 P1 阶段使用。只读扫描 JSP、递归 include、关联 Controller 和前端请求，产出带源码证据的固定 inventory 工件，供 P2 契约、URL Map 与 IndexDecision 使用；尚未完成 inventory 时不得编写 Next.js 页面。
---

# JSP 页面盘点

为一个 JSP 页面生成可复核的 P1 inventory。旧站 `../原网站代码asinseed/` 始终只读；不得编写 Next.js、Sanity schema、redirect 或修改旧站文件。

## 输入与读取

1. 确认目标 JSP、locale 和已知旧 URL；未知 URL 不得猜测。若 P1 不能在当前会话完成，先在 `Development_Process/migration/inventory/<page>/.p1-progress.md` 写入进度快照，再开始较长的源码读取。
2. 读取目标 JSP，递归解析本地 `<jsp:include>` 与 `<%@ include %>`。记录每个实际文件；遇到循环或无法解析的路径，写入 `UNRESOLVED`。
3. 搜索相关 Spring Controller 的 mapping。只有 Controller 源码能证明路由、HTTP method 或路径参数；仅从 JSP 推断的内容标为 `UNRESOLVED`。
4. 提取表单、AJAX/fetch、静态资源、SEO 标签、JSON-LD、可见文案和服务端变量。每项均附 `文件路径:行号` 证据。

## 中断恢复快照

`STATE.md` 记录项目级“下一步”；`.p1-progress.md` 只记录一项正在进行的 P1，二者不互相替代。

以下任一情形必须写入或刷新快照：开始一个预计跨多次工具读取的 P1、完成 include/Controller/内容归类任一大步骤、准备因上下文或外部阻塞交接时。使用最小模板：

```md
# P1 Progress: <page>

| Field | Value |
|---|---|
| Status | in-progress / blocked / completed |
| Target JSPs | <absolute legacy paths> |
| Locale | <locale> |
| Completed evidence | <已读文件或完成的表格项，附路径:行号范围> |
| Remaining reads | <尚未读取的 JSP/include/Controller，或 none> |
| UNRESOLVED | <事项及缺失原因，或 none> |
| Exact next action | <下一次应执行的一步，不写泛泛“继续”> |
```

恢复 P1 时先读取快照，复核其中的源码证据后再继续；快照不得被当作最终 inventory 或未经复核的事实来源。完整 inventory 写入并通过 Exit Check 后，将快照标为 `completed`，`Exact next action` 写 `none — P1 complete`。禁止用“会话刚刚结束/需要重新读全部内容”代替明确进度。

## 归类规则

为每个 SEO、内容和业务元素选择一个状态：

- `sanity`：运营会维护的正文、文章元数据、页面 SEO 或媒体。
- `hardcode`：稳定的 UI 文案、路由规则、价格值、技术 metadata、设计 token 或组件行为。
- `TBD-SEO`：程序化、重复、内容质量或收录价值未确认的内容。
- `exclude`：后台、真实支付、账号权益或本期不迁移的功能。
- `UNRESOLVED`：缺少 Controller、include、数据源或业务确认，禁止猜测。

不要把所有硬编码文案放入 Sanity。按钮、导航和表单校验默认归入 i18n/code；只有真实运营内容才可标 `sanity`。

## 输出工件

写入 `Development_Process/migration/inventory/<page>/inventory.md`。`<page>` 使用稳定 kebab-case 名称，例如 `en-index`、`en-search`。使用下列结构，不删减章节；没有发现时写 `none`。

```md
# P1 Inventory: <page>

## Scope
| Field | Value |
|---|---|
| JSP | <absolute legacy path> |
| Locale | <locale or unknown> |
| Includes scanned | <count> |
| Controller evidence | <path:line or UNRESOLVED> |
| Confidence | high / medium / low |

## Route
| Legacy URL | Method | Parameters | Evidence | Status |
|---|---|---|---|---|

## Includes And Dependencies
| Dependency | Type | Resolved path | Purpose | Evidence |
|---|---|---|---|---|

## SEO And Content Classification
| Element | Current value or source | Classification | Proposed new home | Evidence |
|---|---|---|---|---|

## Forms And Data Calls
| Trigger | Endpoint | Method | Purpose | Migration boundary | Evidence |
|---|---|---|---|---|---|

## Index Candidate
| Candidate | Reason | P2 action | 信息架构建议（照搬 / 调整，理由） |
|---|---|---|---|

## Risks And Blockers
- <TBD-SEO / UNRESOLVED / duplication / permission risk>

## P1 Exit Check
- [ ] All local includes resolved or listed as `UNRESOLVED`.
- [ ] Every route claim has Controller evidence or is `UNRESOLVED`.
- [ ] Every SEO/content element has one classification.
- [ ] Forms and client data calls have a migration boundary.
- [ ] P1 progress snapshot is `completed`, or this P1 has no cross-session snapshot because it was completed in one pass.
- [ ] Information-architecture advice was reverse-checked; if all candidates are `照搬`, `IA counterfactual` is recorded in Risks And Blockers.
- [ ] No Next.js, Sanity schema, redirect or legacy-source change was made.
```

`Index Candidate` 只记录 P1 建议；最终 `IndexDecision` 在 P2 由服务端规则确定。查询结果、账号、支付和后台页面不得在 P1 标记为可收录。

"信息架构建议（照搬 / 调整，理由）"列（2026-07-26 新增，响应 `report-agent-system-gaps.md` §四提案②）：每一行必须显式二选一填写"照搬"或"调整"，并附一句理由——禁止留空或用"同旧站"默认带过。目的是强制在 P1 阶段就回答"这个候选项的结构/位置是否该重排"，而不是隐式地把旧站结构当成默认正确答案（参见该报告 §3.3 对 `url-map.md` 三条"照搬旧站"决策的分析）。"照搬"同样需要给出理由（例如"旧站顺序已符合当前信息架构目标，无需调整"），不能因为判断是"照搬"就省略说明。

**反向复核：**当 `Index Candidate` 有候选项且全部判断为“照搬”时，不得为了通过检查而虚构“调整”。必须在 `Risks And Blockers` 增加一条 `IA counterfactual`：写出至少一个被比较的替代结构/位置、为何不采用，以及仍需产品确认的条件（没有则写 `none` 并说明依据）。该记录用于证明“照搬”是结论而非默认值。

## 完成条件

仅当工件已写入、所有表格均有内容或 `none`、所有结论可追溯到源码证据，并且所有未知项明确列出时，才报告 P1 完成。报告工件路径、`UNRESOLVED` 项和阻塞 P2 的风险；不要给出未经证实的迁移结论。
