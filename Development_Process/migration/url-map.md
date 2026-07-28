# URL Map / IndexDecision（P2 累积产物）

本文件按 P2 契约阶段逐页累积写入，不按页拆分为多个文件——URL 映射与 IndexDecision 需要跨页面横向比对（互相 hreflang 指向、canonical 唯一性），拆散到每页目录反而不便核对。首条记录来自 `index.jsp`（试点首页），后续每完成一页 P2 就在下方追加，不改写已有行。

## 当前生效契约（D-015，2026-07-28）

负责人确认采用“底座先行、简中先验收”的发布顺序。当前唯一启用且可收录的语言是简体中文 `cn`；繁中、英、法、德、意、西、日、越南、马来仅在共享语言注册表中预留，尚不生成页面、hreflang、导航入口或 sitemap URL。

| Legacy URL | New URL | 状态 | Canonical | Hreflang | 处置 |
|---|---|---|---|---|---|
| `/cn` | `/cn` | active / indexable | self (`/cn`) | 单语言阶段不输出 | 路径原样保留，无需 301 |
| `/en` | `/en` | reserved / not yet served | 仅启用后生成 | 仅启用后生成 | 保留一一对应目标；不得暂时跳转到 `/cn` 或首页 |

启用任一预留语言的 P4 前置条件：已完成该语言本地化内容、Studio locale 选项、路由/导航、canonical/hreflang、sitemap 与浏览器/HTTP 回归验证。若确需修改已知旧 URL，必须先获得线上 URL 变更批准，并在本表记录唯一的等价目标与单跳 301 理由。

## 历史首轮 P2 记录（已被 D-015 取代，不作为当前实现依据）

### URL Map

| Legacy URL | New URL | Locale | Canonical | Hreflang alternates | 迁移方式 | 证据 |
|---|---|---|---|---|---|---|
| `/cn` | `/zh-cn` | zh-cn | self (`/zh-cn`) | `en`→`/en`, `x-default`→`/en` | 一跳映射（非 301 到集合首页，是同语义页面的直接改名） | `Development_Process/migration/inventory/cn-index/inventory.md` Index Candidate |
| `/en` | `/en` | en | self (`/en`) | `zh-cn`→`/zh-cn`, `x-default`→`/en` | 路径不变，locale 语义与 zh-cn 侧对齐 | `Development_Process/migration/inventory/en-index/inventory.md` Index Candidate |

x-default 选 `/en` 而非 `/zh-cn`：与旧站 `languages.jsp:16-18` 生成的 hreflang 集合行为一致（en 是面向国际流量的默认版本），非新引入的决策。

### IndexDecision 表

沿用 `packages/contracts/src/index-decision.ts` 的 `IndexDecisionSchema`（`index: boolean`, `reason: enum`, `inSitemap: boolean`）。

| Page | index | reason | inSitemap | 备注 |
|---|---|---|---|---|
| `/zh-cn`（原 `/cn`） | true | `static-content` | true | 品牌入口页，非查询结果/账号/支付页 |
| `/en` | true | `static-content` | true | 同上，是 `/zh-cn` 的 hreflang 互指目标 |

## P2 内容归属决策（原 P1 Risks 中标记为"待 P2 决策"的三项，书面结论）

以下三项均属本地、可逆、未上线的草稿内容决策，按主提示词 §2.4 HITL 规则（仅生产内容/真实用户支付旧后端/线上 URL 流量/不可恢复删除需人工批准）不在批准硬门禁范围内，由本轮 P2 直接给出结论并记录，后续如产品方有不同意见可随时改写：

1. **hot-ASIN 注释块（cn/en `index.jsp:92` 均为注释状态）——结论：不恢复。** 该链接在两个 locale 均已被现网运营主动注释掉，且未见任何产品/运营侧要求恢复的证据；按"零冗余字段/无凭空捏造"原则，P3 不复刻这段注释文案、不新增对应 Sanity 字段或链接。若未来产品方希望恢复，需重新提出新的具体需求，而非从旧注释里静默复活。

2. **testimonials 数量不一致（cn 4 条 / en 3 条）——结论：升级为 sanity 管理，两个 locale 各自独立维护列表，不强制数量对齐。** 已在 `packages/contracts/src/homepage.ts` 新增 `HomepageTestimonialEntrySchema`（含 `locale` 字段）与对应 Sanity 文档类型 `homepageTestimonialEntry`。这样运营可按 locale 独立增删客户评价，不存在"必须凑成一样数量"的人为约束——3 vs 4 的历史差异本身不是缺陷，只是内容运营节奏不同步，交给内容运营在新系统里按需补齐即可，不由代码层强制。

3. **footer "HOT ASIN" 链接仅 en 有（`en/base/footer.jsp:34` → `/en/hot/US`），cn footer 无对应项——结论：新站两个 locale 均不迁移此链接。** 该链接指向的是 P1 已标记为 `TBD-SEO-programmatic` 的 `seo/hot/{market}/hot.jsp` 系列页面（见主提示词 §3：程序化 SEO 风险页，本期试点不纳入收录范围，需经内容质量门评估）。既然目标页面本身本期不迁移/不收录，链接自然也不迁移，不存在"该给 cn 补上还是从 en 去掉"的选择问题——两侧同步去掉，等 `seo/hot/*` 系列在未来批次通过质量门评估后，再统一为两个 locale 补上对称的内链，而不是现在延续这处历史上的单侧遗留。

## 未决/不阻塞事项（滚动记录，非本页 P2 范围）

- cn API 文档确切 URL（对应 en 侧 `https://shimo.im/docs/ON6rp4yrhCcmv2Y7`）：P3 实现阶段已回读 `cn/base/header.jsp`/`cn/base/qa.jsp` 核实为 `https://www.sellersprite.com/v3/knowledge/feature/about-api`（cn 侧复用 SellerSprite 知识库文档，而非独立 shimo 文档），已在 `apps/web/lib/homepage-content.ts` 的 `HOMEPAGE_COPY["zh-cn"]` 中采用，并附源码行号注释说明依据。此项结论已定，从"未决"移除。
- `/me/query-log/{history,batch-hide}` 的 Controller 归属仍 UNRESOLVED：不影响首页 `exclude` 判定，留给覆盖用户中心域的未来 P1 一并核实。
