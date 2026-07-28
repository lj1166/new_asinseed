# P4 报告：cn 首页重构

日期：2026-07-28  
范围：`cn-index` 的 P2/P3 与技术 P4；旧/新 URL 保持 `/cn` → `/cn`。

## 结果

首页已从旧 JSP 式“搜索框 + 能力/插件/视频 + 伙伴/评价”布局重构为简中 SaaS 品牌信任与研究方法入口。旧 DOM、旧文案、旧图片、旧伙伴/评价和旧博客外链均未进入新页面。

## 实现

- 新增 Sanity `homepageContent` 文档类型与 Zod `HomepageContentSchema`：运营可编辑 Hero 眉题、CTA 文案、三项场景、三步方法与结尾 CTA；H1/副标题仍唯一由 `homepageSeo` 管理，避免字段来源冲突。
- 新增 `homepageContent-zh-cn`、3 条 `homepageFaqEntry`，并把 `homepageSeo-zh-cn` 的验证用测试文案替换为正式 title、description、H1 和副标题。
- 前台改用 `getHomepageRebuildContent()` 的 Sanity-first 读取和安全原创 fallback；FAQ 只渲染真实 Sanity 条目，不再回退占位问答。
- 已发布内容直连 Sanity API，`/cn` 配置 ISR `revalidate = 60`，运营发布后的预期前台生效窗口为最多约 60 秒；不再受 CDN 额外传播时间影响。
- 仅在真实 FAQ 存在时输出 `FAQPage` JSON-LD；`Organization` 保留。未提供 OG 图时不虚构 `og:image`。
- 删除未使用的旧搜索框、伙伴、评价、视频、旧内容预览等首页组件，更新全局导航至实际存在的 `#scenarios` / `#how-it-works` 锚点。

## 运行时与回归证据

| 检查 | 结果 | 证据 |
|---|---|---|
| Sanity 文档写入与读取 | PASS | CLI 查询确认 `homepageContent-zh-cn`、`homepageSeo-zh-cn`、3 条 FAQ 已在 `3q1qrst9/production`。 |
| Studio schema 校验 | PASS | `pnpm exec sanity documents validate --yes --dataset production --level error`：8 份文档、0 error。 |
| 前台运行时消费 | PASS | HTTP `http://localhost:3000/cn` = 200，HTML 含正式 H1 与 `FAQPage`，不含旧“获取流量词”。 |
| Next + Studio 本地服务 | PASS | Next `localhost:3000` = 200；Studio `localhost:3333` = 200。 |
| TypeScript | PASS | `pnpm typecheck`。 |
| E2E / 路由 / SEO | PASS | `pnpm test:e2e`：9/9 通过，覆盖根重定向、单 H1/canonical、无 inactive hreflang、重构内容、390px 无横向溢出、inactive locale 404、sitemap 与 robots。 |
| 生产构建 | PASS | `pnpm build`：Studio 与 Next 均完成；`/cn` 显示 ISR 1 分钟。 |

## 未解决项

- `homepageSeo-zh-cn.seo.ogImage` 为空：缺少 1200×630 的已授权 OG 图，仍为 Layer C FAIL。
- 客户评价、伙伴 Logo、量化数据与产品截图尚无可公开核验素材，因此新首页刻意不展示这些模块；它们不是页面实施阻塞项。
- 本报告的移动验收是 Playwright 的 390px 可见性与无溢出验证；如要作最终设计签收，可由负责人在浏览器进行主观视觉审阅，但不影响已通过的技术验收。
