# SEO 打分标准（技术审计，非新 skill）

## 定位与边界

本标准是对已通过验收的试点页（`index.jsp` → `/en`、`/zh-cn`）做的**一次性、加时打分的技术 SEO 深度审计**，不是新建的常设 skill，也不替代主提示词 §2.3 的十项统一验收器——`index.jsp` 已凭该验收器判定"试点页验收通过"（见 `migration/reports/report-pilot-index.md`），本标准不重新裁定那个结论。

关系说明：
- 十项验收器中与 SEO 直接相关的第 1/3/4/10 项已 PASS/N/A，本标准**直接引用**其证据而不重新打分，只在"确认性复核"小节里做一次轻量复核（见 C3）。
- 本标准补充验收器**未覆盖**的技术 SEO 面：meta description 质量、hreflang 完整性、OG 完整性、结构化数据(JSON-LD)的存在性与正确性、alt 文本、内部链接健康度、robots/sitemap 一致性、感知性能代理指标（无 Lighthouse 工具，用 preview_network/preview_eval 做代理观测）。
- 本文档产出后是否需要把它固化为 `.claude/skills/seo-scoring` 是本轮任务的独立问题（见 `STATE.md` 现有决定：仅当验收器证明不够用时才建），在两份评分报告完成后另行回答，不在本标准内预先决定。

## 计分规则

- 满分 100，9 个类别，每类别再拆子项，权重见下表；权重依据：直接影响可索引性/重复内容风险的项（可索引性、canonical/hreflang、metadata）权重最高，视觉/次要项（OG、结构化数据、标题层级）居中，无自动化工具兜底的辅助项（alt、内链、性能代理）权重最低。
- 每个子项四态之一：**PASS**（满分）/ **PARTIAL**（半分，必须写明原因）/ **FAIL**（0 分，必须写明原因）/ **N/A**（不计入分母，按验收器同款做法整体重算百分比，需写明 N/A 理由）。
- **禁止编造**：每个子项的判定必须引用一条通过 `preview_snapshot`/`preview_inspect`/`preview_network`/`preview_eval` 实际取得的证据（DOM 快照片段、HTTP 响应头、请求列表条目、`eval` 返回值），不得仅凭阅读源码推断渲染结果、不得凭"应该是这样"打分。若某结构化数据/字段在实际渲染中确认不存在，明确记为"缺失"（FAIL，附确认方法），不得为其猜测一个折中分数。
- 本审计只诊断，不代修——若某项缺陷是本地、可逆、范围极小的修改（例如漏写一个 `alt=""`），可按 D-006 顺手改并在报告里注明"已顺手修复"；涉及内容策略、真实指标、外部承诺（例如需要真实 FAQ 内容、真实 og:image 素材）的项一律只报告不改，是否/如何修复留给用户决定。

## 评分类别

### A. 可索引性与爬取指令（15 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| A1 页面级 robots 指令与 `IndexDecision.index` 一致（本页应为 index） | 5 | `preview_eval` 读 `document.querySelector('meta[name="robots"]')`，或确认其缺失（缺失等同 index,follow 默认值，需明确记录是"未显式声明"还是"显式声明 index"） |
| A2 `sitemap.xml` 包含本路由，且与 `IndexDecision.inSitemap` 一致 | 5 | `preview_network` 或直接请求 `/sitemap.xml`，`preview_eval` 里用 `fetch('/sitemap.xml').then(r=>r.text())` 搜索本路由 |
| A3 `robots.txt` 未误挡本路由 | 5 | 同上方式 `fetch('/robots.txt')`，检查 `Disallow` 规则是否覆盖 `/en`、`/zh-cn` |

### B. Canonical 与 Hreflang（20 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| B1 canonical 存在、自指、绝对 URL、无追踪参数 | 8 | `preview_inspect` 或 `preview_eval` 读 `link[rel=canonical]` 的 `href` |
| B2 hreflang 三件套齐全且互反（en/zh-cn/x-default） | 12 | `preview_eval` 读全部 `link[rel=alternate][hreflang]`，交叉核对 `/en` 页与 `/zh-cn` 页两边的输出互相指向对方 |

### C. Metadata 内容质量（20 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| C1 `<title>` 存在、唯一、长度合理（约 50–60 字符）、locale 相符 | 8 | `preview_eval`：`document.title` |
| C2 meta description 存在、长度合理（约 150–160 字符）、非空洞/非重复 | 8 | `preview_eval` 读 `meta[name=description]` 的 `content` |
| C3 确认性复核：以上字段确系来自 DTO/Sanity 而非页面字面量硬编码（引用验收器第3项证据，本项只做一次轻量复核，非重新打分） | 4 | 对照 `report-pilot-index.md` 第3项证据；若与代码现状不符则升级为独立判定并说明 |

### D. Open Graph / 社交分享（10 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| D1 `og:title`/`og:description`/`og:url`/`og:type`/`og:site_name` 齐全 | 5 | `preview_eval` 读 `meta[property^="og:"]` 全集 |
| D2 `og:image` 存在且可访问（非 404/损坏），尺寸合理 | 5 | 读 `og:image` 的 `content`，`preview_network` 或 `fetch(url).then(r=>r.status)` 验证可达性 |

### E. 结构化数据 JSON-LD（10 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| E1 Organization JSON-LD 存在且为合法 JSON、字段无编造 | 5 | `preview_eval` 遍历 `script[type="application/ld+json"]`，`JSON.parse` 校验；若不存在，明确记为"缺失"（FAIL），不得猜测折中分 |
| E2 FAQ JSON-LD 未被错误地基于占位内容生成（SDD §7.2 规则：仅当真实 FAQ 内容存在时才应输出） | 5 | 同上遍历结果里查找 `@type: FAQPage`；已知 FAQ 内容为占位（见 P4 报告已披露风险），此项 PASS 的条件是**没有**输出 FAQPage JSON-LD（若输出了，则是把占位内容当真实数据编入结构化数据，判 FAIL） |

### F. 标题层级与内容结构（10 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| F1 唯一 `<h1>`，非空，语义描述性 | 5 | `preview_eval`：`document.querySelectorAll('h1').length === 1` 且内容非空（引用验收器第1项证据做交叉确认，非重复独立取证） |
| F2 标题层级不跳级（不出现 h1 后直接 h3 缺 h2 的情况） | 5 | `preview_eval` 遍历所有标题标签，按文档顺序检查 tag-level 序列 |

### G. 图片 Alt 文本（5 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| G1 所有实义图片有非空 `alt`；纯装饰图片有 `alt=""` 或 `aria-hidden` | 5 | `preview_eval` 遍历 `document.querySelectorAll('img')`，逐个读 `alt`/`role`/`aria-hidden` |

### H. 内部链接健康度（5 分）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| H1 header/footer/正文全部内链可解析（无 404），locale 切换器正确互指 | 5 | `preview_eval` 收集所有 `a[href]`，对同源相对路径逐一 `fetch(href, {method:'HEAD'})` 或 `preview_network` 观察实际点击后的响应码 |

### I. 感知性能代理指标（5 分，无 Lighthouse 时的替代观测）
| 子项 | 分值 | 判定方法 |
|---|---|---|
| I1 首屏无明显阻塞性重资源；非首屏图片走懒加载；资源数量无异常膨胀 | 5 | `preview_network` 查看请求列表大小/数量，`preview_eval` 检查 `img[loading]`/`next/image` 产出的属性 |

## 报告产出格式（供 Task #5 使用）

每个 locale 一份报告，含：
1. 逐项打分表（类别、子项、分值、判定、证据引用）
2. 总分与百分比（N/A 项从分母移除，注明理由）
3. 扣分项的具体原因
4. 可执行但本轮不代做的改进清单（每条注明：是否属于 D-006"本地可逆小改动"范畴——若是且已顺手修复，注明修复内容；若否，只报告，改不改留给用户）
