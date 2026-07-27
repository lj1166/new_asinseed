# Track B Backlog：人工文章发布与后续自动化

> 状态：暂停。此文件只登记任务与解锁条件，不授权自动发布、真实生产内容变更或绕过 HITL。

## 解锁条件

- 迁移 Stage 1：`index.jsp` 与合并后的 `search.jsp` / `search_keywords.jsp` 均完成 P4。
- 质量门槛：相关页面的 SEO/GEO 审计不存在未解决 FAIL。
- 业务能力：人工文章发布闭环先通过 `specs/content-automation-architecture-draft.md` §5 验收。

## 恢复后顺序

1. **人工文章发布闭环**：扩展 `ContentEntry`、Studio 人工创建/审核、Next.js 文章列表/详情、metadata/JSON-LD/sitemap；先不接 AI。
2. **Studio 运营视图**：为 `ContentEntry`、`KeywordEntry`、`MaterialAsset` 建立按 `workflowState` 的结构视图；不要预装第三方 workflow 插件。
3. **权限 Gate**：实现并测试 Agent 身份不能推进 `approved`、不能 publish、不能创建/修改 Content Release。
4. **Content Release 设计**：明确 Release 命名、文档版本、人工最终发布人和失败处理边界；先出设计再接 API。
5. **受控 AI Draft**：仅在人工闭环稳定后增加关键词/Brief → Draft 的入口；不得绕过审核和人工发布。

## 当前不做

- 自动 publish、自动创建/修改 Content Release。
- 把模型密钥、Developer Token 或 MCP 配置写入网站代码。
- 在未解除质量门槛前批量生产文章。
