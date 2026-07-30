# P4 报告：cn 合并搜索工具与首页任务入口

日期：2026-07-29
范围：`cn-search-tool` 的 P2/P3/P4，以及首页由旧落地页骨架切换为真实工具入口；不迁移旧 JSP 的视觉、文案或素材。

## 结果

`search.jsp` 与 `search_keywords.jsp` 已按同一用户任务合并为一个搜索工具页：输入 ASIN 时展示 ASIN 研究字段，输入关键词时展示关键词研究字段。首页不再采用“Hero → 场景 → 方法 → FAQ → CTA”长落地页结构，而是只保留品牌、核心价值、可提交的工具入口和三项边界说明。

旧站只作为任务、字段、URL 语义和服务边界的证据来源；没有导入旧 DOM、视觉、内容图片或未确认权利素材。全站事实底座见 `migration/mappings/site-context-map.md`，本页的字段和权利边界见 `migration/inventory/cn-search-tool/inventory.md`。

## 实现

- 新增共享 `ReverseAsinQuery` / `ReverseAsinResult` 契约：市场、输入值、模式（ASIN / keyword）和关键词筛选均先经 Zod 校验。
- 新增 `/api/reverse-asin`，仅接入明确标示的本地 Mock adapter；结果区域固定展示“本地 Mock 验证数据，不代表实时查询”，不伪装为生产数据。
- 新增 `/cn/[market]`：保留旧站可见的 `/cn/{market}?q=` URL 语义，支持 US、JP、UK、DE、FR、IT、ES、CA、IN 九个市场；无效市场为 404。
- 新增 `searchToolContent`、`searchToolSeo` Sanity schema，并由前台 Sanity-first + 安全回退消费。当前未向 production 写入新文档，运营可先在 Studio 创建、审阅再发布。
- 首页首屏使用标准 HTML `<form action="/cn/US" method="get">` 将任务直接提交至工具页；工具页用原生输入、状态文本、`<progress>` 与查询完成后的表格提供真实反馈。
- 精简 `homepageContent` 为工具入口和方法说明字段；H1、可见副标题和 SEO metadata 继续只由 `homepageSeo` 管理，避免运营字段双来源。
- sitemap 仅列 `/cn` 与稳定入口 `/cn/US`。`/cn/US`（无查询）可收录；其他市场入口和所有查询 URL 均 `noindex`，canonical 指向 `/cn/US`。
- 视觉实现使用纯色、边框、排版、原生状态反馈和 `prefers-reduced-motion` 兼容交互；本轮未使用渐变、模糊、玻璃拟态或旧站视觉复刻。

## 验证证据

| 检查 | 结果 | 证据 |
|---|---|---|
| 合并任务路由 | PASS | `/cn/US?q=B071J24FNY` 返回 ASIN 模式；关键词输入切换为关键词字段；市场选择保留 `/cn/{market}` 路径。 |
| 数据真实性边界 | PASS | `/api/reverse-asin?market=US&q=B071J24FNY` 返回 `source: "mock"`；UI 和 e2e 均验证显式 Mock 标示。 |
| SEO 路由策略 | PASS | e2e 验证 `/cn/US` 的单 H1/canonical；查询 URL 为 `noindex`；sitemap 仅含 `/cn` 和 `/cn/US`。 |
| 首页任务入口 | PASS | e2e 验证首页仅保留实际可提交的搜索 form，未渲染旧场景/FAQ 落地页骨架。 |
| 端到端回归 | PASS | `pnpm test:e2e`：15/15 通过，含 ASIN、关键词、市场切换、无效市场、移动视口和 SEO 路由。 |
| 类型检查 | PASS | `pnpm typecheck`：contracts、mock adapters、Studio、Web 全部通过。 |
| 生产构建 | PASS | `pnpm build`：Sanity Studio 与 Next 均完成，Next 生成 9 个市场静态工具路由。 |
| 视觉约束 | PASS | 本次范围的 `rg` 扫描未发现 `linear-gradient`、`radial-gradient`、`blur` 或 `backdrop-filter`。 |

## 已知限制与后续条件

- 生产构建期间本机到 `3q1qrst9.api.sanity.io` 的连接超时；读取层按既有设计回退到安全内容，构建未失败。真实 Sanity 已发布内容的运行时消费应在网络可达的环境再次确认。
- 真实搜索接口、账户权限、导出和历史记录仍保持 `exclude`；只有获得后端接口契约与业务授权后，才可替换 Mock adapter。
- 本地通过只能证明抓取、canonical、`noindex`、语义结构和交互资格；Google 实际收录、排名和生成式 AI 引用仍需生产部署、提交 sitemap 后以 Search Console 和真实效果数据验证。
- `searchToolContent` / `searchToolSeo` 现在已可在 Studio 建档；第一份生产内容须按“字段来源 → 前台消费位置 → 发布后确认”的运营流程审阅，避免把未消费配置当作完成。

## 2026-07-30 Taste-informed redesign verification

### Design Read and dials

- **首页**：面向需要从一个商品或需求迅速开始研究的亚马逊卖家；采用“可信、克制、任务密度适中”的研究入口语言。DESIGN_VARIANCE=6、MOTION_INTENSITY=3、VISUAL_DENSITY=5。
- **搜索工具页**：面向已准备好输入 ASIN 或关键词、需要确认研究对象与读取字段的操作者；采用“可信、低装饰、高数据密度”的研究工作台语言。DESIGN_VARIANCE=5、MOTION_INTENSITY=3、VISUAL_DENSITY=7。

### Structural replacement

- 首页不再把大 Hero、均分说明卡和 CTA 当作产品本体：首屏并列呈现 H1、输入/识别/下一步的任务线索，以及可输入、可选择市场、可实时识别 ASIN/关键词的标准 HTML form。提交仍保留 /cn/{market}?q= 契约。
- 搜索工具页从“标题 + 表单 + 三张方法卡”改为研究工作台：左侧是当前市场、任务状态、三步协议和 Mock 边界；右侧是查询、输入识别、关键词筛选和输出区域。所有动态变化均绑定输入、加载、错误或结果状态。
- Sanity 仍拥有 homepageSeo 的 H1/副标题与 metadata，homepageContent/searchToolContent 仍拥有运营提示和方法说明；这次视觉重构没有创建重复字段或改变发布边界。

### Anti-Slop result

| Check | Result | Evidence |
|---|---|---|
| 任务优先而非海报 | PASS | 首页第一屏存在可提交的研究 form；工具页的查询与结果工作区为主视觉。 |
| 反卡片同质化 | PASS | 方法说明改为连续的协议轨/边界线，不再以三张同尺寸白卡表达全部内容。 |
| 中文排版 | PASS | 收紧首页与工具页的展示标题，使输入区在桌面首屏保持同等优先级；390px 宽度无横向溢出。 |
| 有意义的动效 | PASS | 仅对输入识别/加载状态使用 signal-breathe 与原生 progress；支持 prefers-reduced-motion。 |
| 真实性 | PASS | Mock 结果和未接入能力继续明确标注，未新增客户、数据量、实时能力或库存主张。 |
| 视觉边界 | PASS | 本次页面文件扫描未发现 gradient、blur 或 backdrop-filter。 |

### Validation

- pnpm typecheck：通过。
- pnpm test:e2e：15/15 通过（本地 next dev 使用单 worker，避免并发路由编译导致流式 metadata 的开发态竞态）。
- pnpm build：通过；Studio 仍有既有的 styled-components 版本兼容警告与 Sanity v4/Node 20 升级提示，未阻断构建。
- 本地 HTTP：http://localhost:3000/cn 在构建后重启返回 200。
