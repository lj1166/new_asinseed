# SEO 打分报告 · `/en`（试点页 `index.jsp` 英文版）

- 打分依据：`Development_Process/migration/seo-scoring-standard.md`（技术审计，非新 skill，不重新裁定 P4 十项统一验收器已给出的"试点页验收通过"结论）。
- 取证方式：全部子项均通过 `preview_eval`（`document`/`fetch()` 实际读取渲染后 DOM 与网络响应）在运行中的 dev server（`http://localhost:3000/en`）上实测取得，无一项凭代码阅读推断或凭感觉估分。
- 本报告只诊断，不代修——唯一的例外是本轮会话中已实际执行、且属于 D-006"本地可逆小改动"范畴的一项修复（见下方 H1 与改进清单），已在评分时按修复后状态计分并注明。

## 1. 逐项打分表

| 类别 | 子项 | 分值 | 判定 | 得分 | 证据 |
|---|---|---|---|---|---|
| A 可索引性（15） | A1 页面级 robots 指令与 IndexDecision 一致 | 5 | PASS | 5 | `document.querySelector('meta[name="robots"]')` → `null`（未显式声明，非显式 index 声明）；缺失按规范等同浏览器/爬虫默认 `index,follow`，与 `url-map.md` 记录的 `IndexDecision{index:true, inSitemap:true}` 意图一致，非缺陷 |
| | A2 sitemap.xml 包含本路由 | 5 | FAIL | 0 | `fetch('/sitemap.xml')` → HTTP `500`，端点本身崩溃，无法核实是否含 `/en` |
| | A3 robots.txt 未误挡本路由 | 5 | FAIL | 0 | `fetch('/robots.txt')` → HTTP `500`，同上，无法核实 Disallow 规则 |
| B Canonical/Hreflang（20） | B1 canonical 存在/自指/绝对URL/无追踪参数 | 8 | PARTIAL | 4 | `link[rel=canonical]` 原始 `href` 属性值为 `"/en"`——存在✓、自指✓（与当前路径一致）、无追踪参数✓，但**非绝对 URL**（缺 origin），4 项中 3 项满足 |
| | B2 hreflang 三件套齐全且互反 | 12 | PASS | 12 | 本页与 `/zh-cn` 页交叉核对：`/en` 输出 `en→/en`、`zh-cn→/zh-cn`、`x-default→/en`；`/zh-cn` 输出的三件套与之逐一互指一致，无遗漏无矛盾 |
| C Metadata 质量（20） | C1 `<title>` 存在/唯一/长度合理/locale相符 | 8 | PARTIAL | 4 | `document.title` = `"AsinSeed - Amazon Reverse ASIN Research Tool-AsinSeed"`（53 字符，落在 50–60 目标区间内），但字面串在末尾出现品牌名重复拼接（`...Tool-AsinSeed`），可读性与点击率受损，判断为文案生成/拼接层面的缺陷，非长度问题 |
| | C2 meta description 存在/长度合理/非空洞 | 8 | PARTIAL | 4 | `meta[name=description].content` = `"Find the exact keywords used by your competitors"`（48 字符），仅约为 150–160 目标区间的三分之一；内容本身非空洞、非重复、主题相关，判 PARTIAL 而非 FAIL |
| | C3 确认性复核：字段确系来自 DTO 而非硬编码 | 4 | PASS | 4 | 复核 `report-pilot-index.md` 第3项证据（`generateMetadata` 读取 `HOMEPAGE_COPY` DTO）与当前代码现状一致，未发现回归；C1/C2 发现的是 DTO **内容取值**的质量问题，不是"DTO vs 硬编码"的取证方式问题，两者不矛盾 |
| D Open Graph（10） | D1 og 五件套齐全 | 5 | PARTIAL | 2.5 | 实测 `meta[property^="og:"]` 全集：`og:title`/`og:description`/`og:type`/`og:url` 均存在，唯独 `og:site_name` **缺失**（4/5 齐全） |
| | D2 og:image 存在且可达 | 5 | FAIL | 0 | 全集中不存在任何 `og:image` 标签，社交分享无预览图 |
| E JSON-LD（10） | E1 Organization JSON-LD 存在且合法 | 5 | FAIL | 0 | `document.querySelectorAll('script[type="application/ld+json"]').length` = `0`，页面未输出任何结构化数据 |
| | E2 FAQ JSON-LD 未把占位内容当真实数据 | 5 | PASS | 5 | 同上：JSON-LD 总数为 0，故不存在把 P4 报告已披露的占位 FAQ 内容错误编码为 `FAQPage` 的风险——满足本项"未输出"即 PASS 的条件 |
| F 标题层级（10） | F1 唯一 h1，非空 | 5 | PASS | 5 | `h1` 计数 = 1，内容 = `"AsinSeed - Amazon Reverse Asin Search Tool, Free Amazon Keyword Tool"`（非空、描述性），与 P4 报告第1项证据交叉确认一致 |
| | F2 标题层级不跳级 | 5 | PASS | 5 | 实测完整标签序列：`H1→H2→H3×5→H2→H2→H2→H3→H2→H2→H2→H2`，逐级检查无跳级 |
| G Alt 文本（5） | G1 实义图有 alt，装饰图有 alt=""/aria-hidden | 5 | PASS | 5 | 遍历全部 16 个 `<img>`：`missingAlt=0`（无图片完全缺失 alt 属性）；3 个装饰性图标 `alt=""` 满足"或"条件（无需同时具备 `aria-hidden`）；其余 13 个均有描述性 alt 文本 |
| H 内链健康度（5） | H1 内链无 404，locale 切换器互指正确 | 5 | PARTIAL | 2.5 | locale 切换器双向验证：`/en`→200、`/zh-cn`→200；但站内业务链接 5/7 返回 404：`/en/US?q=flashlight`、`/en/US/B01IHHLB3W?...`、`/en/US/B07YC8PVF1?...`、`/en/extension`、`/en/help`——均因目标页面（`search.jsp`/`extension`/`help`）尚未进入迁移范围而未建成，前缀本身正确（`/en/`），非路由错误 |
| I 性能代理指标（5） | I1 无阻塞重资源/懒加载/资源数量正常 | 5 | PASS | 5 | `preview_network` 广谱抓包仅见标准 Next.js dev chunk（`webpack.js`/`main-app.js`/`layout.js`/`page.js`）、1 个 CSS、1 个字体（woff2），无异常膨胀；`imgSummary.allLazy = true`，全部图片走 `loading="lazy"` |

无 N/A 项——本标准的全部 12 个子项对"品牌入口首页"这一页面类型均适用（不同于 P4 十项验收器中专为结果页设计、因而对本页 N/A 的第4/10项）。

## 2. 总分与百分比

**63 / 100 = 63%**（分母未做任何调整，因无 N/A 项）

分类小计：A 5/15 · B 16/20 · C 12/20 · D 2.5/10 · E 5/10 · F 10/10 · G 5/5 · H 2.5/5 · I 5/5

## 3. 扣分项具体原因

- **A2/A3（各 -5）**：`sitemap.xml`、`robots.txt` 两个端点均返回 HTTP 500，根因未在本轮定位到具体报错堆栈——不是"内容不对"，而是端点本身在渲染层崩溃，导致 A1（页面级 robots 指令）之外的两项爬取指令完全无法核实，只能判 FAIL 而非折中分。
- **B1（-4）**：canonical 只差"绝对 URL"一项未满足；相对路径 `"/en"` 在 `<base>` 标签缺失、且服务端渲染场景下通常仍能被爬虫正确解析为绝对地址，但不是最佳实践，存在因 `<base>` 标签或反向代理路径重写而被误解析的潜在风险。
- **C1（-4）**：标题长度本身合格，扣分原因是内容质量缺陷——`"...Research Tool-AsinSeed"` 尾部重复拼接站点名，怀疑是标题模板在拼接"页面标题 + 站点名后缀"时，DTO 内的 `pageTitle` 字段本身已包含"AsinSeed"前缀，与模板自动追加的站点名后缀重复，产生双重品牌名。
- **C2（-4）**：description 内容合格但长度仅达目标下限的三分之一，未充分利用 SERP 摘要可用空间，可能导致 Google 自行从正文摘取替代文案，丧失文案可控性。
- **D1（-2.5）**：`og:site_name` 缺失，社交平台/部分爬虫在缺少该字段时会退化显示域名而非品牌名。
- **D2（-5）**：`og:image` 完全未配置，社交分享卡片无预览图，是当前 OG 完整性中最严重的单项缺口。
- **E1（-5）**：Organization JSON-LD 完全缺失，搜索引擎无法从结构化数据层面确认站点实体信息（品牌名、logo、sameAs 等），属于 SEO 技术需求 SEO-04/05 类目下应有但未实现的能力，不是回归——P4 验收器未把"是否输出 Organization JSON-LD"列为独立强制项，故此前判定"试点通过"与本项 FAIL 不矛盾，只是揭示验收器覆盖范围之外的新维度。
- **H1（-2.5）**：5 个内链 404，全部因目标页面尚未迁移（Stage 1 范围内 `search.jsp` 未开始，`extension`/`help` 更晚）导致，前缀本身正确，属于"预期中的阶段性缺口"而非路由错误，但按打分标准字面定义（"全部内链可解析"）仍需如实记为未满分。

## 4. 改进清单（本轮不代做，除已注明"已顺手修复"的一项）

| 项 | 建议 | D-006 归类 | 状态 |
|---|---|---|---|
| H1 关联发现 | `/zh-cn` 页此前内链硬编码了旧站 locale 前缀 `/cn/` 而非新站实际的 `/zh-cn/`，会导致链接 100% 不可解析（比"目标页未建成"更严重的路由错误）——发现于本轮证据收集过程中 | ✅ 属于本地、可逆、范围极小的字符串修正，不涉及内容策略/真实指标/外部承诺 | **已顺手修复**：`apps/web/lib/homepage-content.ts` 内 `zh-cn` 对象的 5 处 `href`/`ctaHref`/`linkHref`（第117/118/119/150/203行）已改为 `/zh-cn/` 前缀，并通过浏览器重新取证确认现在与 `/en` 同属"前缀正确、目标页未建成"这一预期中的阶段性缺口 |
| A2/A3 | 排查 `sitemap.xml`/`robots.txt` 路由处理函数为何返回 500（可能是数据源/环境变量/依赖缺失导致的渲染期异常），修复后需重新核实 `IndexDecision.inSitemap` 与实际输出是否一致 | 需先诊断根因，不属于"已知的本地小改动"，只报告 | 待用户决定 |
| B1 | 把 canonical（以及可选地 hreflang alternates）的相对路径改为绝对 URL（拼接生产域名 origin） | 是（模板层小改动），但涉及"生产域名"这一 D-006 明确列为需先获批准的边界项（`AGENTS.md` §Boundaries："变更 `sellersprite.ai` 目标域名"一类的线上属性变更需谨慎），且当前 dev 环境的 origin 本身就是 `localhost:3000`、并非生产域名，贸然写死会引入新的环境耦合问题 | 只报告，改不改及采用何种 origin 来源（环境变量 vs 硬编码）留给用户决定 |
| C1 | 排查 `HOMEPAGE_COPY.en.pageTitle`（或标题拼接模板）为何产生 `"...Tool-AsinSeed"` 双重品牌名，去重后重新验证长度仍落在 50–60 区间 | 是，本地小改动，但涉及对外可见文案内容取值，按标准边界应报告而非代改 | 只报告，留给用户决定文案 |
| C2 | 把 description 扩写至 ~150–160 字符，需要补充真实卖点文案而非填充 | 否——涉及内容策略与真实文案，不是"小改动" | 只报告，留给用户决定 |
| D1 | 补充 `og:site_name`（值为 "AsinSeed"） | 是，本地小改动 | 只报告，留给用户决定是否连同 C1/D2 一并处理 |
| D2 | 提供真实的 `og:image` 素材（尺寸建议 1200×630）并接入 metadata | 否——需要真实图片素材，不能编造 | 只报告，留给用户决定 |
| E1 | 实现 `buildOrganizationJsonLd()` 并接入首页 `generateMetadata`/`<script type="application/ld+json">` 输出（SDD §7 已定义此 builder） | 是（代码框架已在 SDD 中定义，属于补齐既定契约的小改动），但涉及组织信息（logo/sameAs 等）取值是否为真实数据需要确认 | 只报告，留给用户决定素材来源后再排期 |
| H1 | 目标页面（`search.jsp`/`extension`/`help`）尚未迁移导致的 404，需等各自完成 P1→P4 后自然消失，不应在此提前打桩或伪造路由 | 否——这是 Stage 1 剩余范围的正常项目节奏，不是可" fix"的缺陷 | 无需修复，等待正常迁移节奏推进 |
