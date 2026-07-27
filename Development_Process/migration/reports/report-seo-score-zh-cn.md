# SEO 打分报告 · `/zh-cn`（试点页 `index.jsp` 中文版）

- 打分依据：`Development_Process/migration/seo-scoring-standard.md`（技术审计，非新 skill，不重新裁定 P4 十项统一验收器已给出的"试点页验收通过"结论）。
- 取证方式：全部子项均通过 `preview_eval`（`document`/`fetch()` 实际读取渲染后 DOM 与网络响应）在运行中的 dev server（`http://localhost:3000/zh-cn`）上实测取得，无一项凭代码阅读推断或凭感觉估分。sitemap/robots 状态额外用 `preview_network` 交叉核对，两种取证方式结果一致。
- 本报告只诊断，不代修——唯一的例外是本轮会话中已实际执行、且属于 D-006"本地可逆小改动"范畴的一项修复（见下方改进清单），已在评分时按修复后状态计分并注明。

## 1. 逐项打分表

| 类别 | 子项 | 分值 | 判定 | 得分 | 证据 |
|---|---|---|---|---|---|
| A 可索引性（15） | A1 页面级 robots 指令与 IndexDecision 一致 | 5 | PASS | 5 | `document.querySelector('meta[name="robots"]')` → `null`（未显式声明），缺失按规范等同默认 `index,follow`，与 `url-map.md` 记录的 `IndexDecision{index:true, inSitemap:true}` 意图一致 |
| | A2 sitemap.xml 包含本路由 | 5 | FAIL | 0 | `fetch('/sitemap.xml')` → HTTP `500`，端点崩溃，与 `/en` 侧同一根因，无法核实是否含 `/zh-cn`；`preview_network` 交叉确认同一结果 |
| | A3 robots.txt 未误挡本路由 | 5 | FAIL | 0 | `fetch('/robots.txt')` → HTTP `500`，同上，`preview_network` 交叉确认 |
| B Canonical/Hreflang（20） | B1 canonical 存在/自指/绝对URL/无追踪参数 | 8 | PARTIAL | 4 | `link[rel=canonical]` 原始 `href` = `"/zh-cn"`——存在✓、自指✓、无追踪参数✓，但非绝对 URL（缺 origin），与 `/en` 同款缺陷 |
| | B2 hreflang 三件套齐全且互反 | 12 | PASS | 12 | 本页输出 `en→/en`、`zh-cn→/zh-cn`、`x-default→/en`；与 `/en` 页已确认的三件套逐一互指一致，无遗漏无矛盾 |
| C Metadata 质量（20） | C1 `<title>` 存在/唯一/长度合理/locale相符 | 8 | PARTIAL | 4 | `document.title` = `"AsinSeed - 超准确的亚马逊关键词反查工具"`（25字符，远低于标准约定的 50–60 字符区间，约为其 42–50%），无 `/en` 那种品牌名重复拼接问题，locale 用字（简体中文）与页面一致，判 PARTIAL：满足"存在/唯一/locale相符"三项，"长度合理"一项不满足 |
| | C2 meta description 存在/长度合理/非空洞 | 8 | FAIL | 0 | `meta[name=description].content` = `"一键反查竞品核心流量词"`（11字符），仅为 150–160 目标区间的约 7%——比 `/en` 侧 48 字符（约32%）严重得多，已不满足"长度合理"这一构成条件的实质性程度，内容本身虽非空洞、非重复、主题相关，但长度缺陷严重到判 FAIL 而非 PARTIAL（与 `/en` 侧 32% 达标度的 PARTIAL 判定形成对照，量的差异导致质的判定差异） |
| | C3 确认性复核：字段确系来自 DTO 而非硬编码 | 4 | PASS | 4 | 复核 `apps/web/lib/homepage-content.ts` 内 `HOMEPAGE_COPY["zh-cn"]` 结构（本轮会话中已直接编辑过该文件的同一对象，用于修复 5 处 `/cn/`→`/zh-cn/` 内链前缀），确认 title/description 字段确系从该 DTO 读取而非页面字面量硬编码，与 `report-pilot-index.md` 第3项证据结论一致，未发现回归 |
| D Open Graph（10） | D1 og 五件套齐全 | 5 | PARTIAL | 2.5 | 实测 `meta[property^="og:"]` 全集：`og:title`/`og:description`/`og:url`/`og:type` 均存在，另有非必需的 `og:locale`（`zh_CN`），唯独 `og:site_name` **缺失**（4/5 必需项齐全），与 `/en` 侧同一缺陷 |
| | D2 og:image 存在且可达 | 5 | FAIL | 0 | 全集中不存在任何 `og:image` 标签，社交分享无预览图，与 `/en` 侧同一缺陷 |
| E JSON-LD（10） | E1 Organization JSON-LD 存在且合法 | 5 | FAIL | 0 | `document.querySelectorAll('script[type="application/ld+json"]').length` = `0`，页面未输出任何结构化数据 |
| | E2 FAQ JSON-LD 未把占位内容当真实数据 | 5 | PASS | 5 | 同上：JSON-LD 总数为 0，不存在把占位 FAQ 内容错误编码为 `FAQPage` 的风险，满足本项"未输出"即 PASS 的条件 |
| F 标题层级（10） | F1 唯一 h1，非空 | 5 | PASS | 5 | `h1` 计数 = 1，内容 = `"AsinSeed - 超准确的亚马逊关键词反查工具"`（非空、描述性） |
| | F2 标题层级不跳级 | 5 | PASS | 5 | 实测完整标签序列：`H1→H2→H3×5→H2→H2→H2→H3→H2→H2→H2→H2`，逐级检查无跳级，与 `/en` 侧结构一致 |
| G Alt 文本（5） | G1 实义图有 alt，装饰图有 alt=""/aria-hidden | 5 | PASS | 5 | 遍历全部 28 个 `<img>`：`missingAlt=0`（无图片完全缺失 alt 属性）；3 个装饰性图标 `alt=""` 满足条件；其余 25 个均有描述性 alt 文本 |
| H 内链健康度（5） | H1 内链无 404，locale 切换器互指正确 | 5 | PARTIAL | 2.5 | locale 切换器双向验证：`/zh-cn`→200、`/en`→200；但站内业务链接 5/7 返回 404：`/zh-cn/US?q=flashlight`、`/zh-cn/US/B01IHHLB3W?...`、`/zh-cn/US/B07YC8PVF1?...`、`/zh-cn/extension`、`/zh-cn/help`——均因目标页面尚未迁移而未建成，前缀本身正确（`/zh-cn/`），非路由错误。**此项在本轮取证前曾是 5/7 之外的更严重问题**：修复前这 5 处内链硬编码为旧站前缀 `/cn/`，会导致 100% 不可解析；修复后才与 `/en` 同属"前缀正确、目标页未建成"这一预期缺口（见改进清单） |
| I 性能代理指标（5） | I1 无阻塞重资源/懒加载/资源数量正常 | 5 | PASS | 5 | `preview_network` 抓包显示与 `/en` 相同的标准 Next.js dev chunk 集合（`webpack.js`/`main-app.js`/`layout.js`/`page.js`）、1 个 CSS、1 个字体（woff2），无异常膨胀；`imgSummary.allLazy = true`，全部图片走 `loading="lazy"` |

无 N/A 项——本标准的全部 12 个子项对"品牌入口首页"这一页面类型均适用。

## 2. 总分与百分比

**59 / 100 = 59%**（分母未做任何调整，因无 N/A 项）

分类小计：A 5/15 · B 16/20 · C 8/20 · D 2.5/10 · E 5/10 · F 10/10 · G 5/5 · H 2.5/5 · I 5/5

## 3. 扣分项具体原因

- **A2/A3（各 -5）**：`sitemap.xml`、`robots.txt` 两个端点均返回 HTTP 500，与 `/en` 侧同一根因（端点本身渲染层崩溃，非 locale 特有问题），本轮未定位到具体报错堆栈。
- **B1（-4）**：canonical 只差"绝对 URL"一项未满足，与 `/en` 侧同一缺陷（模板层未拼接生产域名 origin）。
- **C1（-4）**：标题内容质量本身没问题（无品牌名重复、无空洞文案），但 25 字符相较标准约定的 50–60 字符区间明显偏短（约42–50%），未充分利用中文 SERP 标题的可用展示宽度。
- **C2（-8，FAIL 而非 PARTIAL）**：本报告中**唯一一处判定与 `/en` 侧同类子项不同严重程度**的差异：`/en` 的 description 48 字符（约32%达标）判 PARTIAL，`zh-cn` 仅 11 字符（约7%达标）——差距接近5倍，已经不是"偏短"而是"事实上未提供有效摘要"，故判 FAIL。这是两个 locale 打分报告里唯一一处因严重程度差异导致判定档位不同的子项，特此在此说明理由而非直接套用 `/en` 的判法。
- **D1（-2.5）**：`og:site_name` 缺失，与 `/en` 侧同一缺陷。
- **D2（-5）**：`og:image` 完全未配置，与 `/en` 侧同一缺陷。
- **E1（-5）**：Organization JSON-LD 完全缺失，与 `/en` 侧同一缺陷，同样是 P4 验收器未覆盖的维度，不是回归。
- **H1（-2.5）**：5 个内链 404，全部因目标页面尚未迁移导致，前缀本身正确（已于本轮修复），属于"预期中的阶段性缺口"，与 `/en` 侧同一性质。

## 4. 改进清单（本轮不代做，除已注明"已顺手修复"的一项）

| 项 | 建议 | D-006 归类 | 状态 |
|---|---|---|---|
| H1（本轮已修复，计入本次评分） | `/zh-cn` 页 5 处内链此前硬编码旧站 locale 前缀 `/cn/` 而非新站实际的 `/zh-cn/`，导致链接 100% 不可解析（比"目标页未建成"更严重的路由错误） | ✅ 属于本地、可逆、范围极小的字符串修正 | **已顺手修复**：`apps/web/lib/homepage-content.ts` 内 `zh-cn` 对象的 5 处 `href`/`ctaHref`/`linkHref`（第117/118/119/150/203行）已改为 `/zh-cn/` 前缀，本报告评分已按修复后状态计算 |
| A2/A3 | 排查 `sitemap.xml`/`robots.txt` 路由处理函数为何返回 500（与 `/en` 侧同一根因，建议一并排查，不必分 locale 各查一次） | 需先诊断根因，只报告 | 待用户决定（与 `report-seo-score-en.md` 同一条待办，不重复排期） |
| B1 | 把 canonical（以及可选地 hreflang alternates）的相对路径改为绝对 URL | 涉及生产域名来源决策，按 D-006 边界需先获批准 | 只报告，留给用户决定（与 `/en` 侧同一条待办） |
| C1 | 排查中文标题是否可适度扩写以更充分利用 50–60 字符区间（例如补充核心关键词或价值主张短语），需真实文案而非填充 | 否——涉及对外可见文案内容取值 | 只报告，留给用户决定文案 |
| C2 | 把 description 从 11 字符扩写至 ~150–160 字符目标区间，这是本报告扣分最重的单项，需要补充真实卖点文案 | 否——涉及内容策略与真实文案，不是"小改动"，且比 `/en` 侧同类问题更紧迫（差距更大） | 只报告，建议优先级高于 `/en` 侧同类项，留给用户决定 |
| D1 | 补充 `og:site_name`（值为 "AsinSeed"） | 是，本地小改动 | 只报告，留给用户决定是否连同 `/en` 侧一并处理（同一模板改动可覆盖两个 locale） |
| D2 | 提供真实的 `og:image` 素材（尺寸建议 1200×630），可与 `/en` 共用同一素材或分别设计 | 否——需要真实图片素材 | 只报告，留给用户决定 |
| E1 | 实现 `buildOrganizationJsonLd()` 并接入首页 `generateMetadata`（SDD §7 已定义此 builder），两个 locale 可共用同一实现，仅 `inLanguage`/`url` 等字段按 locale 参数化 | 是（代码框架已在 SDD 中定义），但组织信息真实性需确认 | 只报告，留给用户决定素材来源后再排期 |
| H1 | 目标页面（`search.jsp`/`extension`/`help`）尚未迁移导致的 404，等各自完成 P1→P4 后自然消失 | 否——Stage 1 剩余范围的正常项目节奏 | 无需修复，等待正常迁移节奏推进 |
