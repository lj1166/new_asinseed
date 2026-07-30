# 文章博客 MVP 实施计划

> 状态:Draft → 待批准
> 更新:2026-07-28
> 依据:content-automation-architecture-draft.md + Claude Code 直接生成能力

## 核心调整

**发现**:Claude Code 可直接生成文章并通过 Sanity MCP 写入 draft,无需独立脚本。

**结论**:
- 保留:Schema 扩展、前台路由、审核流程(必需基础)
- 简化:配置档延后、不做独立批量脚本
- 优先级:先测试 MCP 可行性(BLOCKER)

---

## 实施路径

### Phase 0:验证可行性(1-2天)

**目标**:确认 Claude Code → Sanity MCP 技术链路可用

```
任务 0.1:测试 Sanity MCP 写入
- 在 Claude Code 中生成 1 篇测试文章
- 尝试通过 MCP 写入当前 contentEntry
- 验证:draft 出现在 Sanity Studio 中
- BLOCKER:如失败,回退到人工流程,本 MVP 暂停

任务 0.2:评估字段映射
- 检查 AI 生成的字段与当前 schema 差异
- 列出必须补齐的字段清单
- 产出:Phase 1 的 schema 变更范围
```

---

### Phase 1:最小可用 Schema(3-5天)

**目标**:contentEntry 支持运营审核和 SEO 输出

```
任务 1.1:扩展 contentEntry schema
├─ 新增字段:
│  ├─ language:string (en | zh-cn) *必填
│  ├─ contentType:string (guide | tutorial | glossary) *必填
│  ├─ coverImage:image (封面)
│  ├─ altText:string (图片描述)
│  ├─ reviewer:string (审核人)
│  └─ seo 已有,检查是否包含 title/description/ogImage
│
├─ 验证规则:
│  ├─ 缺 language、contentType、seo.title、seo.description 时阻止发布
│  └─ 字数:warning(不阻止),范围参考 metadata-asset-constraints.md
│
└─ 不做:editorialProfile(暂用提示词硬编码)

任务 1.2:配置国际化
- 安装 @sanity/document-internationalization
- 注册 contentEntry、en、zh-cn
- 使用插件默认 language 字段和 translation.metadata

任务 1.3:Studio 表单优化
- 用 fieldset 分组:基础信息/正文/SEO/审核
- 条件显示:coverImage 必填提示
- 默认值:workflowState=draft, noindex=false
```

**验收标准**:
- ✅ 运营能在 Studio 新建文章并填写所有必需字段
- ✅ 缺必需字段时无法发布
- ✅ 国际化插件能创建语言关联

---

### Phase 2:AI 生成与写入(3-5天)

**目标**:Claude Code 稳定生成高质量草稿

```
任务 2.1:编写提示词模板
├─ 输入参数:
│  ├─ 关键词/主题
│  ├─ contentType (guide/tutorial/glossary)
│  ├─ language (en/zh-cn)
│  └─ 目标字数(guide:1500-2500, tutorial:1000-1800, glossary:500-900)
│
├─ 输出格式(对齐 Phase 1 schema):
│  {
│    "title": "...",
│    "slug": "...",
│    "language": "en",
│    "contentType": "guide",
│    "summary": "...",
│    "body": [...], // Portable Text
│    "coverImage": "TBD", // 先留空或占位
│    "altText": "...",
│    "seo": {
│      "title": "...",
│      "description": "...",
│      "ogImage": "TBD"
│    },
│    "tags": [...],
│    "author": "AI Assistant",
│    "sourceCitations": [...], // 必需:至少2个权威来源
│    "generatedBy": "agent",
│    "workflowState": "draft",
│    "noindex": false
│  }
│
└─ 质量规则:
   ├─ title:50-60字符
   ├─ seo.description:120-160字符
   ├─ body:满足 contentType 字数范围
   ├─ sourceCitations:至少2条,来自权威站点
   └─ 事实陈述必须有来源支撑

任务 2.2:生成 5 篇测试文章
- 主题:Amazon keyword research / ASIN lookup / Product analysis
- 类型:2 guide + 2 tutorial + 1 glossary
- 语言:3 en + 2 zh-cn
- 通过 MCP 写入 Sanity draft

任务 2.3:质量评估
- 运营审核 5 篇文章
- 记录:事实错误/SEO 不达标/来源缺失
- 优化提示词模板
- 目标:审核通过率 > 70%
```

**验收标准**:
- ✅ 5 篇文章成功写入 Sanity draft
- ✅ 所有必需字段完整
- ✅ 审核通过率 > 70%(至少 4/5 篇无需大幅修改)

---

### Phase 3:前台展示(5-7天)

**目标**:已发布文章可被收录和访问

```
任务 3.1:实现文章路由
├─ /[locale]/article
│  ├─ 列表:显示已发布文章(workflowState=approved, noindex=false)
│  ├─ 分页:10篇/页
│  └─ 过滤:按 contentType 或 tags
│
└─ /[locale]/article/[slug]
   ├─ 正文:Portable Text 渲染
   ├─ 封面:coverImage + altText
   ├─ 元信息:author、publishedAt、tags
   ├─ 来源:sourceCitations 列表
   └─ 相关文章:同类型推荐 3 篇

任务 3.2:GROQ 查询
// 列表
*[
  _type == "contentEntry" &&
  language == $locale &&
  workflowState == "approved" &&
  noindex != true
] | order(publishedAt desc) [0..9] {
  _id, title, slug, summary, coverImage, publishedAt, contentType
}

// 详情
*[_type == "contentEntry" && slug.current == $slug][0] {
  ...,
  "related": *[
    _type == "contentEntry" &&
    contentType == ^.contentType &&
    _id != ^._id
  ][0..2] { title, slug }
}

任务 3.3:Metadata 生成
- generateMetadata():title/description/canonical/ogImage
- 来源优先级:Sanity contentEntry.seo > 代码降级
- JSON-LD:Article + Breadcrumb
- hreflang:关联翻译版本

任务 3.4:Sitemap 集成
- 修改 apps/web/app/sitemap.ts
- 包含所有已发布可收录文章
- 频率:weekly
```

**验收标准**:
- ✅ 发布 1 篇测试文章后,可通过 /[locale]/article/[slug] 访问
- ✅ 页面输出正确 title、description、canonical、ogImage
- ✅ Article JSON-LD 包含 author、publishedAt、headline
- ✅ 文章出现在 sitemap.xml
- ✅ 在 Studio 修改 seo 字段后,前台随之变化

---

### Phase 4:审核流程验证(2-3天)

**目标**:运营能独立完成完整闭环

```
任务 4.1:运营培训
- 如何在 Claude Code 中批量生成文章
- 如何在 Studio 中审核(事实/SEO/来源)
- 如何发布和验证前台效果

任务 4.2:真实工作流测试
- 生成 10 篇文章
- 运营审核并修改
- 人工发布
- 验证前台和 sitemap

任务 4.3:编写运营手册
- Claude Code 生成文章标准流程
- Studio 审核清单
- 常见问题修复(标题过长/来源缺失)
- 产出:docs/content-automation-guide.md
```

**验收标准**:
- ✅ 运营能独立完成生成→审核→发布全流程
- ✅ 10 篇文章中至少 8 篇审核通过
- ✅ 已发布文章在 Google Search Console 中可见(如已配置)

---

## 时间表

```
Week 1:
├─ Day 1-2: Phase 0(验证 MCP)
└─ Day 3-5: Phase 1(扩展 schema)

Week 2:
├─ Day 1-3: Phase 2(AI 生成)
└─ Day 4-5: Phase 3 开始(前台路由)

Week 3:
├─ Day 1-2: Phase 3 完成
└─ Day 3-5: Phase 4(审核流程)
```

**总计:15-20 天**

---

## 不做清单(避免范围蔓延)

- ❌ EditorialProfile 配置档(Phase 1 暂用提示词)
- ❌ 独立批量脚本(Claude Code 已足够)
- ❌ 自动审核/自动发布(保留人工审核)
- ❌ Content Release 接线(人工发布即可)
- ❌ 多语言一键创建(先手动关联)
- ❌ Webhook 增量刷新(手动重新部署)
- ❌ 复杂看板视图(Studio 默认列表足够)

---

## 风险与缓解

### 风险 1:Sanity MCP 不可用

```
缓解:Phase 0 立即测试,如失败:
- 备选方案:使用 Sanity Client 直接写入(需开发独立脚本)
- 影响:增加 3-5 天开发时间
```

### 风险 2:AI 生成质量不达标

```
缓解:
- Phase 2 充分测试提示词(5 篇样本)
- 审核通过率 < 70% 时暂停扩批,优化提示词
- 不强制字数 KPI,重点是"完整回答问题"
```

### 风险 3:图片素材缺失

```
缓解:
- Phase 1-2 先留空或使用占位图
- 不阻止文章发布,SEO 打分时扣分
- 后续由设计/运营补充真实素材
```

---

## 成功标准

### MVP 成功(Phase 1-4 完成):

- ✅ Claude Code 能批量生成文章并写入 Sanity draft
- ✅ 运营能在 Studio 审核和发布
- ✅ 已发布文章可被收录(sitemap + 正确 metadata)
- ✅ 审核通过率 > 70%

### 业务价值验证(发布后 1-2 月):

- ✅ 发布至少 50 篇文章
- ✅ Google Search Console 显示收录和点击
- ✅ 文章页带来自然流量
- ✅ CTA 点击率 > 5%

---

## 与迁移主循环的关系

**独立并行**:
- 文章博客是新增功能,不涉及 JSP 迁移
- 可在 search.jsp 完成后启动
- Schema 变更不影响已有类型

**共享基础**:
- 复用 metadata-asset-constraints.md
- 复用 seo-scoring-standard.md
- 文章页同样需要通过 Layer A/B/C 验收

**不阻塞**:
- 迁移主线继续推进
- 文章功能按需启动
- 互不依赖

---

## 下一步

1. **用户批准本计划**
2. **立即执行 Phase 0 任务 0.1**(测试 Sanity MCP)
3. **根据测试结果决定**:
   - 成功 → 继续 Phase 1
   - 失败 → 评估备选方案或暂停

