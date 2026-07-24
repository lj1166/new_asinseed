# P4 验收报告 · 试点页 `index.jsp`（cn `/cn` → `/zh-cn`，en `/en` → `/en`）

- 验收依据：`D:\asinseed重构\prd-docs\prompts\00_migration_loop_master_prompt.txt` §2.3 统一验收器十项（该文件位于 `new_asinseed/` 仓库外的 `prd-docs/`，与 `Development_Process/DECISIONS.md` D-002 记录的目录布局一致，不是本仓库缺失文件——此前一度误以为它该在仓库内的 `prd-docs/prompts/`，已核实并更正）。
- 范围：本报告仅覆盖 Stage 1 试点中的 `index.jsp`（首页）。主提示词 §7 Stage 1 把 `index.jsp` 与 `search.jsp`（结果页）列为两个独立试点页；本报告不覆盖 `search.jsp`。
- 结论：**十项中 8 项直接 PASS，2 项（第4、第10项）因页面类型不适用而标注 N/A（不计入失败）**，另有 1 项已知、已披露的可接受风险（FAQ 占位内容）。判定：**试点页验收通过**，无违反 §2.4 HITL 硬门禁的改动。

## 逐项打分

| # | 验收项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 铁则1：非 JSP DOM 复刻，语义 HTML，单一 H1 | ✅ PASS | `apps/web/app/[locale]/page.tsx:48` 唯一 `<h1>`；其余标题为 `<h2>`（extension/video/partners/faq）、`<h3>`（feature 卡片），非表格/多层 `<div>` 复刻旧 JSP DOM，改用 shadcn/ui `Button`/`Input` 等组件重构 |
| 2 | 铁则2：无冗余 Sanity 字段；hardcode 未误入库 | ✅ PASS | `packages/contracts/src/homepage.ts` 仅两个 schema（FAQ、testimonial），字段均为页面实际渲染字段；hero/features/extension/video/partners/stations 均保持 hardcode（`apps/web/lib/homepage-content.ts`），未为"以后可能要改"新增字段——`url-map.md` P2 决策明确记录了这一取舍 |
| 3 | 铁则3：可索引页 SEO 全部来自 Sanity/DTO | ✅ PASS | `generateMetadata`（`page.tsx:20-36`）读取 `HOMEPAGE_COPY`/`copy.pageTitle` 等结构化 DTO，非 JSX 内联字面量；P1 阶段已将 `<title>` 显式归类为 "hardcode"（`inventory/en-index/inventory.md:43`），主提示词允许 "Sanity **或** DTO"，非"仅 Sanity" |
| 4 | IndexDecision：普通查询结果 noindex 且不在 sitemap | N/A（页面类型不适用） | `index.jsp` 是品牌入口页非查询结果页；`url-map.md` IndexDecision 表显示 `/zh-cn`、`/en` 均为 `index:true, inSitemap:true`，与"static-content"分类一致，该项针对的是 `search.jsp` 类结果页 |
| 5 | URL 资产：高价值旧 URL 有一跳映射草案；禁止全集首页 301 | ✅ PASS | `url-map.md` URL Map 表：`/cn→/zh-cn`、`/en→/en` 均为直接一跳改名，非重定向到集合首页；hreflang/canonical/x-default 与旧 `languages.jsp:16-18` 行为一致 |
| 6 | 关键词/核心业务 CTA/功能逻辑无静默丢失 | ✅ PASS | hero/features/extension/video/testimonials/partners/FAQ 联系方式逐 locale 完整保留，含刻意保留的 en/cn 不对称项（如 en 第4条 extension bullet、cn 独有的第5条 video bullet）；唯一未恢复项（hot-ASIN 注释块）已在 `url-map.md` 写明书面结论，非静默丢弃 |
| 7 | GROQ/首屏：无全表拉取；装饰资源未阻塞 | ✅ PASS | `apps/web/lib/homepage-data.ts` 两条 GROQ 均为最小字段投影（无 `*` 全文档拉取）；浏览器验证确认非首屏图片走 `next/image` 懒加载（`complete:false` 但 `fetch()` 直接探测均返回 200，非损坏资源） |
| 8 | 权限：无自动 publish；无密钥入库 | ✅ PASS | 仓库仅含 `apps/web/.env.local.example`，真实 `.env.local` 被 `.gitignore` 排除；`lib/sanity-client.ts` 未配置环境变量时返回 `null`，全程只有 `client.fetch` 读操作，无 write/publish 调用 |
| 9 | 数据层：业务路径走 Mock；无未授权真实后端调用 | ✅ PASS | `apps/web/app/api/suggestions/route.ts` 使用 `MockSuggestionProvider`（`packages/mock-adapters/src/suggestions.ts`），固定小型虚构 fixture，非爬取/编造的"真实"数据；零 Java/Dubbo 后端调用 |
| 10 | Handoff CTA：结果页仅一主一次 CTA；域名 allowlist | N/A（页面类型不适用） | `index.jsp` 非结果页；主提示词 §3 明确把 `sellersprite.com` 硬编码 CTA 问题定位在 `search.jsp`。本页 extension CTA 指向站内 `/en|cn/extension`；FAQ 的 API 文档链接是历史文档引用而非任务型 Handoff CTA，其 URL 归属已在 `url-map.md` 作为 P2 决议单独核实解决，不属本项范围 |

## 已知、已披露的可接受风险（非阻断项）

- **FAQ 内容为占位文本**：`apps/web/lib/homepage-content.ts` 底部 `HOMEPAGE_FAQ_SEED` 显式标注 `[占位内容]`/`[Placeholder]`，并附注释说明真实问答来自旧后台 `tips` 表（数据库字段），无法从静态 JSP 提取。按"无凭空捏造"原则，此处选择诚实占位而非编造问答内容。**不阻断本次试点验收**，但在正式收录/上线前需要补齐真实内容（来源：迁移 `tips` 表数据或由内容运营在 Sanity `homepageFaqEntry` 中补录）。

## HITL 复核

本轮 P3 全部改动均为本地、可逆、未接触生产内容/真实用户支付/旧后端/线上流量、无不可恢复删除——不触发主提示词 §2.4 的任何硬门禁，无需额外人工审批即可放行试点。

## 试点结论与下一步

试点页 `index.jsp`（cn + en 两个 locale）P1→P2→P3→P4 全链路验证通过。按主提示词 §7，试点未绿禁止进入 Stage 2；本页已绿，但 Stage 1 完整定义还包含 `search.jsp`（结果页）尚未开始迁移——进入 Stage 2 批量分组前，仍需完成 `search.jsp` 的 P1-P4 以覆盖 Handoff CTA（第10项）等本报告标记为 N/A 的验收维度。
