---
name: jsp-page-inventory
description: 在迁移任一旧 JSP 页面前的 P1 阶段使用。只读扫描 JSP、递归 include、关联 Controller 和前端请求，产出带源码证据的固定 inventory 工件，供 P2 契约、URL Map 与 IndexDecision 使用；尚未完成 inventory 时不得编写 Next.js 页面。
---

# JSP 页面盘点

为一个 JSP 页面生成可复核的 P1 inventory。旧站 `../原网站代码asinseed/` 始终只读；不得编写 Next.js、Sanity schema、redirect 或修改旧站文件。

## 输入与读取

1. 确认目标 JSP、locale 和已知旧 URL；未知 URL 不得猜测。
2. 读取目标 JSP，递归解析本地 `<jsp:include>` 与 `<%@ include %>`。记录每个实际文件；遇到循环或无法解析的路径，写入 `UNRESOLVED`。
3. 搜索相关 Spring Controller 的 mapping。只有 Controller 源码能证明路由、HTTP method 或路径参数；仅从 JSP 推断的内容标为 `UNRESOLVED`。
4. 提取表单、AJAX/fetch、静态资源、SEO 标签、JSON-LD、可见文案和服务端变量。每项均附 `文件路径:行号` 证据。

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
| Candidate | Reason | P2 action |
|---|---|---|

## Risks And Blockers
- <TBD-SEO / UNRESOLVED / duplication / permission risk>

## P1 Exit Check
- [ ] All local includes resolved or listed as `UNRESOLVED`.
- [ ] Every route claim has Controller evidence or is `UNRESOLVED`.
- [ ] Every SEO/content element has one classification.
- [ ] Forms and client data calls have a migration boundary.
- [ ] No Next.js, Sanity schema, redirect or legacy-source change was made.
```

`Index Candidate` 只记录 P1 建议；最终 `IndexDecision` 在 P2 由服务端规则确定。查询结果、账号、支付和后台页面不得在 P1 标记为可收录。

## 完成条件

仅当工件已写入、所有表格均有内容或 `none`、所有结论可追溯到源码证据，并且所有未知项明确列出时，才报告 P1 完成。报告工件路径、`UNRESOLVED` 项和阻塞 P2 的风险；不要给出未经证实的迁移结论。
