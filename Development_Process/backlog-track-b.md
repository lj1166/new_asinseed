# Track B Backlog：人工文章发布与后续自动化

> 状态：暂停。此文件只登记任务与解锁条件，不授权自动发布、真实生产内容变更或绕过 HITL。

## 解锁条件

- 迁移 Stage 1：`index.jsp` 与合并后的 `search.jsp` / `search_keywords.jsp` 均完成 P4。
- 质量门槛：相关页面的 SEO/GEO 审计不存在未解决 FAIL。
- 业务能力：人工文章发布闭环先通过 `specs/content-automation-architecture-draft.md` §5 验收。

## 恢复后顺序

1. **人工文章发布闭环**：先统一 `ContentEntry` 的 Zod 契约与 Studio `body` 表达（当前 `string` 与 Portable Text array 不一致），再扩展 Studio 人工创建/审核、Next.js 文章列表/详情、metadata/JSON-LD/sitemap；先不接 AI。
2. **Studio 运营视图**：为 `ContentEntry`、`KeywordEntry`、`MaterialAsset` 建立按 `workflowState` 的结构视图；不要预装第三方 workflow 插件。
3. **权限 Gate**：实现并测试 Agent 身份不能推进 `approved`、不能 publish、不能创建/修改 Content Release。
4. **Content Release 设计**：明确 Release 命名、文档版本、人工最终发布人和失败处理边界；先出设计再接 API。
5. **受控 AI Draft**：仅在人工闭环稳定后增加关键词/Brief → Draft 的入口；不得绕过审核和人工发布。

## 内容 SEO/GEO MVP 字段分流（2026-07-28）

> 来源：元数据内容模型评估。原则：字段必须在同一批次拥有“来源 → 前台消费 → fallback → P4 证据”；不为未来文章预写未消费 schema。

### Track B 解锁后、人工文章闭环内实施

| 能力 | 最小实现 | 不做 / 约束 |
|---|---|---|
| Article JSON-LD | 从已发布文章真实标题、summary/quickAnswer、作者、发布日期、封面和 Sanity `_updatedAt` 服务端生成 | 不提供运营手填任意 JSON-LD；`HowTo` 仅在有结构化步骤时输出，不以字符串下拉伪造类型 |
| 多语言 hreflang | `locale` 必填；同一文章的译文以明确 reference/稳定翻译组关联，按已发布版本生成 alternate links | 不自动翻译；没有真实译文时不输出另一语言 hreflang |
| GEO quick answer | `quickAnswer` 选填、≤300 字；页面首屏/正文以可见文本输出，Article description 优先使用它、为空回退 summary | 不仅写入 JSON-LD 而不在页面呈现；不让 AI 草稿绕过人工审核 |
| 内容维护信号 | 使用 Sanity 系统 `_updatedAt`；仅在运营确有审核节奏后增加 `lastReviewedAt` / `nextReviewDue` | 不复制 `dateModified` 字段，不做 cron 或自动到期工作流 |

### 有真实资料后再做

| 能力 | 前置条件 |
|---|---|
| Organization logo / description / sameAs | 用户提供可使用的品牌 Logo、准确描述与可验证官方身份链接；前端再扩展 Organization JSON-LD |
| SEO 长度提示 | 运营明确需要搜索结果预览后，在现有 `seo` object 增加轻量自定义输入或可见长度提示；保持 title/description 单一来源 |
| 分类、相关文章、文章模板 | 人工文章列表/详情已上线且有足够正式内容；标签须为受控文档/reference，不继续使用无治理自由文本 |

### 当前不做

- 字段填写率仪表盘、批量操作、自动内容生命周期、A/B 测试、竞品监控、AI 自动翻译。
- Schema 迁移脚本：仅在真实字段更名/数据迁移发生时按需创建。

## 当前不做

- 自动 publish、自动创建/修改 Content Release。
- 把模型密钥、Developer Token 或 MCP 配置写入网站代码。
- 在未解除质量门槛前批量生产文章。
