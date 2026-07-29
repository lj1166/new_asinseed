# 元数据与图片素材设计约束（2026-07-26 新建，响应 `report-agent-system-gaps.md` 提案③）

## 定位与边界

本文档是与 `Development_Process/migration/seo-scoring-standard.md` 同级的标准文档，**不是新建 skill**。它规定 P2/P3 产出元数据（title/description/og:image/JSON-LD）时必须满足的质量下限，堵住 `report-agent-system-gaps.md` §3.4 指出的验收盲区——P4 十项统一验收器此前只验收"字段来自 DTO 而非硬编码"（取证方式层面），不验收"DTO 里的值本身是否达标"（内容质量层面）。

触发证据（`/en`、`/zh-cn` 两份 SEO 打分报告已实测发现，非假设）：
- `/en` 标题 `"...Research Tool-AsinSeed"` 存在品牌名重复拼接。
- `/zh-cn` meta description 仅 11 字符（目标区间约 7%），`/en` 48 字符（约 32%）。
- 两个 locale `og:image` 均缺失。
- 两个 locale `jsonLdCount:0`。

## 1. 标题（title）规则

- **去重规则**：标题模板拼接时，品牌名（`AsinSeed`）只能出现一次。若页面标题本身已包含品牌名（例如首页 `"AsinSeed - ..."`），拼接层禁止再追加一次品牌名后缀；若页面标题不含品牌名，拼接层追加一次。产出前必须用简单字符串匹配自检：`title.split(brandName).length - 1 <= 1`。
- **表达质量**：标题须准确概括页面主意图、自然包含必要的主题词，并让用户能区分该页与其他页。不存在跨语言通用的硬字符门槛；过短、模板化或为堆词而过长时，结合 SERP 预览和用户可读性复核，不得用填充词凑长度。
- **locale 一致性**：标题用字/措辞需与页面 `lang` 属性一致，不得中英混杂（专有名词/品牌名除外）。

## 2. Description 硬性下限

- 内容必须是该页面真实卖点/内容摘要，准确、自然、可区分，且不得为凑字数堆砌关键词（keyword stuffing）。Google 可按查询生成不同摘要，因此不得把任何固定字符数当作收录或展示保证。
- 若某页面类型可用的真实摘要很少（例如极简工具页），应先复核是否缺少用户价值说明；确认页面角色确实极简时，可在报告中说明原因，不得为了凑字数编造内容。

## 3. `og:image` 规范

- **尺寸**：1200×630（Open Graph 官方推荐比例，约 1.91:1），格式建议 JPG/PNG，文件体积建议 <300KB。
- **素材来源决策流程**：
  1. P2 阶段：为每个页面类型（首页/结果页/内容页/表单页）确定 `og:image` 来源类型——"真实设计稿素材" / "页面真实截图" / "技术性品牌 fallback" / "AI 生成占位图（需在文件名/alt 中标注`placeholder`）"，写入该页面的 P2 决策记录（如 `url-map.md`）。
  2. `og:image` 不得完全缺失。页面专属 Sanity 素材优先；留空时可使用经过运行时验证、只包含稳定品牌和类别语言的代码生成 fallback。它不替代内容专属素材，也不得含未经证实的产品、客户或数据主张。
  3. 素材由谁提供：真实设计稿/截图需用户或设计资源提供；AI 生成占位图可由 agent 在获得用户批准后生成（生成图片属于内容策略决策，按 D-006 边界需先获批准，不属于"本地可逆小改动"）。技术性品牌 fallback 不是 AI 素材，可作为本地可逆实现直接验证。
- 多个 locale 可共用同一素材（若品牌视觉一致）或分别设计，由用户决定。

## 4. 按页面类型的 JSON-LD 必需清单

与 `seo-scoring-standard.md` J1 子项判定标准一致，此处给出权威清单供 P2/P3 实现时对照：

| 页面类型 | 必需 JSON-LD `@type` | 说明 |
|---|---|---|
| 品牌入口页（如首页） | `Organization` + `WebSite` | `Organization` 至少声明 `name`/`url`/稳定 `@id`，`WebSite.publisher` 引用该 `@id`；若有官方社交账号等可验证外部身份，另加 `sameAs`（见 seo-scoring-standard.md J2） |
| 含真实 FAQ 内容的页面 | `Organization` + `FAQPage` | **仅当 FAQ 为真实问答内容时才输出 `FAQPage`**（SDD §7.2 既有规则，非本文档新增）；FAQ 仍为占位内容期间禁止输出，避免把占位内容当真实数据编入结构化数据 |
| 含文章型内容的页面（blog/help/guide 等） | `Organization` + `Article` | `Article` 需要 `headline`/`datePublished`/`author` 字段，均来自真实数据，不得编造 |
| 结果页（查询结果，通常 noindex） | 无强制要求 | 该类页面按 P4 验收器第4项走 `noindex` 且不进 sitemap，结构化数据对其 GEO 价值有限，不作为硬性要求 |

任何页面输出的 JSON-LD 字段值必须来自真实数据源（DTO/Sanity），不得编造 `sameAs`、评分、评论数等无来源数据（呼应主提示词 §5.4 `schema-markup-builder` skill 描述的既有边界）。

## 5. 与 P4 十项验收器的关系

本文档规定的质量下限（标题去重与意图清晰、description 准确非堆词、`og:image` 可访问、按页面类型 JSON-LD 齐全）已回填为 `prd-docs/prompts/00_migration_loop_master_prompt.txt` 的 P2/P3/P4 规则。它们以可读性、真实性与运行时验证为门槛，不以跨语言固定字符数制造伪精确。原十项条目本身未改动、编号不变。
