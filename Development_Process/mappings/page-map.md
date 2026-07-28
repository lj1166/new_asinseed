# 页面组合地图 —— 旧 JSP 分类 ↔ 新站候选页面与排期

> 批次 0 全站轻扫描，完成于 2026-07-28。此表是组合层规划，不是 P1 inventory、URL 迁移表或自动收录决定。旧 URL、HTTP method、参数、Controller 映射与精确字段均须在具体页面 P1 中另行取证；未知项保持 `UNRESOLVED`。

## 扫描范围与规则

- 范围：旧站 `jsp/cn/__frontend` 与 `jsp/en/__frontend` 的公开 JSP，加上 `jsp/cn/coupon/activity.jsp`；后台 `jsp/admin` 仅目录级归类。
- 发现：77 个前台 JSP + 1 个中文优惠活动 JSP；其中 `module-trend.jsp` 是由 `search.jsp` / `search_keywords.jsp` include 的局部模块，不是独立页面（`en/search.jsp:85`、`en/search_keywords.jsp:93`、`cn/search.jsp:90`、`cn/search_keywords.jsp:87`）。因此本表覆盖 76 个候选路由 JSP 与 49 个后台 JSP。
- 轻扫描证据只包含路径、`<title>`、局部表单/入口；未递归 include、未读取 Service/Dao、未宣称未验证路由。
- 主页面角色仅选一个：品牌首页、产品/功能、转化落地、内容引流、任务工具、信任/支持、账户/交易、后台。业务域与功能域可多选。
- 候选处置不是执行授权：`rebuild`（按新站重构）、`merge`（并入一个新页面）、`replace`（由新内容/页面替代）、`exclude`（不迁移/不收录）、`UNRESOLVED`（需 P1 或业务确认）。

## 旧站页面组分类

| 页面组与 locale 覆盖 | 旧 JSP（相对 `jsp/`） | 业务域 | 功能域 | 主页面角色 | 候选处置 / 新站定位 | 收录与建议批次 | 轻扫描证据与置信度 |
|---|---|---|---|---|---|---|---|
| 首页 | `cn/en/__frontend/index.jsp` | 品牌、产品入口 | 价值说明、工具入口、跨站导流 | 品牌首页 | `rebuild` 为品牌信任 + 核心任务入口；现有试点需按 D-013 重新 Brief 后再改造 | 核心商业词；批次 1 | 两 locale title：`cn/index.jsp:9`、`en/index.jsp:9`；P4 已完成；高 |
| ASIN 反查结果 | `cn/en/__frontend/search.jsp` | 产品研究 | 输入查询、结果展示 | 任务工具 | `rebuild`；与关键词结果组成一个核心工具流 | 默认 `noindex` 候选，P1/P2 决定；批次 1 | 动态结果 title：`cn/search.jsp:9`、`en/search.jsp:9`；含局部趋势模块；高 |
| 关键词结果 | `cn/en/__frontend/search_keywords.jsp` | 关键词研究 | 输入查询、结果展示 | 任务工具 | `merge` 到同一核心工具流，但保留不同任务/字段语义 | 默认 `noindex` 候选，P1/P2 决定；批次 1 | 动态结果 title：`cn/search_keywords.jsp:9`、`en/search_keywords.jsp:9`；高 |
| 趋势弹层模块 | `cn/en/__frontend/module-trend.jsp` | 产品研究 | 局部交互/趋势展示 | 不适用（include） | `merge` 为工具页组件，非路由 | 不独立收录；随批次 1 | 搜索页 include 证据见范围；高 |
| 热门 ASIN 程序化页 | `cn/en/__frontend/seo/hot/{us,jp,gb,de,fr,it,es}/hot.jsp`（14 文件） | 产品研究、SEO | 市场/类目浏览、反查入口 | 内容引流 | `UNRESOLVED`；先设计真实的数据覆盖、去重、质量阈值与 IndexDecision，再决定是否作为程序化内容集群 | 当前不得自动纳入收录；批次 5 之后 | 标题在两 locale 及各市场副本重复为 Appliances Hot Listing：如 `en/seo/hot/us/hot.jsp:9`；表单：`:130`；高 |
| 价格入口 | `cn/en/__frontend/price.jsp` | 商业转化、订阅 | 定价说明、CTA | 转化落地 | `rebuild` 为单一商业页；支付执行不在本站实现 | 核心商业词；批次 2 | price title：`cn/price.jsp:9`、`en/price.jsp:9`；高 |
| 价格/支付 FAQ | `cn/en/__frontend/faq-price.jsp` | 商业转化、支持 | 异议处理、支付说明 | 信任/支持 | `merge` 入定价页或独立 billing FAQ，取决于真实支持内容 | 可收录性待 Brief；批次 2 | 支付标题：`cn/faq-price.jsp:9`、`en/faq-price.jsp:9`；中 |
| Stripe 订阅/支付 | `cn/en/__frontend/stripe-subscription.jsp`、`en/__frontend/stripe-payment.jsp` | 交易 | 订阅、支付表单 | 账户/交易 | `exclude`；真实支付由目标平台/独立系统承担 | `noindex`；不进入迁移批次 | Stripe 表单：`cn/stripe-subscription.jsp:183`、`en/stripe-payment.jsp:182`；高 |
| 优惠券大厅 | `cn/coupon/activity.jsp` | 交易、权益 | 领券、资格查询 | 账户/交易 | `exclude`，除非后续有可验证的权益系统与业务批准 | `noindex`；不进入迁移批次 | 页面 title：`cn/coupon/activity.jsp:8`，AJAX：`:328`；中 |
| 浏览器插件 | `cn/en/__frontend/extension.jsp` | 产品能力、集成 | 安装/升级说明 | 产品/功能 | `rebuild` 为 integration/extension 页面；内容需重新创作并确认下载/支持事实 | 商业/集成词；批次 2 | 标题/H1：`cn/extension.jsp:9,33`、`en/extension.jsp:9,34`；高 |
| 产品视频 | `cn/en/__frontend/introduce-video.jsp` | 品牌信任、产品教育 | 演示说明 | 信任/支持 | `merge` 入首页、产品页或资源中心；不默认保留独立页 | 不独立排期 | 标题/H1：`cn/introduce-video.jsp:9,34`、`en/introduce-video.jsp:9,33`；高 |
| 使用指南 | `cn/en/__frontend/guide.jsp` | 内容、产品教育 | 使用说明 | 内容引流 | `merge` 到新文档/资源中心；先确认是否有真实、可维护内容 | 教程长尾；批次 3 | 两 locale title：`cn/guide.jsp:9`、`en/guide.jsp:9`；中 |
| 帮助/联系 | `cn/en/__frontend/help.jsp` | 支持、信任 | 联系与帮助入口 | 信任/支持 | `rebuild` 为支持/联系页；避免照搬旧视觉 | 信任与支持词；批次 3 | title：`cn/help.jsp:9`、`en/help.jsp:9`；英文内容含联系信息：`en/help.jsp:38-60`；高 |
| 流量关键词帮助 | `cn/en/__frontend/help-traffic-keywords.jsp` | 产品教育、内容 | 功能解释 | 内容引流 | `merge` 到工具教程/知识库，或作为高质量独立指南 | 任务型长尾；批次 3 | title：`cn/help-traffic-keywords.jsp:9`、`en/help-traffic-keywords.jsp:9`；中 |
| 通用 FAQ | `cn/en/__frontend/faq.jsp` | 支持、信任 | 问答、异议处理 | 信任/支持 | `rebuild` 为真实 FAQ 模块；仅真实问答才输出 FAQPage JSON-LD | FAQ/品牌词；批次 3 | title：`cn/faq.jsp:9`、`en/faq.jsp:9`；中 |
| 博客列表/文章详情 | `cn/en/__frontend/bbs/article-list.jsp`、`article-view.jsp` | 内容增长 | 列表、文章阅读 | 内容引流 | `rebuild` 为资源中心 + 文章详情；是人工发布和后续内容自动化的前台目标 | 长尾/GEO 主战场；批次 3，受 Track B 解锁约束 | 列表 title：`cn/en/bbs/article-list.jsp:9`；详情动态 title：`cn/en/bbs/article-view.jsp:9`；高 |
| 帮助文章详情 | `cn/en/__frontend/bbs/help-view.jsp` | 内容、支持 | 知识库文章阅读 | 内容引流 | `merge` 到同一文章/知识库内容模型，按内容类型区分 | 长尾/GEO；批次 3 | 动态 title：`cn/en/bbs/help-view.jsp:9`；高 |
| 消息列表/详情 | `cn/en/__frontend/bbs/msg-list.jsp`、`msg-view.jsp` | 账户 | 通知阅读 | 账户/交易 | `exclude` | `noindex`；不进入迁移批次 | Notifications/个人中心 title：`cn/en/bbs/msg-list.jsp:8`、`msg-view.jsp:8`；高 |
| 条款与隐私 | `cn/en/__frontend/terms.jsp`、`privacy.jsp` | 合规、信任 | 法律信息 | 信任/支持 | `rebuild` 为最小合规页；内容须人工确认，不从旧文案直接复用 | 通常可收录；批次 4 | title：`cn/en/terms.jsp:9`、`privacy.jsp:9`；高 |
| 登录、注册、找回、绑定 | `cn/__frontend/{signin,signin-bind,signup,forgot}.jsp`；`en/__frontend/{signin,signup,forgot}.jsp` | 身份 | 认证、账户恢复 | 账户/交易 | `exclude`；当前新站不接真实身份 | `noindex`；不进入迁移批次 | title：如 `cn/signin.jsp:9`、`en/signup.jsp:8`；高 |
| 机器人检查 | `cn/en/__frontend/robot.jsp` | 身份/风控 | 人机验证 | 账户/交易 | `exclude` | `noindex`；不进入迁移批次 | Robot Check title 与 POST/AJAX：`cn/robot.jsp:11,40,96`、`en/robot.jsp:10,39,95`；高 |
| 用户中心与权益 | `cn/__frontend/me/{settings,plan,plan_order_list,subscription-me,log,password,my_coupon}.jsp`；`en/__frontend/me/{settings,plan,plan_order_list,subscription-me,log,password}.jsp` | 账户、权益、历史 | 设置、订阅、订单、记录、密码、优惠券 | 账户/交易 | `exclude`；真实身份/权益接入获批前不迁移 | `noindex`；不进入迁移批次 | 各页 title：如 `en/me/settings.jsp:8`、`cn/me/log.jsp:8`；高 |
| 后台管理 | `admin/**`（49 JSP：dashboard、user、subscription、report、promote、plan、payment、log、env、cms 等） | 内部运营 | 管理、支付、内容后台 | 后台 | `exclude`；Sanity Studio 不是旧 admin 的视觉迁移 | 不收录；不进入迁移批次 | 目录级文件枚举；未读 Controller/页面内容；高（范围）、低（业务细节） |

## 新站候选页面组合与批次计划（待人工确认）

| 批次 | 目标页面组合 | 旧站来源（可多对一） | 本批目的 | 依赖 / 不做事项 |
|---|---|---|---|---|
| 0（已完成） | 页面组合地图与候选排期 | 全部公开页面组 + 后台范围 | 决定“重构/合并/排除”，不以 JSP 文件顺序排期 | 不创建路由、Schema 或前端 |
| 1 | 品牌首页重构 Brief + 核心搜索工具流 | 首页；`search`、`search_keywords`、`module-trend` | 建立品牌信任、主 CTA 与真实任务流的两个范例 | 首页现有 P4 不等于最终设计；搜索 P1 后必须等待 Brief 确认；结果页默认不收录候选 |
| 2 | 商业产品/功能模板 | price、faq-price、extension、introduce-video | 建立产品能力、集成、商业 CTA 与信任信息的可复用模板 | 真实支付/订阅页面继续排除；产品事实、下载链接和定价须人工确认 |
| 3 | 资源中心与人工内容发布模板 | article-list/view、help-view、guide、help-traffic-keywords、faq、help | 建立长尾收录、内链、文章/知识库与运营发布闭环 | Track B 仍须满足 Stage 1 P4 + Layer C 无 FAIL；先人工发布，不启动批量生成 |
| 4 | 信任与合规补齐 | terms、privacy；可新增经确认的关于/方法论/数据来源页 | 完成实体可信度与底部信息架构 | 新增页面内容必须有可验证业务资料，不能根据旧站或模型臆造 |
| 5 | 程序化内容集群评估 | `seo/hot/**` | 仅在数据质量、重复度、模板价值、收录收益经验证后，设计可索引的市场/类目内容集群 | 不自动迁移 14 个复制页，不自动进入 sitemap/索引 |

## 批次 1 确认项

在开始 `search` / `search_keywords` 完整 P1 前，需由负责人确认：

1. 首页是否按“品牌信任 + 工具入口”重新打开 D-013 Brief，而不是在现有试点上小修。
2. 批次 1 是否以“首页重构 Brief + 搜索工具流 P1”作为唯一范围。
3. 新站主 CTA 是否继续只导向 `sellersprite.ai`，以及搜索工具是否保留在 AsinSeed 前台完成输入与结果展示。
4. 批次 2 的商业页面是否允许展示真实定价/插件下载；若没有经过确认的事实来源，先只做页面结构和占位决策，不写营销承诺。

## 本次扫描的已知风险

- 轻扫描未证明旧 URL、Controller method、参数、权限或数据形状；任何具体路由结论必须等 P1。
- `seo/hot` 各 locale/国家文件 title 在扫描样本中相同，存在重复内容风险；不得因目录名含 `seo` 就默认收录。
- 前台博客/帮助页只能证明旧站存在内容展示页，不能证明内容质量、版权或可迁移性；新文章与素材仍需按事实来源和运营策略重建。
- 后台、账号、支付与权益明确不属于当前新站迁移范围；不得因“页面已枚举”而扩大授权。
