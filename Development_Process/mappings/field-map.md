# 字段地图 —— 旧数据字段 ↔ 新 Sanity 字段 / 硬编码决策

跨页面汇总的字段归类，随各页面的 P1/P2 工作逐步填充。逐页细节见 `../migration/inventory/<page>/inventory.md`。归类词汇与 master prompt §2.2 一致：`sanity` | `hardcode` | `TBD-SEO`。

| 旧字段（JSP/DAO 来源） | 出现于哪些页面 | 归类 | 新 Sanity 字段（若有） | 备注 |
|---|---|---|---|---|
| `station.countryCode` / 市场选择 | `cn/search.jsp:121-140`; `cn/search_keywords.jsp:121-140` | `hardcode` | 无 | 合并工具的受控市场枚举；国旗图片不作为新素材迁移。 |
| `q` / `entity.asin` | `cn/search.jsp:143-146`; `cn/search_keywords.jsp:143-147`; `SearchAsinController.java:98-132` | `hardcode` | 无 | 一个任务输入；由输入形态决定 ASIN 或关键词结果视图。 |
| `supplement` / `exactMatch` | `cn/search_keywords.jsp:100-101,193-200`; `SearchAsinController.java:101-102,717-725` | `hardcode` | 无 | 关键词模式的可选查询条件，不属于运营内容。 |
| `keywords`、`searches`、`hot` | `cn/search.jsp:218-330` | `hardcode` | 无 | ASIN 反查结果 DTO 字段；当前仅由明确标注的 Mock adapter 提供。 |
| `trends`、`month`、`products`、`purchases`、`purchaseRate` | `cn/search_keywords.jsp:225-365` | `hardcode` | 无 | 关键词结果 DTO 字段；真实趋势/交易指标未获接入批准。 |
| 工具入口 H1、摘要、`title`、description、OG | 新站原创；旧动态 title `cn/search.jsp:9`、`cn/search_keywords.jsp:9` 仅作风险证据 | `sanity` | `searchToolContent` / `searchToolSeo`（P2 待建） | 稳定无 `q` 工具入口才消费；查询状态不由 Sanity 生成。 |
| 旧动态结果 title、计数、产品标题 | `cn/search.jsp:9,164-173`; `cn/search_keywords.jsp:9,166-173` | `TBD-SEO` | 无 | 带 `q` 查询结果默认 `noindex`，不得以动态数据批量生成可收录页面。 |
| 背景/视频/国旗/Amazon 商品图 | `cn/search.jsp:95,115,391-394,466`; `cn/search_keywords.jsp:93,115,282` | `UNRESOLVED` | 无 | 未有授权/时效证据，默认不迁移。 |
