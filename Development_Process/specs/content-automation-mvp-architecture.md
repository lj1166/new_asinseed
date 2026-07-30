# 文章博客自动化生产系统架构方案

> **版本**: v3.0 渐进式演进  
> **创建时间**: 2026-07-28  
> **目标**: 从人工手动到 AI 辅助到系统自动化的渐进式内容生产

---

## 文档说明

本文档采用"**渐进式演进**"的设计思路：
- **Phase 1（1-2 周）**：人工手动上传，验证 Sanity ↔ Next.js 链路
- **Phase 2（1-2 周）**：Claude Code + MCP，对话式 AI 生成
- **Phase 3（4-6 周）**：前后端工程，系统化批量生产

---

## 目录

**【演进路线】**
- [一、渐进式演进概览](#一渐进式演进概览)

**【Phase 1：人工手动上传】**
- [二、Phase 1：人工手动上传](#二phase-1人工手动上传)

**【Phase 2：Claude Code + MCP】**
- [三、Phase 2：Claude Code + MCP 自动化](#三phase-2claude-code--mcp-自动化)

**【Phase 3：前后端工程系统】**
- [四、Phase 3 概述](#四phase-3-概述)
- [五、Phase 3 系统架构](#五phase-3-系统架构)
- [六、Phase 3 核心流程](#六phase-3-核心流程)
- [七、Phase 3 数据模型](#七phase-3-数据模型)
- [八、Phase 3 实施计划](#八phase-3-实施计划)
- [九、Phase 3 部署方案](#九phase-3-部署方案)

**【后期演进与扩展】**
- [十、完整输入体系设计](#十完整输入体系设计)
- [十一、完整输出体系设计](#十一完整输出体系设计)
- [十二、Multi-Agent 架构设计](#十二multi-agent-架构设计)
- [十三、扩展功能设计](#十三扩展功能设计)
- [十四、SaaS 最佳实践](#十四saas-最佳实践)

---

# 【演进路线】

## 一、渐进式演进概览

### 1.1 三阶段演进策略

```
Phase 1: 人工手动上传（1-2周）
    ↓ 验证链路
Phase 2: Claude Code + MCP（1-2周）
    ↓ 验证 AI 效果
Phase 3: 前后端工程（4-6周）
    ↓ 规模化生产
持续优化
```

### 1.2 为什么采用渐进式演进？

**风险最小化**：
- 每个阶段投入小，快速验证
- 发现问题及时调整，避免大规模返工
- 渐进式学习，团队逐步熟悉 AI 内容生产

**价值最大化**：
- Phase 1 即可开始发布内容，产生业务价值
- Phase 2 快速提升效率，验证 AI 可行性
- Phase 3 规模化后 ROI 显著提升

**决策有依据**：
- 基于实际数据决定是否进入下一阶段
- 避免过度设计和提前优化

### 1.3 各阶段对比

| 维度 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| **时间** | 1-2 周 | 1-2 周 | 4-6 周 |
| **成本** | 几乎为 0 | 几乎为 0 | $30k |
| **技术** | Sanity + Next.js | + Claude Code + MCP | + 前后端系统 |
| **输入维度** | 1维（人工创作） | 2维（提示词+上下文） | 4维（提示词+关键词+配置+图片） |
| **输出维度** | 1维（长文博客） | 1维（长文博客） | 2维（长文博客+图片集成） |
| **质量上限** | 60-70分 | 75-85分 | 85-90分 |
| **生产方式** | 人工手动创建 | 对话式 AI 生成 | 系统化批量生产 |
| **月产量** | 10-20 篇 | 50-100 篇 | 200-500 篇 |
| **运营工作量** | 100% | 80%（主要是审核） | 20%（配置+审核） |
| **自动化程度** | 0% | 30% | 90% |
| **核心价值** | 打通发布链路 | 验证 AI 质量 | 降本增效规模化 |

---

# 【Phase 1：人工手动上传】

## 二、Phase 1：人工手动上传

### 2.1 目标

**核心目标**：
- ✅ 验证 Sanity CMS 和 Next.js 的内容发布流程
- ✅ 打通 Sanity Studio → Next.js 的基础链路
- ✅ 确保 SEO、多语言、图片 CDN 等功能正常

**时间**: 1-2 周  
**成本**: 几乎为 0（使用现有技术栈）

**输入输出模型**：
```
输入维度（1维）：
  └─ 人工创作（运营/编辑的专业知识和写作能力）

输出维度（1维）：
  └─ 长文博客（标题、正文、SEO元数据）

质量上限：60-70分
  └─ 依赖个人能力，质量不稳定
```

### 2.2 工作内容

#### 2.2.1 Sanity Studio 配置

**contentEntry Schema 设计**：
```
contentEntry {
  title: string (必填)
  slug: slug (自动生成)
  language: "en" | "zh-cn"
  summary: text
  body: markdown 或 portable text
  coverImage: image
  
  seoMetadata: {
    metaTitle: string
    metaDescription: text
    keywords: array<string>
  }
  
  category: reference (可选)
  tags: array<string>
  
  publishedAt: datetime
  author: string
}
```

**配置工作流**：
- Draft 状态：草稿
- Review 状态：待审核（可选）
- Published 状态：已发布

#### 2.2.2 Next.js 集成

**Sanity Client 配置**：
```
配置项：
- projectId
- dataset
- apiVersion
- useCdn
```

**页面实现**：
- 文章列表页：/blog
- 文章详情页：/blog/[slug]
- 分类页：/category/[slug]（可选）

**渲染策略**：
- SSG (Static Site Generation) 或
- ISR (Incremental Static Regeneration)

#### 2.2.3 人工内容创建流程

```
Step 1: 运营登录 Sanity Studio
Step 2: 点击"Create" → "Content Entry"
Step 3: 填写表单：
        - 标题
        - 正文（Markdown 或富文本编辑器）
        - 摘要
        - SEO 元数据
        - 上传封面图
Step 4: 保存为 Draft
Step 5: 预览检查
Step 6: 发布（Publish）
Step 7: 在 Next.js 前台查看
```

### 2.3 验证清单

- ✅ Sanity Studio 能正常创建文章
- ✅ 文章能在 Next.js 前台正确展示
- ✅ SEO 元数据正确（meta title、description、OG tags）
- ✅ 图片 CDN 正常加载
- ✅ 多语言切换正常（en/zh-cn）
- ✅ URL slug 符合 SEO 规范
- ✅ 移动端适配正常

### 2.4 交付物

- ✅ 完整的 Sanity Schema 定义
- ✅ Next.js 文章展示页面
- ✅ 运营使用手册（如何在 Sanity Studio 创建文章）
- ✅ 至少 10 篇手动创建的示例文章

### 2.5 进入 Phase 2 的条件

满足以下条件可进入 Phase 2：
- ✅ Sanity ↔ Next.js 链路稳定，无技术问题
- ✅ 运营团队熟悉 Sanity Studio 操作
- ✅ 文章展示效果符合预期
- ✅ SEO 和多语言功能正常
- ✅ 认可需要提升内容生产效率

---

# 【Phase 2：Claude Code + MCP】

## 三、Phase 2：Claude Code + MCP 自动化

### 3.1 目标

**核心目标**：
- ✅ 通过 Claude Code + Sanity MCP 实现对话式内容生产
- ✅ 验证 AI 生成内容的质量和可用性
- ✅ 快速提升内容生产效率（10 倍）
- ✅ **零开发成本**，无需写代码

**时间**: 1-2 周  
**成本**: 几乎为 0（Claude API 使用费）

**输入输出模型**：
```
输入维度（2维）：
  1. 对话式提示词 ⭐
     └─ 运营输入的自然语言需求
  2. 对话上下文
     └─ 历史对话、追问、反馈

输出维度（1维）：
  └─ 长文博客（AI生成的完整文章）

质量上限：75-85分
  └─ AI的广泛知识储备 + 结构化写作能力
```

**质量提升原因**：
- AI 有广泛的知识储备
- 结构化写作能力强
- 快速迭代优化
- 但缺乏深度数据支撑和视觉元素

### 3.2 技术方案

#### 3.2.1 Sanity MCP 配置

**安装 MCP Server**：
```
参考 Sanity MCP 官方文档配置：
- 安装 Sanity MCP Server
- 配置 mcp.json
- 设置 Sanity Project ID 和 API Token
```

**测试 MCP 工具**：
- `sanity_create_document`: 创建文档
- `sanity_update_document`: 更新文档
- `sanity_query`: 查询文档
- `sanity_delete_document`: 删除文档

#### 3.2.2 Claude Code 工作流

**运营与 Claude Code 对话示例**：

```
运营输入：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
为亚马逊新手卖家写一篇关键词研究入门教程。

要求：
- 字数：2000 字左右
- 语气：专业但通俗易懂
- 语言：英文
- 主关键词：Amazon keyword research for beginners
- 结构：包含引言、步骤详解、常见问题、总结
- 生成后直接写入 Sanity CMS

请开始生成。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claude Code 执行：
1. 理解需求和要求
2. 生成完整文章内容
3. 调用 Sanity MCP 创建 contentEntry
4. 返回 Sanity Studio 编辑链接

Claude Code 回复：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 文章已生成并写入 Sanity CMS

标题：Amazon Keyword Research for Beginners: Complete Guide
字数：2,150 words
状态：Draft（等待审核）

Sanity Studio 链接：
https://your-project.sanity.studio/desk/contentEntry;abc123

请在 Sanity Studio 审核，满意后发布。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 运营工作流程

```
Step 1: 运营在 Claude Code 对话框输入需求
        ├─ 主题、字数、语气、语言
        ├─ 主关键词
        └─ 其他要求

Step 2: Claude Code 生成内容
        ├─ 调用 Claude 3.5 Sonnet 生成文章
        ├─ 自动生成 SEO 元数据
        └─ 调用 Sanity MCP 写入（draft 状态）

Step 3: Claude Code 返回 Sanity Studio 链接

Step 4: 运营在 Sanity Studio 审核
        ├─ 检查内容质量
        ├─ 编辑修改（如需要）
        ├─ 上传封面图
        └─ 发布

Step 5: 自动同步到 Next.js 前台
```

### 3.4 批量生产示例

**一次性创建多篇文章**：

```
运营输入：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
帮我批量生成 5 篇亚马逊运营相关的文章：

1. Amazon keyword research for beginners（2000字）
2. How to optimize Amazon product listings（1800字）
3. Amazon PPC advertising guide（2200字）
4. Amazon FBA vs FBM comparison（1500字）
5. How to increase Amazon sales（2000字）

要求：
- 语言：英文
- 语气：专业
- 全部写入 Sanity CMS（draft状态）

请逐个生成并写入。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.5 优势与局限

#### ✅ 优势

**零开发成本**：
- 无需写一行代码
- 无需搭建前后端系统
- 配置 MCP 即可使用

**灵活性强**：
- 对话式交互，随时调整需求
- 可以边生成边修改
- 支持各种复杂需求

**快速验证**：
- 立即测试 AI 生成效果
- 快速迭代 Prompt 策略
- 低成本试错

**运营友好**：
- 运营人员直接使用，无需技术背景
- 所见即所得
- 学习曲线低

#### ❌ 局限性

**无法规模化**：
- 需要人工逐个对话
- 无法自动调度
- 批量任务仍需人工触发

**缺少管理**：
- 无任务状态管理
- 无质量评分系统
- 无数据统计和分析

**依赖人工**：
- 每次都要写 Prompt
- 无法保存和复用 Prompt 模板
- 审核仍需人工逐篇检查

### 3.6 标准 Prompt 模板

为了提高效率和质量一致性，建议准备 3-5 个标准 Prompt 模板：

**模板 1：长文博客**
```
为 {目标受众} 写一篇关于 {主题} 的深度教程文章。

要求：
- 字数：{字数} 字左右
- 语气：{语气}
- 语言：{语言}
- 主关键词：{主关键词}
- 结构：引言 + 3-5个主要章节 + 总结
- SEO：自动生成 meta title 和 description

生成后直接写入 Sanity CMS（draft状态）。
```

**模板 2：产品对比文章**
```
写一篇对比 {产品A} 和 {产品B} 的文章。

要求：
- 字数：{字数} 字左右
- 对比维度：功能、价格、优缺点、适用场景
- 语言：{语言}
- 主关键词：{主关键词}
- 保持客观中立

生成后直接写入 Sanity CMS（draft状态）。
```

**模板 3：客户案例研究**
```
基于以下信息写一篇客户案例研究：

客户行业：{行业}
挑战：{挑战描述}
解决方案：{解决方案}
成果：{成果数据}

要求：
- 字数：1500-2000 字
- 结构：背景、挑战、解决方案、实施过程、成果、总结
- 语言：{语言}

生成后直接写入 Sanity CMS（draft状态）。
```

### 3.7 交付物

- ✅ Sanity MCP 配置文档
- ✅ Claude Code 使用手册
- ✅ 3-5 个标准 Prompt 模板
- ✅ 通过 Claude Code 生成的 30-50 篇文章
- ✅ 质量评估报告（平均质量分、通过率）

### 3.8 进入 Phase 3 的条件

满足以下条件可考虑进入 Phase 3：
- ✅ AI 生成质量稳定（平均 > 80 分）
- ✅ 运营团队认可 AI 生成效果
- ✅ 月生产量 > 50 篇
- ✅ 需要批量化、自动化、工作流管理
- ✅ 需要数据统计和质量分析
- ✅ 有预算投入系统开发（约 $30k）

---

# 【Phase 3：前后端工程系统】

## 四、Phase 3 概述
### 4.1 Phase 3 目标

**核心目标**：
- ✅ 构建企业级内容自动化生产平台
- ✅ 实现批量化、工作流化、数据化
- ✅ 月生产能力 200-500 篇

**时间**: 4-6 周  
**成本**: $30,000（2 人 × 6 周）

**输入输出模型**：
```
输入维度（4维）⭐：
  1. 主提示词 ⭐⭐⭐
     └─ 运营核心需求描述
  
  2. 关键词数据 ⭐⭐
     └─ 从关键词库选择
     └─ 包含: 关键词、搜索量、难度
     └─ AI可根据搜索量和难度调整策略
  
  3. 语言和字数配置 ⭐
     └─ 明确的质量要求
     └─ 语言: en/zh-cn
     └─ 目标字数: 1500-3000
  
  4. 图片URLs ⭐
     └─ 封面图 + 正文图
     └─ 提升视觉吸引力和可读性

输出维度（2维）⭐：
  1. 长文博客
     └─ 结构化内容
     └─ SEO优化
  
  2. 图片集成
     └─ 封面图
     └─ 正文配图（自动插入合适位置）
     └─ Alt文本

质量上限：85-90分
  └─ 关键词数据增强 + 图片增强 + 结构化配置
```

**质量提升原因**：
- **关键词数据增强**: AI了解搜索意图和竞争度，生成更有针对性的内容
- **图片增强**: 提升可读性和用户体验，增加视觉吸引力
- **结构化配置**: 明确的质量标准（字数、语言），确保输出一致性
- **提示词主导**: 运营的专业需求描述，确保内容方向准确

### 4.2 Phase 3 vs Phase 2 的核心区别

| 维度 | Phase 2 | Phase 3 |
|------|---------|---------|
| 任务创建 | 对话式输入 | 结构化表单 |
| 关键词 | 手动输入 | 从关键词库选择 |
| 图片处理 | 手动上传 | URL输入或自动关联 |
| 批量生产 | 需要重复对话 | 一次创建多个任务 |
| 任务管理 | 无 | 完整工作流 |
| 质量评分 | 手动评估 | 自动评分 |
| 数据统计 | 无 | 完整报表 |

### 4.3 Phase 3 输入表单设计

**任务创建表单字段**（精简版）：

```
┌─────────────────────────────────────────┐
│        内容任务创建表单                  │
├─────────────────────────────────────────┤
│                                          │
│ 1. 主提示词 ⭐                           │
│    ┌────────────────────────────────┐  │
│    │ [Textarea，5-10行]             │  │
│    │ 必填，运营输入的核心需求        │  │
│    │                                 │  │
│    │ 示例：为亚马逊新手卖家写一篇   │  │
│    │ 关键词研究入门教程...          │  │
│    └────────────────────────────────┘  │
│                                          │
│ 2. 主关键词                              │
│    ┌────────────────────────────────┐  │
│    │ [Dropdown Select]              │  │
│    │ 从关键词库拉取，支持搜索        │  │
│    │                                 │  │
│    │ ▼ 选择关键词...                │  │
│    │   Amazon keyword research      │  │
│    │   Amazon SEO                   │  │
│    │   Product listing optimization │  │
│    └────────────────────────────────┘  │
│    提示：选中后显示关键词详情：          │
│    • 搜索量：2,400/月                   │
│    • 难度：65                          │
│                                          │
│ 3. 语言                                  │
│    ┌────────────────────────────────┐  │
│    │ [Dropdown Select]              │  │
│    │ ▼ English (en)                 │  │
│    │   简体中文 (zh-cn)             │  │
│    └────────────────────────────────┘  │
│                                          │
│ 4. 目标字数                              │
│    ┌────────────────────────────────┐  │
│    │ [Dropdown Select]              │  │
│    │ ▼ 1500字                       │  │
│    │   2000字（推荐）               │  │
│    │   2500字                       │  │
│    │   3000字                       │  │
│    │   自定义...                    │  │
│    └────────────────────────────────┘  │
│                                          │
│ 5. 封面图片 URL（可选）                  │
│    ┌────────────────────────────────┐  │
│    │ [Text Input]                   │  │
│    │ https://...                    │  │
│    └────────────────────────────────┘  │
│    提示：留空则生成后在Sanity上传       │
│                                          │
│ 6. 正文图片 URLs（可选）                 │
│    ┌────────────────────────────────┐  │
│    │ [Textarea，多行]               │  │
│    │ https://image1.jpg             │  │
│    │ https://image2.jpg             │  │
│    │ https://image3.jpg             │  │
│    └────────────────────────────────┘  │
│    提示：每行一个URL，AI会在合适位置    │
│          插入图片                      │
│                                          │
│    [取消]  [保存草稿]  [创建任务]      │
│                                          │
└─────────────────────────────────────────┘
```

### 4.4 关键词库设计（MVP 简化版）

**数据表结构**：
```sql
CREATE TABLE keywords (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  keyword VARCHAR(200) NOT NULL,
  language VARCHAR(10) NOT NULL,
  search_volume INT DEFAULT 0,
  difficulty INT DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_language (language),
  INDEX idx_priority (priority)
);
```

**前端下拉选择器**：
```
功能：
- 支持搜索过滤（输入关键词名称）
- 显示关键词详情（搜索量、难度）
- 按优先级排序显示
- 支持多语言筛选（en/zh-cn）

示例数据：
┌──────────────────────────────────────────┐
│ 搜索框: [ Amazon keyword...         ▼ ] │
├──────────────────────────────────────────┤
│ ✓ Amazon keyword research               │
│   └─ 搜索量：2,400/月  难度：65         │
│                                          │
│   Amazon SEO                            │
│   └─ 搜索量：1,800/月  难度：70         │
│                                          │
│   Product listing optimization          │
│   └─ 搜索量：1,200/月  难度：58         │
└──────────────────────────────────────────┘
```

### 4.5 图片处理方案

#### 方案 1：URL 输入（MVP 推荐）⭐

**优势**：
- 实现简单
- 运营提前准备好图片
- 图片托管在 CDN，性能好

**流程**：
```
Step 1: 运营提前上传图片到 CDN
        └─ 或使用现有图片库

Step 2: 在任务创建表单输入图片 URL
        ├─ 封面图：单个 URL
        └─ 正文图：多个 URL（每行一个）

Step 3: Content Agent 生成文章时
        ├─ 封面图：直接使用
        └─ 正文图：在合适位置插入
            • 识别文章段落
            • 在章节之间插入图片
            • 生成 alt 文本

Step 4: 写入 Sanity 时
        └─ 将 URL 转换为 Sanity Image Reference

Step 5: 运营在 Sanity Studio 审核时
        └─ 可以调整图片位置
        └─ 可以上传新图片替换
```

**Prompt 策略**：
```
System Prompt 补充：

当用户提供图片 URL 时：
1. 封面图：作为文章的主图
2. 正文图：在合适的位置插入（章节之间、重点段落后）
3. 为每张图片生成描述性 alt 文本
4. 图片标注格式：![alt文本](图片URL)
```

#### 方案 2：Sanity 上传（人工补充）

**优势**：
- 利用 Sanity 的图片管理能力
- 自动优化和 CDN
- 运营更灵活

**流程**：
```
Step 1: Content Agent 生成文章（不含图片）

Step 2: 写入 Sanity（draft 状态）

Step 3: 运营在 Sanity Studio 审核时
        ├─ 上传封面图
        └─ 在正文中插入图片
            • 使用 Sanity 的图片字段
            • 拖拽上传
            • 自动处理和优化

Step 4: 审核完成后发布
```

#### 推荐策略（混合）⭐

```
场景 1: 运营已有图片
  └─ 使用方案 1（URL 输入）

场景 2: 运营没有图片
  └─ 先生成文章，后在 Sanity 上传（方案 2）

场景 3: 部分有图片
  └─ 封面图用 URL，正文图后补
```

### 4.6 任务数据模型（更新版）

```
TaskInput {
  // 核心字段
  prompt: string              ⭐ 运营输入的主提示词（必填）
  keywordId: number           ⭐ 从关键词库选择（必填）
  language: enum              ⭐ 语言：en | zh-cn（必填）
  targetLength: enum          ⭐ 目标字数：1500 | 2000 | 2500 | 3000 | custom（必填）
  
  // 图片字段（可选）
  coverImageUrl: string       封面图片 URL（可选）
  contentImageUrls: string[]  正文图片 URL 列表（可选）
  
  // 元数据
  createdBy: string           创建人
  createdAt: datetime         创建时间
}
```

**示例输入**：
```json
{
  "prompt": "为亚马逊新手卖家写一篇关键词研究入门教程，要通俗易懂，包含具体步骤和工具推荐",
  "keywordId": 123,
  "language": "en",
  "targetLength": 2000,
  "coverImageUrl": "https://cdn.example.com/images/keyword-research-cover.jpg",
  "contentImageUrls": [
    "https://cdn.example.com/images/keyword-tool-screenshot.jpg",
    "https://cdn.example.com/images/keyword-analysis-chart.jpg"
  ],
  "createdBy": "operator_001"
}
```

### 4.7 Content Agent 增强（支持图片）

**Prompt 增强**：

```
User Prompt（动态构建）：

{运营输入的提示词}

关键词信息：
- 主关键词：{keyword.keyword}
- 搜索量：{keyword.searchVolume}/月
- 难度：{keyword.difficulty}

要求：
- 字数：{targetLength} 字左右
- 语言：{language}
- 自然融入主关键词，避免堆砌

[图片处理]
封面图：{coverImageUrl}（如果提供）
正文图片：
{contentImageUrls[0]}
{contentImageUrls[1]}
{contentImageUrls[2]}

图片使用要求：
1. 封面图作为文章主图
2. 正文图片在合适位置插入（章节之间、重点段落后）
3. 为每张图片生成描述性 alt 文本
4. 图片格式：![alt文本](图片URL)

文章结构：
- 标题：吸引人、包含关键词、50-60 字符
- 摘要：150-200 字，概括核心内容
- 正文：使用 Markdown 格式，包含 H2/H3 小标题
- SEO：生成 metaTitle（50-60字符）、metaDescription（120-160字符）

输出格式（严格 JSON）：
{
  "title": "文章标题",
  "summary": "文章摘要",
  "body": "正文内容（Markdown格式，包含图片）",
  "coverImageUrl": "封面图URL",
  "metaTitle": "SEO标题",
  "metaDescription": "SEO描述",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

### 4.8 Sanity 写入逻辑（支持图片）

```
写入流程：

1. 解析 Content Agent 输出

2. 处理封面图
   IF coverImageUrl 存在：
     └─ 转换为 Sanity Image Reference
        （或直接使用 URL，取决于 Sanity 配置）

3. 处理正文内容
   ├─ 解析 Markdown 中的图片标记
   ├─ 转换为 Sanity Portable Text 格式
   └─ 将图片 URL 转换为 Image Block

4. 创建 contentEntry 文档
   {
     title: "...",
     slug: "...",
     summary: "...",
     body: [...], // Portable Text with images
     coverImage: {
       asset: {
         _type: "reference",
         _ref: "image-xxx" // 或直接 URL
       },
       alt: "..."
     },
     seoMetadata: {...},
     language: "en",
     aiGenerated: true,
     ...
   }

5. 保存为 draft 状态

6. 返回 Sanity Studio 链接
```

---
- 复杂的人工反馈和迭代优化
- CRM 集成、AI 图片生成、知识库集成
- 多语言复杂支持（MVP 只支持 en/zh-cn 基础切换）

### 1.3 MVP 核心理念

```
运营主导 + AI 辅助 + 数据增强

运营输入（提示词 + 配置） 
    ↓
AI 生成（Content Agent）
    ↓
Sanity CMS（存储 + 审核）
    ↓
Next.js（发布展示）
```

**设计原则**：
1. **简单至上**：最少的字段、最简的流程
2. **运营主导**：提示词是核心输入，AI 严格执行
3. **快速验证**：2-3 周交付，快速获得反馈
4. **可扩展性**：为后期演进预留接口

---

## 五、Phase 3 系统架构

### 5.1 系统全景图

```
┌─────────────────────────────────────────────┐
│          前端：任务创建界面                  │
│  ┌───────────────────────────────────────┐ │
│  │ 表单字段：                             │ │
│  │ • 主提示词（textarea，必填）⭐        │ │
│  │ • 主关键词（dropdown，从库选择）⭐    │ │
│  │ • 语言（dropdown: en/zh-cn）⭐        │ │
│  │ • 目标字数（dropdown: 1500-3000）⭐   │ │
│  │ • 封面图URL（text，可选）             │ │
│  │ • 正文图URLs（textarea，可选）        │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│     后端：Spring Boot + Spring AI          │
│  ┌───────────────────────────────────────┐ │
│  │ 任务管理 API                          │ │
│  │ 关键词库 API                          │ │
│  │ Content Agent（单一 Agent，含图片）  │ │
│  │ Sanity 集成服务（含图片处理）        │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Sanity CMS                         │
│  • 存储生成的文章（draft 状态）            │
│  • 支持图片（URL 或上传）                  │
│  • 运营在 Studio 审核、补充图片、发布      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Next.js 前台网站                   │
│  • 展示已发布的文章（含图片）              │
└─────────────────────────────────────────────┘
```

### 5.2 数据库设计

**tasks 表**：
```sql
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  prompt TEXT NOT NULL COMMENT '运营输入的主提示词',
  keyword_id BIGINT NOT NULL COMMENT '关键词ID',
  language VARCHAR(10) NOT NULL COMMENT '语言: en/zh-cn',
  target_length INT NOT NULL COMMENT '目标字数',
  cover_image_url VARCHAR(500) COMMENT '封面图URL',
  content_image_urls TEXT COMMENT '正文图片URLs（JSON数组）',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'pending/processing/completed/failed',
  result_data JSON COMMENT '生成结果',
  error_message TEXT COMMENT '错误信息',
  quality_score INT COMMENT '质量评分(0-100)',
  sanity_document_id VARCHAR(100) COMMENT 'Sanity文档ID',
  created_by VARCHAR(100) NOT NULL COMMENT '创建人',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_keyword (keyword_id),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
);
```

**keywords 表**：
```sql
CREATE TABLE keywords (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  keyword VARCHAR(200) NOT NULL COMMENT '关键词',
  language VARCHAR(10) NOT NULL COMMENT '语言',
  search_volume INT DEFAULT 0 COMMENT '月搜索量',
  difficulty INT DEFAULT 0 COMMENT '竞争难度(0-100)',
  priority VARCHAR(20) DEFAULT 'medium' COMMENT '优先级: high/medium/low',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_keyword_language (keyword, language),
  INDEX idx_language (language),
  INDEX idx_priority (priority)
);
```

**关键词初始数据示例**：
```sql
INSERT INTO keywords (keyword, language, search_volume, difficulty, priority) VALUES
('Amazon keyword research', 'en', 2400, 65, 'high'),
('Amazon SEO', 'en', 1800, 70, 'high'),
('Product listing optimization', 'en', 1200, 58, 'medium'),
('亚马逊关键词研究', 'zh-cn', 1500, 60, 'high'),
('亚马逊SEO优化', 'zh-cn', 1200, 65, 'high');
```

---

## 六、Phase 3 核心流程

### 6.1 端到端流程

```
Step 1: 运营创建任务
  └─ 在前端表单填写：
      • 主提示词："为亚马逊新手卖家..."
      • 主关键词：从下拉选择"Amazon keyword research"
      • 语言：English (en)
      • 目标字数：2000
      • 封面图URL：https://... (可选)
      • 正文图URLs：https://...\nhttps://... (可选)

Step 2: 提交到后端
  └─ POST /api/v1/tasks
  └─ 保存到数据库（status: pending）
  └─ 返回 taskId

Step 3: Content Agent 处理
  └─ 从队列获取任务
  └─ 查询关键词详情（搜索量、难度）
  └─ 构建增强 Prompt（包含关键词信息和图片URL）
  └─ 调用 Claude 生成文章（包含图片标记）
  └─ 解析 JSON 结果
  └─ 更新任务状态（status: completed）

Step 4: 写入 Sanity CMS
  └─ 处理封面图（URL → Sanity Image Reference）
  └─ 处理正文图（Markdown → Portable Text with Images）
  └─ 创建 contentEntry 文档（draft 状态）
  └─ 返回 Sanity Studio URL

Step 5: 运营审核
  └─ 在 Sanity Studio 查看文章
  └─ 检查内容和图片
  └─ 如需要，上传新图片或调整图片位置
  └─ 审核通过后发布

Step 6: Next.js 展示
  └─ 从 Sanity 获取已发布文章
  └─ 在前台网站展示（含图片）
```

### 6.2 关键词库交互流程

```
前端加载：
  └─ GET /api/v1/keywords?language=en
  └─ 返回关键词列表
      [
        {
          id: 1,
          keyword: "Amazon keyword research",
          searchVolume: 2400,
          difficulty: 65,
          priority: "high"
        },
        ...
      ]

下拉选择器：
  └─ 展示关键词 + 搜索量 + 难度
  └─ 支持搜索过滤
  └─ 选中后将 keywordId 提交

Content Agent：
  └─ 根据 keywordId 查询关键词详情
  └─ 将关键词信息添加到 Prompt
  └─ AI 生成时考虑关键词的搜索量和难度
```

### 6.3 图片处理流程

**场景 1：运营提供图片 URL**

```
前端输入：
  coverImageUrl: "https://cdn.example.com/cover.jpg"
  contentImageUrls: [
    "https://cdn.example.com/image1.jpg",
    "https://cdn.example.com/image2.jpg"
  ]
    ↓
Content Agent：
  └─ 生成文章时在 body 中插入图片
      # Introduction
      
      ![Keyword research tool interface](https://cdn.example.com/image1.jpg)
      
      ## Step 1: Find seed keywords
      ...
      
      ![Keyword analysis chart](https://cdn.example.com/image2.jpg)
    ↓
Sanity 写入：
  └─ 转换 Markdown 为 Portable Text
  └─ 图片标记转为 Image Block
      {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-xxx' // 或直接URL
        },
        alt: 'Keyword analysis chart'
      }
```

**场景 2：运营未提供图片**

```
前端输入：
  coverImageUrl: null
  contentImageUrls: []
    ↓
Content Agent：
  └─ 生成文章（不含图片）
    ↓
Sanity 写入：
  └─ 创建文章（无图片）
    ↓
运营审核：
  └─ 在 Sanity Studio 手动上传图片
  └─ 拖拽插入正文
```

---

## 七、Phase 3 数据模型

### 7.1 任务输入模型（最终版）

```
TaskInput {
  // 核心字段（必填）
  prompt: string              ⭐ 运营输入的主提示词
  keywordId: number           ⭐ 从关键词库选择的关键词ID
  language: "en" | "zh-cn"    ⭐ 语言
  targetLength: 1500 | 2000 | 2500 | 3000  ⭐ 目标字数
  
  // 图片字段（可选）
  coverImageUrl: string | null        封面图片URL
  contentImageUrls: string[] | null   正文图片URL列表
  
  // 元数据
  createdBy: string           创建人
  createdAt: datetime         创建时间
}
```

**前端表单验证**：
```
必填字段：
- prompt: 最少 20 字符
- keywordId: 必须从下拉选择
- language: 默认 en
- targetLength: 默认 2000

可选字段：
- coverImageUrl: URL 格式验证
- contentImageUrls: 每行一个 URL，格式验证
```

### 7.2 文章输出模型

```
ArticleOutput {
  title: string               文章标题
  slug: string                URL slug（自动生成）
  summary: string             摘要（150-200字）
  body: string                正文（Markdown格式，含图片标记）
  wordCount: number           字数统计
  
  coverImageUrl: string       封面图URL
  
  metaTitle: string           SEO标题（50-60字符）
  metaDescription: string     SEO描述（120-160字符）
  keywords: string[]          关键词列表
  
  language: string            语言
  status: "draft"             状态（固定为draft）
  qualityScore: number        质量评分（0-100）
  
  createdAt: datetime         创建时间
  sanityDocumentId: string    Sanity文档ID
}
```

### 7.3 关键词模型

```
KeywordEntry {
  id: number
  keyword: string             关键词
  language: string            语言
  searchVolume: number        月搜索量
  difficulty: number          竞争难度(0-100)
  priority: string            优先级(high/medium/low)
  createdAt: datetime
  updatedAt: datetime
}
```

---

### 2.1 系统全景图

```
┌─────────────────────────────────────────────┐
│          前端：任务创建界面                  │
│  ┌───────────────────────────────────────┐ │
│  │ 表单字段：                             │ │
│  │ • 提示词（textarea，必填）⭐          │ │
│  │ • 主关键词（text，必填）              │ │
│  │ • 目标字数（number，默认2000）        │ │
│  │ • 语气（select，默认professional）    │ │
│  │ • 语言（select，默认en）              │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│     后端：Spring Boot + Spring AI          │
│  ┌───────────────────────────────────────┐ │
│  │ 任务管理 API                          │ │
│  │ Content Agent（单一 Agent）           │ │
│  │ Sanity 集成服务                       │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Sanity CMS                         │
│  • 存储生成的文章（draft 状态）            │
│  • 运营在 Studio 审核和发布                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Next.js 前台网站                   │
│  • 展示已发布的文章                         │
└─────────────────────────────────────────────┘
```


### 2.2 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Vue 3 | 3.4+ | 轻量、响应式 |
| UI 组件 | Element Plus / Vben Admin | Latest | 快速搭建表单 |
| 状态管理 | Pinia | 2.1+ | 简单状态管理 |
| HTTP 客户端 | Axios | 1.6+ | API 请求 |
| 后端框架 | Spring Boot | 3.2+ | 企业级框架 |
| AI 集成 | Spring AI | 1.0+ | LLM 抽象层 |
| 数据库 | MySQL | 8.0+ | 关系型数据库 |
| 缓存 | Redis | 7.0+ | 可选，用于任务队列 |
| 容器化 | Docker | 20.10+ | 一键部署 |
| CMS | Sanity | 3.0+ | 无头 CMS |
| AI 模型 | Claude 3.5 Sonnet | Latest | 内容生成 |

### 2.3 数据库设计（MVP 简化版）

**tasks 表**（任务记录）：
```
id              bigint          主键
prompt          text            运营输入的提示词 ⭐
primary_keyword varchar(200)    主关键词
target_length   int             目标字数
tone            varchar(50)     语气
language        varchar(10)     语言
status          varchar(20)     状态：pending/processing/completed/failed
result_data     json            生成结果（JSON格式）
error_message   text            错误信息
created_by      varchar(100)    创建人
created_at      datetime        创建时间
updated_at      datetime        更新时间
```

**keywords 表**（关键词库，可选）：
```
id              bigint          主键
keyword         varchar(200)    关键词
language        varchar(10)     语言
search_volume   int             月搜索量
difficulty      int             竞争难度(0-100)
priority        varchar(20)     优先级
created_at      datetime        创建时间
```

---

## 三、MVP 核心流程

### 3.1 端到端流程

```
Step 1: 运营创建任务
  └─ 在前端表单填写：
      • 提示词："为亚马逊新手卖家写一篇关键词研究入门教程"
      • 主关键词："Amazon keyword research"
      • 目标字数：2000
      • 语气：professional
      • 语言：en

Step 2: 提交到后端
  └─ POST /api/v1/tasks
  └─ 保存到数据库（status: pending）
  └─ 返回 taskId

Step 3: Content Agent 处理
  └─ 从队列获取任务
  └─ 构建 Prompt 发送给 Claude
  └─ Claude 返回 JSON 格式的文章
  └─ 解析和验证
  └─ 更新任务状态（status: completed）

Step 4: 写入 Sanity CMS
  └─ 调用 Sanity API
  └─ 创建 contentEntry 文档（draft 状态）
  └─ 返回 Sanity Studio URL

Step 5: 运营审核
  └─ 在 Sanity Studio 查看文章
  └─ 审核、编辑、发布

Step 6: Next.js 展示
  └─ 从 Sanity 获取已发布文章
  └─ 在前台网站展示
```


### 3.2 Content Agent 工作流程

**单一 Agent，一次性完成所有任务**：

```
Content Agent（All-in-One）
  │
  ├─ 接收输入
  │   └─ 提示词、主关键词、配置参数
  │
  ├─ 构建 Prompt
  │   ├─ System Prompt（角色定义）
  │   ├─ User Prompt（运营输入的提示词）
  │   └─ 要求（字数、语气、SEO、格式）
  │
  ├─ 调用 Claude API
  │   └─ 一次性生成完整内容（JSON 格式）
  │
  ├─ 解析和验证
  │   ├─ 验证 JSON 格式
  │   ├─ 验证必填字段
  │   └─ 基础质量检查（字数、关键词）
  │
  └─ 返回结果
      └─ title、summary、body、metaTitle、metaDescription、keywords
```

### 3.3 Prompt 设计策略

**System Prompt**（固定）：
```
你是一个专业的内容创作 AI，负责生成高质量的 SEO 优化博客文章。

你的职责：
1. 理解用户意图，生成相关且有价值的内容
2. 确保内容原创、准确、可读
3. 自然融入 SEO 关键词
4. 遵循指定的字数和语气要求
5. 输出结构化的 JSON 格式
```

**User Prompt**（动态构建）：
```
{运营输入的提示词}

要求：
- 字数：{targetLength} 字左右
- 语气：{tone}（professional/casual/technical）
- 主关键词：{primaryKeyword}（自然融入文章，避免堆砌）
- 语言：{language}

文章结构：
- 标题：吸引人、包含关键词、50-60 字符
- 摘要：150-200 字，概括核心内容
- 正文：使用 Markdown 格式，包含 H2/H3 小标题
- SEO：生成 metaTitle（50-60字符）、metaDescription（120-160字符）

输出格式（严格 JSON）：
{
  "title": "文章标题",
  "summary": "文章摘要",
  "body": "正文内容（Markdown格式）",
  "metaTitle": "SEO标题",
  "metaDescription": "SEO描述",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

---

## 四、MVP 数据模型

### 4.1 任务输入模型

```
TaskInput {
  prompt: string              ⭐ 运营输入的提示词（必填）
  primaryKeyword: string      主关键词（必填）
  targetLength: number        目标字数（默认：2000）
  tone: enum                  语气（professional/casual/technical）
  language: enum              语言（en/zh-cn）
  createdBy: string           创建人
}
```

**示例**：
```json
{
  "prompt": "为亚马逊新手卖家写一篇关键词研究入门教程，要通俗易懂，包含具体步骤",
  "primaryKeyword": "Amazon keyword research for beginners",
  "targetLength": 2000,
  "tone": "professional",
  "language": "en",
  "createdBy": "operator_001"
}
```


### 4.2 文章输出模型

```
ArticleOutput {
  title: string               文章标题
  slug: string                URL slug（自动生成）
  summary: string             摘要（150-200字）
  body: string                正文（Markdown格式）
  wordCount: number           字数统计
  
  metaTitle: string           SEO标题（50-60字符）
  metaDescription: string     SEO描述（120-160字符）
  keywords: string[]          关键词列表
  
  language: string            语言
  status: string              状态（固定为"draft"）
  qualityScore: number        质量评分（0-100，可选）
  
  createdAt: datetime         创建时间
  sanityDocumentId: string    Sanity文档ID
}
```

**示例**：
```json
{
  "title": "Amazon Keyword Research for Beginners: Complete Guide",
  "slug": "amazon-keyword-research-beginners-guide",
  "summary": "Learn how to conduct effective keyword research for Amazon...",
  "body": "# Introduction\n\n## What is Keyword Research?\n\n...",
  "wordCount": 2150,
  "metaTitle": "Amazon Keyword Research Guide for Beginners (2026)",
  "metaDescription": "Master Amazon keyword research with our step-by-step guide...",
  "keywords": ["Amazon keyword research", "Amazon SEO", "product keywords"],
  "language": "en",
  "status": "draft",
  "qualityScore": 85,
  "createdAt": "2026-07-28T10:30:00Z",
  "sanityDocumentId": "abc123def456"
}
```

### 4.3 Sanity Schema（MVP 简化版）

```
contentEntry {
  name: 'contentEntry'
  title: 'Content Entry'
  type: 'document'
  fields: [
    {
      name: 'title'
      title: 'Title'
      type: 'string'
      validation: Required
    },
    {
      name: 'slug'
      title: 'Slug'
      type: 'slug'
      options: { source: 'title' }
    },
    {
      name: 'language'
      title: 'Language'
      type: 'string'
      options: { list: ['en', 'zh-cn'] }
    },
    {
      name: 'summary'
      title: 'Summary'
      type: 'text'
    },
    {
      name: 'body'
      title: 'Body'
      type: 'markdown'  // 或 'text'，取决于 Sanity 配置
    },
    {
      name: 'seoMetadata'
      title: 'SEO Metadata'
      type: 'object'
      fields: [
        { name: 'metaTitle', type: 'string' },
        { name: 'metaDescription', type: 'text' },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }] }
      ]
    },
    {
      name: 'aiGenerated'
      title: 'AI Generated'
      type: 'boolean'
      initialValue: true
    },
    {
      name: 'qualityScore'
      title: 'Quality Score'
      type: 'number'
    }
  ]
}
```

---

## 五、MVP 实施计划

### 5.1 三周开发计划

#### Week 1: 基础框架搭建

**Day 1-2: 项目初始化**
- [ ] 前端：Vue 3 项目初始化，安装 Element Plus/Vben Admin
- [ ] 后端：Spring Boot 项目初始化，集成 Spring AI
- [ ] Docker：编写 docker-compose.yml
- [ ] 数据库：MySQL 初始化脚本（tasks 表）

**Day 3-4: 任务创建功能**
- [ ] 前端：任务创建表单（5 个字段）
- [ ] 后端：任务管理 API（POST /api/v1/tasks、GET /api/v1/tasks、GET /api/v1/tasks/{id}）
- [ ] 数据库：任务数据存储
- [ ] 前后端联调测试

**Day 5: Sanity 集成准备**
- [ ] 配置 Sanity Client
- [ ] 实现 contentEntry 创建 API
- [ ] 测试 draft 文档创建
- [ ] 验证 Sanity Studio 查看

#### Week 2: AI Agent 开发

**Day 6-7: Content Agent 核心**
- [ ] 集成 Claude 3.5 Sonnet（Spring AI）
- [ ] 实现 Prompt 构建逻辑
- [ ] 实现 JSON 解析和验证
- [ ] 单元测试

**Day 8-9: 端到端集成**
- [ ] 前端提交 → 后端接收 → Agent 生成 → Sanity 写入
- [ ] 异步任务处理（可选用 Redis Queue）
- [ ] 错误处理和重试机制
- [ ] 状态更新和通知

**Day 10: 流程测试**
- [ ] 创建 5 个不同类型的任务测试
- [ ] 验证生成质量
- [ ] 调试和优化 Prompt
- [ ] 性能测试

#### Week 3: 优化和交付

**Day 11-12: 质量提升**
- [ ] Prompt 优化（提升生成质量到 80+ 分）
- [ ] 添加质量评分逻辑
- [ ] 失败任务重试机制
- [ ] 日志和监控

**Day 13-14: 用户体验**
- [ ] 前端：加载状态和进度展示
- [ ] 前端：任务列表和详情页
- [ ] 前端：错误提示优化
- [ ] 后端：API 性能优化

**Day 15: 部署和交付**
- [ ] Docker 一键部署测试
- [ ] 编写部署文档
- [ ] 编写使用手册
- [ ] 演示和培训

### 5.2 验收标准

**功能验收**：
- ✅ 运营能在前端表单创建任务
- ✅ 任务能正确保存到数据库
- ✅ Content Agent 能生成 2000 字左右的文章
- ✅ 文章能自动写入 Sanity CMS（draft 状态）
- ✅ 运营能在 Sanity Studio 查看和编辑文章
- ✅ 运营能发布文章到 Next.js 前台

**质量验收**：
- ✅ 生成的文章质量评分 > 80 分
- ✅ 文章结构完整（标题、摘要、正文、SEO）
- ✅ 关键词自然融入，无堆砌
- ✅ 字数符合要求（±10%）

**性能验收**：
- ✅ 任务创建响应时间 < 1 秒
- ✅ 文章生成时间 < 3 分钟
- ✅ 端到端流程 < 10 分钟
- ✅ 系统稳定运行，无崩溃

---

## 六、MVP 部署方案

### 6.1 Docker Compose 配置

**服务列表**：
- Frontend（Nginx + Vue 构建产物）
- Backend（Spring Boot）
- MySQL（数据库）
- Redis（可选，用于任务队列）

### 6.2 环境变量配置

```bash
# .env
# Claude AI
ANTHROPIC_API_KEY=sk-ant-xxx

# Sanity CMS
SANITY_PROJECT_ID=xxx
SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# MySQL
MYSQL_ROOT_PASSWORD=xxx
MYSQL_DATABASE=content_automation
MYSQL_USER=app_user
MYSQL_PASSWORD=xxx

# 应用配置
APP_PORT=8080
LOG_LEVEL=INFO
```

### 6.3 快速开始

```bash
# 1. 克隆项目
git clone <repo-url>
cd content-automation-platform

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填写实际配置

# 3. 一键启动
docker-compose up -d

# 4. 访问
# 前端：http://localhost
# 后端：http://localhost:8080
# API文档：http://localhost:8080/swagger-ui.html
```

### 6.4 投资预算

**开发成本**：
- 人力：2 人 × 3 周 × $5000/人周 = **$30,000**

**运营成本（月度）**：
- 云服务器：$400/月
- MySQL + Redis：$200/月
- Claude API：$1000-2000/月（按使用量）
- Sanity CMS：$199/月（Pro 计划）
- **总计：约 $1,800-2,800/月**

**ROI 分析**：
- 传统人工写作：$50/篇，20 篇/月 = $1000/月
- AI 自动化：$5/篇，200 篇/月 = $1000/月
- **效率提升：10 倍，成本降低：90%**
- **回本周期：约 1-2 个月**

---

# 【第二部分：演进与扩展】

## 七、系统演进路线

### 7.1 三阶段渐进式演进

```
Phase 1: 人工手动上传
    ↓
Phase 2: Claude Code + MCP 自动化
    ↓
Phase 3: 前后端工程系统化
```

---

### 7.2 Phase 1：人工手动上传（1-2 周）

#### 目标
验证 Sanity CMS 和 Next.js 的内容发布流程，打通基础链路。

#### 工作内容

**1. Sanity Studio 配置**
- 设计 contentEntry Schema（标题、正文、SEO、分类等）
- 配置字段验证和必填项
- 设置发布工作流（draft → published）

**2. Next.js 集成**
- 配置 Sanity Client
- 实现内容获取 API
- 创建文章详情页和列表页
- 配置 ISR/SSG

**3. 人工内容创建**
- 运营在 Sanity Studio 手动创建文章
- 填写标题、正文、SEO 元数据
- 上传封面图
- 审核后发布

**4. 验证流程**
- Sanity Studio 创建 → 发布 → Next.js 展示
- 确认 SEO 元数据正确
- 确认图片 CDN 正常
- 确认多语言支持（en/zh-cn）

#### 交付物
- ✅ 完整的 Sanity Schema
- ✅ Next.js 文章展示页面
- ✅ 发布流程文档
- ✅ 至少 10 篇手动创建的示例文章

#### 决策点
满足以下条件可进入 Phase 2：
- ✅ Sanity ↔ Next.js 链路稳定
- ✅ 运营熟悉 Sanity Studio 操作
- ✅ 文章展示效果符合预期
- ✅ SEO 和多语言功能正常

---

### 7.3 Phase 2：Claude Code + MCP 自动化（1-2 周）

#### 目标
通过 Claude Code + Sanity MCP 实现对话式内容生产，无需开发前后端。

#### 工作内容

**1. 配置 Sanity MCP**
- 安装 Sanity MCP Server
- 配置 Sanity 项目 ID 和 API Token
- 测试 MCP 工具调用（创建、更新、查询文档）

**2. Claude Code 工作流**
运营与 Claude Code 对话生成内容：

```
运营：
"为亚马逊新手卖家写一篇关键词研究入门教程，
2000字左右，专业语气，包含具体步骤。
主关键词是 'Amazon keyword research for beginners'。
生成后直接写入 Sanity。"

Claude Code：
1. 理解需求
2. 生成完整文章（标题、摘要、正文、SEO）
3. 调用 Sanity MCP 工具创建 contentEntry
4. 返回 Sanity Studio 链接供审核
```

**3. 运营工作流**
```
Step 1: 运营在 Claude Code 对话框输入需求
Step 2: Claude Code 生成内容并写入 Sanity（draft）
Step 3: 运营在 Sanity Studio 审核
Step 4: 审核通过后发布
Step 5: 自动同步到 Next.js
```

**4. 批量生产测试**
- 一次对话创建多篇文章
- 测试不同主题和语气
- 验证质量稳定性
- 优化 Prompt 策略

#### 优势
- ✅ **零开发成本**：无需写代码
- ✅ **灵活调整**：对话式交互，随时修改需求
- ✅ **快速验证**：立即测试 AI 生成效果
- ✅ **低门槛**：运营人员直接使用

#### 局限性
- ❌ 无法批量调度
- ❌ 无法自动化触发
- ❌ 缺少工作流管理
- ❌ 缺少质量评分和统计

#### 交付物
- ✅ Sanity MCP 配置文档
- ✅ Claude Code 使用手册
- ✅ 标准 Prompt 模板（3-5 个）
- ✅ 通过 Claude Code 生成的 30-50 篇文章

#### 决策点
满足以下条件可进入 Phase 3：
- ✅ AI 生成质量稳定（> 80 分）
- ✅ 月生产量 > 50 篇
- ✅ 运营团队认可 AI 生成效果
- ✅ 需要批量化、自动化、工作流管理

---

### 7.4 Phase 3：前后端工程系统化（4-6 周）

#### 目标
构建企业级内容自动化生产平台，实现批量化、工作流化、数据化。

#### 工作内容

**1. 前端系统（Vue 3 + Vben Admin）**
- 任务创建界面（提示词 + 配置）
- 任务列表和状态管理
- 任务详情和审核界面
- 数据统计和可视化（生产量、质量分布、效率分析）

**2. 后端系统（Spring Boot + Spring AI）**
- 任务管理 API
- Content Agent（单一 Agent，后期可演进为 Multi-Agent）
- Sanity 集成服务
- 任务队列和调度
- 质量评分系统

**3. 数据库设计**
- tasks 表：任务记录
- keywords 表：关键词库（可选）
- templates 表：提示词模板（可选）
- 其他表按需扩展

**4. 核心功能**
- 批量任务创建
- 自动化调度
- 质量评分和筛选
- 失败重试
- 数据统计和报表

**5. 高级功能（可选）**
- 提示词模板库
- 关键词库和分类库
- 人工反馈和迭代
- Multi-Agent 架构
- 多样化输出（短文案、社交媒体）

#### 优势
- ✅ **批量化**：一次创建 100+ 任务
- ✅ **自动化**：定时调度、自动执行
- ✅ **工作流化**：任务状态管理、审核流程
- ✅ **数据化**：质量评分、效果追踪、ROI 分析
- ✅ **可扩展**：支持 Multi-Agent、多语言、多输出类型

#### 交付物
- ✅ 完整的前后端系统
- ✅ Docker 一键部署
- ✅ API 文档
- ✅ 使用手册和部署文档
- ✅ 月生产能力 200+ 篇

#### 后续演进
- Phase 3.1：Multi-Agent 架构
- Phase 3.2：结构化知识库（素材库、客户数据）
- Phase 3.3：多语言支持
- Phase 3.4：扩展功能（AI 图片、CRM 集成）

---

### 7.5 三阶段对比

| 维度 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| **时间** | 1-2 周 | 1-2 周 | 4-6 周 |
| **成本** | 几乎为 0 | 几乎为 0 | $30k |
| **生产方式** | 人工手动 | 对话式 AI 生成 | 系统化批量生产 |
| **月产量** | 10-20 篇 | 50-100 篇 | 200-500 篇 |
| **运营工作量** | 100% | 80%（审核） | 20%（配置+审核） |
| **自动化程度** | 0% | 30% | 90% |
| **适用场景** | 流程验证 | 快速生产 | 规模化运营 |
| **核心价值** | 打通链路 | 验证 AI 效果 | 降本增效 |

### 7.6 演进决策树

```
开始
  ↓
Phase 1: 人工手动（1-2周）
  ├─ 是否打通 Sanity ↔ Next.js？
  │   ├─ 否 → 继续 Phase 1
  │   └─ 是 ↓
  │
Phase 2: Claude Code + MCP（1-2周）
  ├─ AI 生成质量是否 > 80分？
  │   ├─ 否 → 优化 Prompt，继续 Phase 2
  │   └─ 是 ↓
  ├─ 月产量是否 > 50篇？
  │   ├─ 否 → 继续使用 Phase 2
  │   └─ 是 ↓
  ├─ 是否需要批量化、自动化？
  │   ├─ 否 → 继续使用 Phase 2
  │   └─ 是 ↓
  │
Phase 3: 前后端工程（4-6周）
  └─ 持续优化和扩展
```

---

---

## 八、完整输入体系设计

> **说明**：以下设计供 Phase 2-3 参考实现

### 8.1 三层输入架构

```
【核心层】运营用户输入 ⭐⭐⭐
  ├─ 任务创建表单（完整版）
  ├─ 提示词模板库
  ├─ 人工反馈和迭代
  └─ 用户配置和偏好

【数据层】结构化知识库 ⭐⭐
  ├─ 关键词库
  ├─ 分类库
  ├─ 素材库
  ├─ 客户数据库
  └─ 竞品情报库

【上下文层】系统智能推荐 ⭐
  ├─ AI 建议
  ├─ 历史效果数据
  └─ 最佳实践推荐
```

### 8.2 核心层：运营用户输入（完整版）

**TaskCreationInput（完整版）**：
```
{
  // 基础指令
  prompt: string                      运营输入的核心提示词 ⭐
  additionalContext: string           额外上下文说明
  
  // 内容配置
  targetType: enum                    目标类型（blog/email/social/ad）
  targetLanguage: string[]            目标语言
  targetLength: { min, max, preferred } 字数范围
  tone: enum                          语气
  style: string                       风格（教程型、故事型、数据型）
  
  // 数据引用
  keywordId: string                   指定关键词ID
  categoryId: string                  指定分类ID
  materialIds: string[]               指定素材ID列表
  customerDataIds: string[]           指定客户案例ID列表
  autoFetchKeywords: boolean          自动查询关键词
  autoFetchMaterials: boolean         自动推荐素材
  autoFetchCases: boolean             自动匹配客户案例
  
  // SEO 配置
  primaryKeyword: string              主关键词
  secondaryKeywords: string[]         次要关键词
  targetAudience: string              目标受众
  userIntent: enum                    用户意图
  funnelStage: enum                   漏斗阶段（TOFU/MOFU/BOFU）
  
  // 质量要求
  minQualityScore: number             最低质量分数
  requireOriginalityCheck: boolean    是否检查原创性
  requireFactCheck: boolean           是否检查事实
  requireHumanReview: boolean         是否需要人工审核
  
  // 发布配置
  autoPublish: boolean                是否自动发布
  scheduledAt: datetime               定时发布时间
  targetPlatforms: string[]           目标平台
  isDraft: boolean                    是否保存为草稿
  
  // 模板配置
  useTemplate: boolean                是否使用模板
  templateId: string                  模板ID
  referenceContentIds: string[]       参考内容ID列表
  referenceUrls: string[]             参考URL列表
  
  // 批量配置
  isBatch: boolean                    是否批量任务
  batchSize: number                   批量数量
  variations: array                   变体配置
}
```

**提示词模板系统**：
```
PromptTemplate {
  id: string
  name: string                        模板名称
  category: enum                      分类
  template: string                    模板文本（支持占位符）
  requiredFields: array               必填字段
  optionalFields: array               可选字段
  examples: array                     示例
  usageCount: number                  使用次数
  avgQualityScore: number             平均质量评分
}
```

**人工干预系统**：
```
HumanIntervention {
  taskId: string
  interventionType: enum              修改/批准/拒绝/重新生成
  modifications: array                修改指令列表
  reviewFeedback: object              审核反馈
  regenerationConfig: object          重新生成配置
}
```

### 8.3 数据层：结构化知识库

**关键词库（KeywordEntry）**：
- 基础信息：关键词、语言、搜索量、难度、CPC
- 意图分析：搜索意图、用户阶段
- 优先级：业务价值评分、内容缺口标识
- 竞品分析：竞品页面、内容缺口
- 效果追踪：曝光量、点击量、转化数
- 扩展功能：关系图谱、季节性分析、用户路径

**分类库（CategoryEntry）**：
- 层级结构：3 级分类体系
- 内容策略：目标受众、语气、推荐字数
- SEO 配置：标题、描述、关键词
- 聚合页面：自动生成分类聚合页
- 扩展功能：内容缺口分析、表现数据追踪

**素材库（MaterialAsset）**：
- 素材类型：图片、数据、案例、引用、统计、图表
- 智能推荐：基于内容相关性推荐
- 使用追踪：被引用次数、使用内容列表
- 权限管理：版权信息、到期提醒
- 扩展功能：AI 标签、版本管理、A/B 测试

**客户数据库（CustomerData）**：
- 客户信息：公司名称、行业、规模、区域
- 使用数据：产品、时长、功能
- 成果数据：使用前后对比、改善幅度
- 案例研究：挑战、解决方案、实施、结果
- 权限管理：发布授权、到期追踪
- 扩展功能：客户分层、旅程追踪、内容偏好

**竞品情报库（CompetitorIntelligence）**：
- 内容策略：高频主题、发布频率、内容类型
- 关键词覆盖：共享关键词、独有关键词、机会关键词
- 内容缺口：他们有我们没有的主题
- 反向链接：域名权威、引用来源

---

