# 文章博客自动化生产完整架构设计方案

> 版本：v1.0  
> 创建时间：2026-07-28  
> 目标：构建企业级 SaaS 内容自动化生产系统

---

## 目录

- [一、MVP 核心方案](#一mvp-核心方案)
  - [1.1 MVP 目标与范围](#11-mvp-目标与范围)
  - [1.2 MVP 系统架构](#12-mvp-系统架构)
  - [1.3 MVP 输入输出模型](#13-mvp-输入输出模型)
  - [1.4 MVP 实施路线](#14-mvp-实施路线)
- [二、Docker 一键部署](#二docker-一键部署)
- [三、多语言支持方案](#三多语言支持方案)
- [四、详细设计参考](#四详细设计参考)
  - [4.1 输入体系完整设计](#41-输入体系完整设计)
  - [4.2 输出体系完整设计](#42-输出体系完整设计)
  - [4.3 Multi-Agent 演进方案](#43-multi-agent-演进方案)
  - [4.4 扩展功能设计](#44-扩展功能设计)
- [五、SaaS 最佳实践](#五saas-最佳实践)

---

## 一、MVP 核心方案

### 1.1 MVP 目标与范围

#### 目标

用 **2-3 周** 快速验证内容自动化生产的核心价值：
- ✅ 运营通过简单表单创建任务
- ✅ AI 根据提示词生成高质量博客文章
- ✅ 自动写入 Sanity CMS
- ✅ 运营在 Sanity Studio 审核发布

#### MVP 范围（最小可用）

```
输入：
  ✅ 运营任务表单（提示词 + 基础配置）
  ✅ 关键词库（简化版：只存关键词、搜索量、难度）
  
处理：
  ✅ 单一 Content Agent（合并所有职责）
  
输出：
  ✅ 长文博客（2000-3000 字）
  
发布：
  ✅ Sanity CMS（draft 状态）
```

#### MVP 不包含（后期再做）

```
❌ 分类库、素材库、客户数据库
❌ Multi-Agent 分工（Research/Writer/Optimizer/Quality/Publisher）
❌ 短文案、社交媒体、邮件等多样化输出
❌ 批量任务、A/B 测试
❌ 复杂的提示词模板系统
❌ CRM 集成、AI 图片生成
```

### 1.2 MVP 系统架构

```
┌─────────────────────────────────────────────────────┐
│              前端：任务创建表单                      │
│  • 提示词输入框（核心）                              │
│  • 主关键词                                          │
│  • 目标字数                                          │
│  • 语气选择                                          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│         后端：Spring Boot + Spring AI               │
│  • 任务管理服务                                      │
│  • 单一 Content Agent（Claude 3.5 Sonnet）          │
│  • Sanity 集成服务                                   │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              Sanity CMS                              │
│  • 存储生成的文章（draft 状态）                      │
│  • 运营在 Studio 审核和发布                          │
└─────────────────────────────────────────────────────┘
```

### 1.3 MVP 输入输出模型

#### MVP 输入：任务创建表单

```
TaskInput (MVP版本) {
  // 核心字段
  prompt: string              ⭐ 运营输入的提示词（必填）
  primaryKeyword: string      ⭐ 主关键词（必填）
  
  // 基础配置
  targetLength: number        // 目标字数（默认：2000）
  tone: "professional" | "casual" | "technical"  // 语气（默认：professional）
  language: "en" | "zh-cn"    // 语言（默认：en）
  
  // 元数据
  createdBy: string           // 运营人员ID
  createdAt: datetime         // 创建时间
}
```

**示例输入**：

```
prompt: "为亚马逊新手卖家写一篇关于如何进行关键词研究的入门教程，要通俗易懂，包含具体步骤"

primaryKeyword: "Amazon keyword research for beginners"

targetLength: 2000

tone: "professional"
```

#### MVP 输出：博客文章

```
ArticleOutput (MVP版本) {
  // 基础信息
  title: string               // 标题
  slug: string                // URL slug
  language: string            // 语言
  
  // 内容
  summary: string             // 摘要（150-200字）
  body: string                // 正文（Markdown格式）
  wordCount: number           // 字数
  
  // SEO
  metaTitle: string           // SEO 标题
  metaDescription: string     // SEO 描述
  keywords: string[]          // 关键词
  
  // 质量
  qualityScore: number        // 质量评分（0-100）
  
  // 状态
  status: "draft"             // 固定为 draft
  createdAt: datetime
}
```

#### 单一 Content Agent 的职责

MVP 阶段，将 5 个 Agent 的职责合并为 1 个 Agent：

```
Content Agent（All-in-One）：

输入：
  - 运营提示词
  - 主关键词
  - 配置参数（字数、语气）

处理流程：
  1. 理解运营意图（Research）
  2. 生成文章内容（Writer）
  3. SEO 优化（Optimizer）
  4. 质量自检（Quality）
  5. 格式化输出（Publisher）

输出：
  - 完整的博客文章（draft）
```

**Prompt 策略**（单次调用 Claude）：

```
System Prompt:
你是一个专业的内容创作 AI，负责生成高质量的博客文章。

User Prompt:
{运营输入的 prompt}

要求：
- 字数：{targetLength} 字左右
- 语气：{tone}
- 主关键词：{primaryKeyword}（自然融入文章）
- 结构：标题、摘要、正文（包含小标题）
- SEO：生成 meta title、meta description
- 质量：确保原创性、准确性、可读性

输出格式（JSON）：
{
  "title": "...",
  "summary": "...",
  "body": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."]
}
```

### 1.4 MVP 实施路线

#### Week 1：基础框架搭建

**Day 1-2：项目初始化**
- 前端：Vue 3 + Vben Admin 项目初始化
- 后端：Spring Boot + Spring AI 项目初始化
- Docker Compose 配置

**Day 3-4：任务创建功能**
- 前端：任务创建表单（提示词、关键词、配置）
- 后端：任务管理 API（创建、查询、状态更新）
- 数据库：tasks 表设计

**Day 5：Sanity 集成**
- 配置 Sanity Client
- 实现文章写入 API
- 测试 draft 创建

#### Week 2：AI Agent 开发

**Day 6-7：Content Agent 核心**
- 集成 Claude 3.5 Sonnet
- 实现 Prompt 构建逻辑
- 实现 JSON 解析和验证

**Day 8-9：端到端测试**
- 前端提交任务 → 后端生成 → Sanity 写入
- 调试和优化
- 错误处理

**Day 10：运营流程验证**
- 运营创建任务
- AI 生成文章
- Sanity Studio 审核
- Next.js 前台预览

#### Week 3：优化和发布

**Day 11-12：质量提升**
- Prompt 优化（提升生成质量）
- 添加质量评分逻辑
- 生成失败重试机制

**Day 13-14：用户体验**
- 前端加载状态和进度展示
- 错误提示优化
- 简单的任务列表和详情页

**Day 15：部署和交付**
- Docker 一键部署测试
- 编写使用文档
- 演示和培训

#### MVP 验收标准

```
✅ 运营能在 5 分钟内创建一个任务
✅ AI 能在 2-3 分钟内生成一篇 2000 字文章
✅ 生成的文章质量评分 > 80 分
✅ 文章自动写入 Sanity（draft 状态）
✅ 运营能在 Sanity Studio 看到文章并发布
✅ 发布后能在 Next.js 前台查看
✅ 整个流程从创建到发布 < 10 分钟
```

---

## 四、详细设计参考

> **说明**：以下章节为后期演进参考，MVP 阶段不实现

### 4.1 输入体系完整设计

#### 三层输入架构（Phase 2-3）

```
【核心层】运营用户输入 ⭐⭐⭐
  ├─ 任务创建（TaskCreationInput）
  │   ├─ 提示词（prompt）
  │   ├─ 内容配置（类型、长度、语气、风格）
  │   ├─ SEO 配置（关键词、受众、漏斗阶段）
  │   ├─ 质量要求（最低分数、检查项）
  │   └─ 发布配置（自动发布、定时、平台）
  │
  ├─ 提示词工程
  │   ├─ 提示词模板库
  │   ├─ 占位符系统
  │   └─ 历史提示词收藏
  │
  ├─ 人工干预
  │   ├─ 修改指令
  │   ├─ 审核反馈
  │   └─ 重新生成配置
  │
  └─ 配置和偏好
      ├─ 默认设置
      ├─ 品牌规范
      └─ 快捷操作
  
【数据层】结构化知识库 ⭐⭐
  ├─ 关键词库
  │   ├─ 基础信息（关键词、搜索量、难度、CPC）
  │   ├─ 搜索意图和用户阶段
  │   ├─ 优先级和业务价值
  │   ├─ 竞品分析
  │   ├─ 效果追踪
  │   └─ 扩展：关系图谱、季节性、用户路径
  │
  ├─ 分类库
  │   ├─ 3 级层级结构
  │   ├─ 内容策略（受众、语气、字数）
  │   ├─ SEO 配置
  │   └─ 扩展：内容缺口分析、表现数据
  │
  ├─ 素材库
  │   ├─ 图片、数据、案例、引用
  │   ├─ 智能推荐
  │   ├─ 使用追踪
  │   └─ 扩展：AI 标签、版本管理、A/B 测试
  │
  ├─ 客户数据库
  │   ├─ 客户信息（行业、规模、区域）
  │   ├─ 使用数据和成果
  │   ├─ 案例研究和评价
  │   └─ 扩展：客户分层、旅程追踪
  │
  └─ 竞品情报库
      ├─ 内容策略分析
      ├─ 关键词覆盖
      ├─ 内容缺口
      └─ 反向链接
  
【上下文层】系统智能推荐 ⭐
  ├─ AI 建议（基于历史和分析）
  ├─ 历史效果数据
  └─ 最佳实践推荐
```

#### 数据模型概念（完整版）

**TaskCreationInput（完整版）**：
- 基础指令：prompt、additionalContext
- 内容配置：targetType、targetLanguage、targetLength、tone、style
- 数据引用：keywordId、categoryId、materialIds、customerDataIds
- 自动查询：autoFetchKeywords、autoFetchMaterials、autoFetchCases
- SEO 配置：primaryKeyword、secondaryKeywords、targetAudience、userIntent、funnelStage
- 质量要求：minQualityScore、requireOriginalityCheck、requireFactCheck、requireHumanReview
- 发布配置：autoPublish、scheduledAt、targetPlatforms、isDraft
- 模板配置：useTemplate、templateId、referenceContentIds、referenceUrls
- AI 建议：suggestedKeywords、suggestedMaterials、suggestedStructure
- 批量配置：isBatch、batchSize、variations

**KeywordEntry（完整版）**：
- 基础：keyword、language、searchVolume、difficulty、cpc
- 意图：searchIntent、userStage
- 分类：categoryId、tags
- 优先级：priority、businessValue
- 内容：relatedContentIds、hasContent、contentGap
- 竞品：competitorUrls、competitorAnalysis
- 效果：impressions、clicks、ctr、conversions
- 扩展：关系图谱、季节性、搜索路径

**CategoryEntry（完整版）**：
- 基础：name、slug、language、description
- 层级：parentId、level、sortOrder
- SEO：title、description、keywords
- 策略：targetAudience、tone、contentTypes、recommendedWordCount
- 关联：keywordIds、contentIds、contentCount
- 聚合：hasAggregationPage、aggregationTemplate
- 扩展：内容缺口、表现数据

**MaterialAsset（完整版）**：
- 类型：image、data、case_study、quote、statistic、chart
- 图片：url、width、height、format、alt、caption、credit
- 数据：value、unit、context、source、verified
- 案例：customerName、industry、challenge、solution、results、metrics
- 引用：text、author、title、company
- 使用：usageCount、usedInContentIds
- 权限：license、licenseDetails、expiryDate
- 扩展：AI 标签、推荐评分、版本管理

**CustomerData（完整版）**：
- 客户：companyName、industry、companySize、region
- 使用：product、usageDuration、features
- 成果：metrics（before/after/improvement）
- 反馈：testimonial、rating、approved
- 案例：challenge、solution、implementation、results
- 场景：useCases、painPoints、successFactors
- 权限：canPublishName、canPublishLogo、canPublishMetrics
- 扩展：客户分层、旅程追踪、内容偏好

### 4.2 输出体系完整设计

#### 输出类型矩阵（Phase 2-3）

```
长内容（Long-form）：
  ├─ 深度博客（2000-3000字）
  ├─ 指南教程（3000-5000字）
  ├─ 白皮书（5000-10000字）
  └─ 案例研究（1500-2500字）

中内容（Mid-form）：
  ├─ 产品更新（800-1200字）
  ├─ 功能介绍（1000-1500字）
  └─ 对比文章（1500-2000字）

短内容（Short-form）：
  ├─ 社交媒体帖子（50-280字）
  ├─ 邮件内容（300-500字）
  ├─ 广告文案（30-150字）
  └─ 产品描述（200-400字）

结构化内容：
  ├─ FAQ（问答对）
  ├─ Glossary（术语解释）
  ├─ Checklist（检查清单）
  └─ Template（模板）

交互式内容（Phase 3）：
  ├─ 计算器（ROI、成本估算）
  ├─ Quiz/测评（自我评估）
  └─ 对比工具（产品对比）

音视频内容（Phase 3）：
  ├─ 视频脚本
  └─ 播客大纲
```

#### 数据模型概念（完整版）

**ArticleOutput（完整版）**：
- 基础：title、slug、language、summary、body、wordCount、readingTime
- 分类：categoryIds、tags、contentType
- SEO：metaTitle、metaDescription、keywords、canonical、ogImage、structuredData
- 媒体：coverImage、inlineImages
- 引用：sourceCitations、caseStudies、statistics
- 内链：relatedArticles、internalLinks
- CTA：type、text、url、position
- 质量：qualityScore、aiGenerated、humanReviewed
- 工作流：workflowState、publishedAt
- 扩展：内容模板、交互元素、A/B 变体

**SnippetOutput**：短文案输出模型

**SocialMediaPost**：社交媒体内容模型

**EmailContent**：邮件内容模型

**AdCopy**：广告文案模型

**InteractiveContent**：交互式内容模型（计算器、Quiz）

**ContentSeries**：内容系列模型（课程化）

**ContentRefreshStrategy**：内容更新策略

#### 内容改编策略

```
1 篇长文博客（2000字）可改编为：
  ├─ 3-5 篇社交媒体帖子（核心观点提炼）
  ├─ 1 篇邮件内容（摘要版本 + CTA）
  ├─ 2-3 个广告文案（痛点 + 解决方案）
  ├─ FAQ 条目（从 H2/H3 提取问题）
  └─ 短视频脚本（故事化叙事）
```

### 4.3 Multi-Agent 演进方案

#### 从单一 Agent 到 Multi-Agent（Phase 2-3）

**MVP (Phase 1)**：
```
Content Agent（All-in-One）
  └─ 一次性完成所有任务
```

**Phase 2**：
```
┌─────────────────────────────────────┐
│       Agent Orchestrator            │
│     (流程编排 + 上下文管理)         │
└─────────────────────────────────────┘
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │Research│  │Writer  │  │Quality │
    │Agent   │  │Agent   │  │Agent   │
    └────────┘  └────────┘  └────────┘
```

**Phase 3**：
```
┌─────────────────────────────────────┐
│       Agent Orchestrator            │
└─────────────────────────────────────┘
    ↓       ↓       ↓       ↓       ↓
Research Writer Optimizer Quality Publisher
```

#### Agent 职责划分（完整版）

**Research Agent（研究员）**：
- 输入：运营任务 + 关键词 + 分类 + 竞品
- 任务：搜索意图分析、竞品分析、内容缺口识别、大纲规划、素材推荐
- 输出：研究报告 + 内容策略

**Writer Agent（写作者）**：
- 输入：运营提示词 + 研究报告 + 素材 + 客户数据
- 任务：生成草稿、扩展细节、语言润色、引用素材
- 输出：完整文章 + 元数据

**Optimizer Agent（优化师）**：
- 输入：文章内容 + SEO 配置
- 任务：SEO 优化、GEO 优化、可读性优化、转化优化
- 输出：优化后文章 + 建议

**Quality Agent（质检员）**：
- 输入：优化后文章 + 质量要求 + 品牌规范
- 任务：基础检查、事实核查、原创性检查、品牌合规检查、评分
- 输出：质量报告 + 通过/拒绝 + 改进建议

**Publisher Agent（发布者）**：
- 输入：通过质检的文章 + 发布配置
- 任务：写入 Sanity、生成预览、触发通知、记录日志
- 输出：发布结果 + Studio URL

**Localization Agent（本地化，Phase 3）**：
- 输入：源语言内容 + 目标语言
- 任务：翻译、文化适配、本地化调整、质量评估
- 输出：本地化内容 + 质量报告

**Media Adapter Agent（媒体适配，Phase 3）**：
- 输入：文字内容
- 任务：识别适合音视频的元素、转化为口语化叙事、设计视觉/音频体验
- 输出：视频脚本或播客大纲

#### Agent 协作模式

**串行模式**（标准流程）：
```
Research → Writer → Optimizer → Quality → Publisher
```

**并行模式**（加速生产）：
```
Research → [Writer1, Writer2, Writer3] → Quality → Publisher
```

**反馈模式**（迭代优化）：
```
Writer → Quality (FAIL) → Writer (Revise) → Quality (PASS) → Publisher
```

**人工介入模式**：
```
Research → Writer → Optimizer → Quality (REVIEW) → 人工审核 → Publisher
```

### 4.4 扩展功能设计

#### 音视频内容生成（Phase 3）

**视频脚本生成**：
- 从博客文章提取核心观点
- 转化为视觉叙事结构
- 口语化表达
- 添加视觉建议和制作资源清单

**播客大纲生成**：
- 提取讨论话题
- 设计对话流程
- 准备提问和回答
- 规划时长和 Show Notes

#### AI 图片生成集成（Phase 3）

**集成方案**：
- DALL-E 3（高质量、快速）
- Midjourney（艺术风格）
- Stable Diffusion（成本优化）

**应用场景**：
- 封面图自动生成
- 章节配图
- 数据可视化
- 概念图解

**成本优化**：
- 高价值内容（BOFU）→ DALL-E 3
- 标准内容（MOFU）→ Midjourney
- 批量内容（TOFU）→ Stable Diffusion

#### CRM 深度集成（Phase 3）

**集成目标**：
- 打通 Salesforce/HubSpot
- 双向数据同步
- 基于客户数据的个性化内容生产

**应用场景**：
- 为高价值客户生成专属案例研究
- 基于行业生成个性化邮件
- 流失风险客户内容推送

#### 知识库集成（可选）

**Dify 知识库集成**：
- 产品文档引用
- 历史文章去重
- 竞品分析

**决策标准**：
- 产品文档页面 > 100
- 历史文章 > 500
- 竞品数量 > 5
- 团队规模 > 10 人
- 满足 ≥ 3 个条件建议启用

---

```
┌─────────────────────────────────────────────────────────────────┐
│                  核心输入层：运营用户输入 ⭐                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │任务创建     │  │提示词工程   │  │人工反馈     │             │
│  │Task Input   │  │Prompt Eng.  │  │Feedback     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              数据层：结构化知识库（辅助数据）                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │关键词库   │  │分类库     │  │素材库     │  │客户数据   │    │
│  │Keyword    │  │Category   │  │Material   │  │Customer   │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   AI Agent 生产引擎层                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  研究Agent → 写作Agent → 优化Agent → 质检Agent → 发布Agent│   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        输出体系层                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │长文博客│ │短文案  │ │社交媒体│ │邮件内容│ │广告文案│        │
│  │Article │ │Snippet │ │Social  │ │Email   │ │Ad Copy │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        分发渠道层                                 │
│  Website | Sanity CMS | Social Media | Email Platform           │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 三阶段演进路线

```
Phase 1: 人工发布闭环（2-3周）
  └─ 目标：打通 Sanity ↔ Next.js 基础链路
  └─ 输入：人工直接创建内容
  └─ 输出：长文博客

Phase 2: Claude Code 辅助（1-2周）
  └─ 目标：对话式生成 + MCP 写入
  └─ 输入：运营对话式输入 + 关键词库
  └─ 输出：长文博客 + 元数据

Phase 3: 独立自动化系统（4-6周）
  └─ 目标：企业级批量生产
  └─ 输入：运营任务创建 + 完整知识库（关键词/分类/素材/客户数据）
  └─ 输出：多样化内容（博客/短文案/社交/邮件/广告）
```

---

## 二、输入体系设计（三层架构）

### 2.1 架构设计理念

**核心思想**：从"系统自动化驱动"转变为"运营主导 + 数据增强"

```
传统错误方式：
  关键词库自动触发 → AI 自动生成 → 文章（缺乏人类创意和判断）

正确升级方式：
  运营输入任务(提示词+配置) + 结构化知识库(关键词/分类/素材/客户) → AI生成 → 多样化内容
```

#### 三层输入架构

```
【核心层】运营用户输入 ⭐⭐⭐
  ├─ 任务创建（Task Input）
  ├─ 提示词工程（Prompt Engineering）
  ├─ 人工干预（Human Intervention）
  └─ 配置和偏好（User Preferences）
  
【数据层】结构化知识库 ⭐⭐
  ├─ 关键词库（Keyword Library）
  ├─ 分类库（Category Library）
  ├─ 素材库（Material Asset Library）
  ├─ 客户数据库（Customer Data）
  └─ 竞品情报库（Competitor Intelligence）
  
【上下文层】系统智能推荐 ⭐
  ├─ AI 建议（基于历史和分析）
  ├─ 历史效果数据
  └─ 最佳实践推荐
```

> **设计原则**：运营始终是主导者，系统提供数据支持和智能建议，但最终决策权在运营手中。

### 2.2 关键词库（Keyword Library）


#### 功能定位
企业级关键词管理系统，支持研究、分类、优先级、效果追踪。

#### 数据模型

```
KeywordEntry {
  id: string
  keyword: string                      // 关键词
  language: "en" | "zh-cn"            // 语言
  searchVolume: number                 // 月搜索量
  difficulty: number                   // 竞争难度 (0-100)
  cpc: number                          // 每次点击成本
  searchIntent: "informational" | "navigational" | "transactional" | "commercial"
  userStage: "awareness" | "consideration" | "decision"
  
  // 分类关联
  categoryId: string                   // 所属分类
  tags: string[]                       // 标签
  
  // 优先级
  priority: "high" | "medium" | "low" | "archived"
  businessValue: number                // 业务价值评分 (0-100)
  
  // 内容关联
  relatedContentIds: string[]          // 已生成的内容
  hasContent: boolean                  // 是否已有内容
  contentGap: boolean                  // 是否有内容缺口
  
  // 竞品分析
  competitorUrls: string[]             // 竞品页面
  competitorAnalysis: {
    avgWordCount: number
    avgQualityScore: number
    gaps: string[]                     // 内容缺口
  }
  
  // 效果数据
  performance: {
    impressions: number                // 曝光量
    clicks: number                     // 点击量
    ctr: number                        // 点击率
    conversions: number                // 转化数
    lastUpdated: datetime
  }
  
  // 元数据
  source: "manual" | "research" | "analytics" | "competitor"
  createdBy: string
  createdAt: datetime
  updatedAt: datetime
  nextReviewDate: datetime             // 下次复审日期
}
```

#### 核心功能

1. **关键词研究**
   - 自动扩展（从种子词生成相关词）
   - 竞品关键词挖掘
   - 搜索趋势分析
   - 季节性识别

2. **智能分类**
   - 按搜索意图分类
   - 按用户阶段分类
   - 按业务领域分类
   - 自定义标签

3. **优先级排序**
   - 业务价值评分
   - 内容缺口优先
   - 竞争难度平衡
   - ROI 预测

4. **效果追踪**
   - 与 Google Analytics 集成
   - 追踪流量和转化
   - A/B 测试支持
   - ROI 计算


### 2.3 分类库（Category Library）

#### 功能定位
多层级内容分类体系，支持内容规划、导航、SEO 聚合。

#### 数据模型

```
CategoryEntry {
  id: string
  name: string                         // 分类名称
  slug: string                         // URL slug
  language: "en" | "zh-cn"
  
  // 层级结构
  parentId: string | null              // 父分类 ID
  level: number                        // 层级 (1-3)
  sortOrder: number                    // 排序
  
  // 描述
  description: string                  // 分类描述
  icon: string                         // 图标
  coverImage: {
    url: string
    alt: string
  }
  
  // SEO
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  
  // 内容策略
  contentStrategy: {
    targetAudience: string             // 目标受众
    tone: "professional" | "casual" | "technical"
    contentTypes: string[]             // 适合的内容类型
    recommendedWordCount: {
      min: number
      max: number
    }
  }
  
  // 关联数据
  keywordIds: string[]                 // 关联关键词
  contentIds: string[]                 // 包含的内容
  contentCount: number                 // 内容数量
  
  // 聚合页配置
  hasAggregationPage: boolean          // 是否生成聚合页
  aggregationTemplate: string          // 聚合页模板
  
  // 元数据
  status: "active" | "archived"
  createdAt: datetime
  updatedAt: datetime
}
```

#### 层级设计示例

```
L1: 产品功能
  ├─ L2: 关键词研究
  │   ├─ L3: 工具对比
  │   ├─ L3: 使用教程
  │   └─ L3: 最佳实践
  ├─ L2: 竞品分析
  │   ├─ L3: 分析方法
  │   └─ L3: 工具推荐
  └─ L2: 市场洞察
      ├─ L3: 趋势报告
      └─ L3: 案例研究

L1: 行业知识
  ├─ L2: 电商运营
  ├─ L2: 亚马逊SEO
  └─ L2: 跨境物流

L1: 客户成功
  ├─ L2: 入门指南
  ├─ L2: 常见问题
  └─ L2: 客户案例
```

#### 核心功能

1. **分类规划**
   - 支持 3 级层级
   - 拖拽排序
   - 批量编辑
   - 模板复制

2. **内容聚合**
   - 自动生成分类页
   - 相关内容推荐
   - 面包屑导航
   - Sitemap 集成

3. **SEO 优化**
   - 分类页 SEO 配置
   - 内链策略
   - Schema.org 标记
   - 聚合页排名追踪

### 2.4 素材库（Material Asset Library）

#### 功能定位
企业级数字资产管理，支持图片、数据、案例、引用的集中管理和复用。

#### 数据模型

```
MaterialAsset {
  id: string
  type: "image" | "data" | "case_study" | "quote" | "statistic" | "chart"
  
  // 基础信息
  title: string
  description: string
  tags: string[]
  categoryIds: string[]
  
  // 图片类型
  image: {
    url: string
    width: number
    height: number
    format: "jpg" | "png" | "webp" | "svg"
    fileSize: number
    alt: string
    caption: string
    credit: string                     // 版权信息
  }
  
  // 数据/统计类型
  data: {
    value: string | number
    unit: string
    context: string
    sourceName: string
    sourceUrl: string
    publishDate: date
    verified: boolean
    lastVerified: datetime
  }
  
  // 案例研究类型
  caseStudy: {
    customerName: string
    industry: string
    challenge: string
    solution: string
    results: string[]
    metrics: {
      label: string
      before: string
      after: string
      improvement: string
    }[]
    testimonial: string
    customerLogo: string
  }
  
  // 引用类型
  quote: {
    text: string
    author: string
    title: string
    company: string
    photo: string
    context: string
  }
  
  // 使用追踪
  usageCount: number                   // 被引用次数
  usedInContentIds: string[]           // 使用的内容
  
  // 权限
  license: "owned" | "licensed" | "creative_commons" | "public_domain"
  licenseDetails: string
  expiryDate: datetime | null
  
  // 质量
  qualityScore: number                 // 质量评分
  needsUpdate: boolean                 // 是否需要更新
  
  // 元数据
  uploadedBy: string
  createdAt: datetime
  updatedAt: datetime
}
```

#### 核心功能

1. **资产管理**
   - 批量上传
   - 智能标签
   - 自动分类
   - 版本控制

2. **智能推荐**
   - 基于内容主题推荐素材
   - 自动匹配图片
   - 相关案例推荐
   - 数据引用建议

3. **质量保证**
   - 图片自动优化（压缩/格式转换）
   - 数据来源验证
   - 定期复审提醒
   - 版权到期预警

4. **使用分析**
   - 高频使用素材
   - 未使用素材清理
   - ROI 分析
   - 缺口识别


### 2.5 客户数据库（Customer Data）

#### 功能定位
将客户成功案例、反馈、使用数据转化为内容输入。

#### 数据模型

```
CustomerData {
  id: string
  
  // 客户信息（脱敏）
  companyName: string
  industry: string
  companySize: "startup" | "smb" | "enterprise"
  region: string
  
  // 使用数据
  product: string                      // 使用的产品
  usageDuration: number                // 使用时长（月）
  features: string[]                   // 使用的功能
  
  // 成果数据
  metrics: {
    label: string                      // 指标名称
    before: string                     // 使用前
    after: string                      // 使用后
    improvement: string                // 改善幅度
    timeframe: string                  // 时间范围
  }[]
  
  // 反馈
  testimonial: {
    text: string
    author: string
    title: string
    date: date
    rating: number
    approved: boolean                  // 是否批准公开
  }
  
  // 案例研究
  caseStudy: {
    challenge: string
    solution: string
    implementation: string
    results: string[]
    quote: string
  }
  
  // 使用场景
  useCases: string[]
  painPoints: string[]
  successFactors: string[]
  
  // 内容使用权限
  permissions: {
    canPublishName: boolean
    canPublishLogo: boolean
    canPublishMetrics: boolean
    canPublishTestimonial: boolean
    expiryDate: datetime | null
  }
  
  // 元数据
  dataSource: "crm" | "survey" | "interview" | "analytics"
  collectedBy: string
  collectedAt: datetime
  verifiedBy: string
  verifiedAt: datetime
}
```

#### 核心功能

1. **数据收集**
   - CRM 集成（Salesforce/HubSpot）
   - 客户调查
   - 成功团队访谈
   - 使用数据分析

2. **权限管理**
   - 客户授权追踪
   - 使用范围限制
   - 到期提醒
   - 合规检查

3. **智能匹配**
   - 根据内容主题推荐案例
   - 行业匹配
   - 使用场景匹配
   - 数据支撑匹配

### 2.6 输入体系集成

#### 数据流设计

```
1. 关键词研究
   ↓
2. 查询关键词库 → 获取关键词详情
   ↓
3. 查询分类库 → 确定内容类型和策略
   ↓
4. 查询素材库 → 获取相关图片/数据/案例
   ↓
5. 查询客户数据 → 获取真实案例和数据
   ↓
6. 组装完整上下文
   ↓
7. 传递给 AI Agent
```

#### 上下文增强

```json
{
  "keyword": {
    "term": "Amazon keyword research",
    "searchIntent": "informational",
    "userStage": "consideration",
    "difficulty": 65,
    "searchVolume": 2400
  },
  "category": {
    "name": "产品功能 > 关键词研究 > 使用教程",
    "tone": "professional",
    "targetAudience": "亚马逊卖家",
    "recommendedWordCount": { "min": 1500, "max": 2500 }
  },
  "materials": {
    "images": [
      { "id": "img_001", "title": "关键词研究工具截图", "url": "..." }
    ],
    "statistics": [
      { "id": "stat_001", "value": "78%", "context": "使用关键词研究的卖家销量提升", "source": "..." }
    ],
    "caseStudies": [
      { "id": "case_001", "customer": "某跨境电商", "results": ["销量提升50%", "..."] }
    ]
  },
  "customerInsights": {
    "commonPainPoints": ["不知道如何选词", "竞争太激烈"],
    "successFactors": ["系统化研究", "长尾词策略"],
    "realMetrics": [
      { "label": "关键词排名", "improvement": "+25位" }
    ]
  }
}
```

---

## 三、AI Agent 生产引擎

### 3.1 Multi-Agent 架构

```
┌─────────────────────────────────────────────────────────────┐
│                   Agent Orchestrator                         │
│              (流程编排 + 上下文管理)                          │
└─────────────────────────────────────────────────────────────┘
         ↓           ↓           ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
    │Research│  │Writer  │  │Optimizer│ │Quality │  │Publisher│
    │Agent   │  │Agent   │  │Agent    │ │Agent   │  │Agent    │
    └────────┘  └────────┘  └────────┘  └────────┘  └────────┘
        ↓           ↓           ↓           ↓           ↓
    研究分析    内容生成    SEO/GEO优化  质量把控    多渠道发布
```

### 3.2 Agent 职责划分

#### Research Agent（研究员）
- **输入**：
  - 运营任务输入（提示词 + SEO配置）⭐
  - 关键词库数据
  - 分类库策略
  - 竞品情报
- **任务**：
  - 搜索意图分析
  - 竞品内容分析
  - 内容缺口识别
  - 大纲规划
  - 素材推荐
- **输出**：研究报告 + 内容策略

#### Writer Agent（写作者）
- **输入**：
  - 运营提示词（核心指令）⭐
  - Research Agent 的研究报告
  - 素材库资源
  - 客户数据案例
  - 内容配置（字数、语气、风格）
- **任务**：
  - 生成草稿（Pass 1）
  - 扩展细节（Pass 2）
  - 语言润色（Pass 3）
  - 引用素材（图片/数据/案例）
- **输出**：完整文章 + 元数据

#### Optimizer Agent（优化师）
- **输入**：
  - Writer Agent 生成的文章
  - SEO 配置（主关键词、次要关键词）
  - 质量要求
- **任务**：
  - SEO 优化（关键词/内链/标题）
  - GEO 优化（Quick Answer/FAQ/实体）
  - 可读性优化
  - 转化优化（CTA 位置）
- **输出**：优化后文章 + 建议

#### Quality Agent（质检员）
- **输入**：
  - 优化后文章
  - 质量要求配置（最低分数、检查项）
  - 品牌规范
- **任务**：
  - 基础检查（字段/字数/格式）
  - 事实核查（数据来源/准确性）
  - 原创性检查
  - 品牌合规检查
  - 评分（0-100）
- **输出**：质量报告 + 通过/拒绝 + 改进建议

#### Publisher Agent（发布者）
- **输入**：
  - 通过质检的文章
  - 发布配置（自动发布/草稿/定时）
  - 目标平台
- **任务**：
  - 写入 Sanity draft
  - 生成预览链接
  - 触发通知
  - 记录日志
- **输出**：发布结果 + Studio URL

### 3.3 Agent 协作模式

```
串行模式（标准流程）：
  Research → Writer → Optimizer → Quality → Publisher

并行模式（加速生产）：
  Research → [Writer1, Writer2, Writer3] → Quality → Publisher

反馈模式（迭代优化）：
  Writer → Quality (FAIL) → Writer (Revise) → Quality (PASS) → Publisher

人工介入模式：
  Research → Writer → Optimizer → Quality (REVIEW) → 人工审核 → Publisher
```


---

## 四、输出体系设计（多样化）

### 4.1 输出类型矩阵

#### 基于 SaaS 行业最佳实践的内容类型

```
┌────────────────────────────────────────────────────────────┐
│                   内容类型分类                              │
└────────────────────────────────────────────────────────────┘
  ├─ 长内容（Long-form）
  │   ├─ 深度博客（2000-3000字）
  │   ├─ 指南教程（3000-5000字）
  │   ├─ 白皮书（5000-10000字）
  │   └─ 案例研究（1500-2500字）
  │
  ├─ 中内容（Mid-form）
  │   ├─ 产品更新（800-1200字）
  │   ├─ 功能介绍（1000-1500字）
  │   └─ 对比文章（1500-2000字）
  │
  ├─ 短内容（Short-form）
  │   ├─ 社交媒体帖子（50-280字）
  │   ├─ 邮件内容（300-500字）
  │   ├─ 广告文案（30-150字）
  │   └─ 产品描述（200-400字）
  │
  └─ 结构化内容
      ├─ FAQ（问答对）
      ├─ Glossary（术语解释）
      ├─ Checklist（检查清单）
      └─ Template（模板）
```

### 4.2 输出数据模型

#### 4.2.1 长文博客（Article）

```
ArticleOutput {
  // 基础
  id: string
  type: "blog_post"
  title: string
  slug: string
  language: "en" | "zh-cn"
  
  // 内容
  summary: string                      // 150-200字摘要
  quickAnswer: string                  // GEO优化：一句话回答
  body: PortableText[]                 // Sanity Portable Text
  wordCount: number
  readingTime: number                  // 预估阅读时间（分钟）
  
  // 分类
  categoryIds: string[]
  tags: string[]
  contentType: "guide" | "tutorial" | "case_study" | "comparison"
  
  // SEO
  seo: {
    title: string                      // 50-60字符
    description: string                // 120-160字符
    keywords: string[]
    canonical: string
    ogImage: string
    structuredData: {
      article: ArticleSchema
      breadcrumb: BreadcrumbSchema
      faq: FAQSchema | null
    }
  }
  
  // 媒体
  coverImage: {
    url: string
    alt: string
    caption: string
  }
  inlineImages: Array<{
    id: string
    position: number                   // 在正文中的位置
    url: string
    alt: string
  }>
  
  // 引用
  sourceCitations: Array<{
    text: string
    url: string
    accessedAt: datetime
  }>
  caseStudies: string[]                // 引用的案例ID
  statistics: string[]                 // 引用的数据ID
  
  // 内链
  relatedArticles: string[]
  internalLinks: Array<{
    text: string
    targetSlug: string
  }>
  
  // CTA
  cta: {
    type: "trial" | "demo" | "download" | "contact"
    text: string
    url: string
    position: "inline" | "sidebar" | "footer"
  }
  
  // 质量
  qualityScore: number                 // 0-100
  aiGenerated: boolean
  humanReviewed: boolean
  reviewedBy: string | null
  
  // 工作流
  workflowState: "draft" | "in_review" | "approved" | "published"
  publishedAt: datetime | null
  updatedAt: datetime
}
```

#### 4.2.2 短文案（Snippet）

```
SnippetOutput {
  id: string
  type: "snippet"
  title: string
  
  // 用途
  purpose: "social_media" | "email" | "ad" | "product_desc"
  platform: "twitter" | "linkedin" | "facebook" | "instagram" | "email" | "google_ads"
  
  // 内容
  text: string                         // 主文案
  hashtags: string[]                   // 社交媒体标签
  callToAction: string
  
  // 变体（A/B测试）
  variants: Array<{
    id: string
    text: string
    performance: {
      impressions: number
      clicks: number
      ctr: number
    }
  }>
  
  // 关联
  sourceArticleId: string | null       // 改编自哪篇文章
  keywordId: string
  
  // 排期
  scheduledAt: datetime | null
  publishedAt: datetime | null
  expiresAt: datetime | null
  
  // 质量
  qualityScore: number
  toneScore: number                    // 语气匹配度
  brandCompliance: boolean
}
```

#### 4.2.3 社交媒体内容（Social Media Post）

```
SocialMediaPost {
  id: string
  type: "social_post"
  platform: "twitter" | "linkedin" | "facebook" | "instagram"
  
  // 内容
  text: string
  hashtags: string[]
  mentions: string[]
  
  // 媒体
  images: Array<{
    url: string
    alt: string
    aspectRatio: "1:1" | "16:9" | "4:5"
  }>
  video: {
    url: string
    thumbnail: string
    duration: number
  } | null
  
  // 链接
  link: {
    url: string
    title: string
    description: string
    image: string
  } | null
  
  // 关联
  sourceArticleId: string | null
  campaign: string | null
  
  // 排期
  scheduledAt: datetime
  timeZone: string
  
  // 互动
  expectedEngagement: {
    likes: number
    comments: number
    shares: number
  }
  
  // 合规
  brandGuidelines: boolean
  legalReview: boolean
}
```

#### 4.2.4 邮件内容（Email Content）

```
EmailContent {
  id: string
  type: "email"
  
  // 类型
  emailType: "newsletter" | "product_update" | "onboarding" | "nurture" | "promotional"
  
  // 基础
  subject: string                      // 主题行
  preheader: string                    // 预览文本
  fromName: string
  fromEmail: string
  
  // 内容
  body: {
    html: string
    text: string                       // 纯文本版本
  }
  
  // 结构
  sections: Array<{
    type: "hero" | "content" | "cta" | "social" | "footer"
    content: any
  }>
  
  // CTA
  primaryCta: {
    text: string
    url: string
    color: string
  }
  secondaryCta: {
    text: string
    url: string
  } | null
  
  // 个性化
  personalizationFields: string[]      // {{firstName}}, {{company}}等
  segmentCriteria: {
    industry: string[]
    userStage: string[]
    behavior: string[]
  }
  
  // A/B测试
  variants: Array<{
    id: string
    subject: string
    bodyDiff: string
    expectedOpenRate: number
    expectedCtr: number
  }>
  
  // 关联
  sourceArticleId: string | null
  campaign: string
  
  // 排期
  scheduledAt: datetime
  timeZone: string
  
  // 合规
  includesUnsubscribe: boolean
  gdprCompliant: boolean
  canSpamCompliant: boolean
}
```

#### 4.2.5 广告文案（Ad Copy）

```
AdCopy {
  id: string
  type: "ad_copy"
  
  // 平台
  platform: "google_ads" | "facebook_ads" | "linkedin_ads" | "twitter_ads"
  adFormat: "search" | "display" | "video" | "carousel"
  
  // 搜索广告（Google Ads）
  searchAd: {
    headlines: string[]                // 最多15个，每个30字符
    descriptions: string[]             // 最多4个，每个90字符
    path1: string                      // URL路径1
    path2: string                      // URL路径2
    finalUrl: string
    displayUrl: string
  } | null
  
  // 展示广告
  displayAd: {
    headline: string                   // 30字符
    shortDescription: string           // 60字符
    longDescription: string            // 90字符
    businessName: string
    images: Array<{
      size: "300x250" | "728x90" | "160x600"
      url: string
    }>
    logoUrl: string
    callToAction: string
  } | null
  
  // 社交广告
  socialAd: {
    primaryText: string
    headline: string
    description: string
    image: string
    video: string | null
    callToAction: string
    landingPageUrl: string
  } | null
  
  // 定位
  targeting: {
    keywords: string[]
    audiences: string[]
    demographics: {
      ageRange: string
      gender: string
      location: string[]
    }
    interests: string[]
  }
  
  // 预算
  budget: {
    dailyBudget: number
    bidStrategy: "manual_cpc" | "max_conversions" | "target_cpa"
    maxCpc: number | null
  }
  
  // 关联
  sourceArticleId: string | null
  keywordId: string
  campaign: string
  
  // 预测
  estimatedPerformance: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    cpa: number
  }
  
  // 合规
  brandGuidelines: boolean
  platformPolicies: boolean
  legalReview: boolean
}
```

### 4.3 内容改编策略

#### 从长文博客衍生其他内容

```
1篇长文博客（2000字）
  ↓
├─ 3-5篇社交媒体帖子
│   ├─ 核心观点提炼
│   ├─ 数据可视化
│   └─ 引用案例

│
├─ 1篇邮件内容
│   ├─ 摘要版本
│   ├─ 关键要点
│   └─ CTA引导
│
├─ 2-3个广告文案
│   ├─ 搜索广告（关键词匹配）
│   ├─ 展示广告（视觉吸引）
│   └─ 社交广告（互动驱动）
│
├─ FAQ条目
│   ├─ 从H2/H3提取问题
│   ├─ 简洁答案
│   └─ Schema标记
│
└─ 产品更新通知
    ├─ 相关功能介绍
    ├─ 使用建议
    └─ 资源链接
```

#### 改编规则

| 目标类型 | 改编策略 | 字数控制 | 重点调整 |
|---------|---------|---------|---------|
| 社交媒体 | 提炼核心观点1-2个 | 50-280字 | 加表情/标签/视觉元素 |
| 邮件内容 | 摘要+关键要点+CTA | 300-500字 | 个性化/紧迫感/清晰CTA |
| 广告文案 | 痛点+解决方案+行动 | 30-150字 | 关键词优化/价值主张 |
| FAQ | 提取问答对 | 50-200字/对 | 直接回答/结构化 |
| 短视频脚本 | 故事化叙事 | 300-500字 | 场景/对话/画面 |

### 4.4 输出质量标准

#### 按内容类型的质量指标

**长文博客**：
- 字数：1500-3000字
- 可读性：Flesch Reading Ease > 60
- SEO分数：> 80
- 原创性：> 95%
- 来源引用：≥ 2个权威来源

**社交媒体**：
- 字数符合平台限制
- Hashtag：3-5个
- 语气匹配品牌：> 90%
- 预期互动率：基于历史平均

**邮件内容**：
- 主题行：30-50字符
- 预览文本：40-130字符
- 预期打开率：> 行业平均
- CTA清晰度：人工验证

**广告文案**：
- 符合平台政策：100%
- 关键词相关性：> 90%
- 预期CTR：> 行业平均
- 合规检查：通过

---

## 二、Docker 一键部署

### 2.1 MVP 部署架构（简化版）

```
Docker Compose 包含：
  ├─ Frontend（Nginx + Vue 构建产物）
  ├─ Backend（Spring Boot）
  ├─ MySQL（数据库）
  └─ Redis（缓存 - 可选）
```

### 2.2 快速开始

**前置要求**：
- Docker 20.10+
- Docker Compose 2.0+

**一键部署**：
```bash
# 1. 克隆项目
git clone <repo-url>
cd content-automation-platform

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填写：
#   - ANTHROPIC_API_KEY（Claude API Key）
#   - SANITY_PROJECT_ID、SANITY_TOKEN
#   - MySQL 密码

# 3. 启动
docker-compose up -d

# 4. 访问
# 前端：http://localhost
# 后端：http://localhost:8080
```

### 2.3 环境变量清单

```
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
```

---

## 三、多语言支持方案

### 3.1 MVP 阶段

**支持语言**：
- 🇺🇸 英语 (en)
- 🇨🇳 简体中文 (zh-cn)

**实现方式**：
- 任务创建时选择目标语言
- Content Agent 根据语言调整 Prompt
- Sanity 字段支持多语言

### 3.2 翻译策略（后期）

**Phase 2 扩展**：
- AI 自动翻译：使用 Claude 翻译现有文章
- 本地化创作：针对不同语言市场从零创作
- 文化适配：日期格式、货币符号、度量单位

**支持语言清单**（渐进式）：
- Phase 2: 🇯🇵 日语、🇰🇷 韩语、🇩🇪 德语
- Phase 3: 🇫🇷 法语、🇪🇸 西班牙语、🇵🇹 葡萄牙语

---

## 四、详细设计参考

> **说明**：以下章节为后期演进参考，MVP 阶段不实现

```
┌──────────────────────────────────────────────────────────┐
│                   Docker Compose 编排                      │
└──────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Nginx   │   │ Vue 前端 │   │ Spring  │   │ MySQL   │
    │ (反向   │←─→│ (静态)   │←─→│ Boot    │←─→│ (数据)  │
    │  代理)  │   │         │   │ (API)   │   │         │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
                                      ↓
                                 ┌─────────┐
                                 │ Redis   │
                                 │ (缓存)  │
                                 └─────────┘
```

### 5.2 目录结构

```
content-automation-platform/
├── docker-compose.yml              # 主编排文件
├── .env.example                    # 环境变量模板
├── README.md                       # 部署文档
│
├── frontend/                       # Vue 前端
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   ├── package.json
│   └── .env.production
│
├── backend/                        # Spring Boot 后端
│   ├── Dockerfile
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-docker.yml
│   │   └── test/
│   └── scripts/
│       └── wait-for-it.sh          # 等待依赖服务
│
├── database/                       # 数据库
│   ├── init/
│   │   ├── 01-schema.sql          # 建表
│   │   ├── 02-seed-data.sql       # 初始数据
│   │   └── 03-indexes.sql         # 索引
│   └── backup/
│
├── nginx/                          # Nginx 配置
│   ├── nginx.conf
│   ├── ssl/                        # SSL 证书（生产环境）
│   └── conf.d/
│       └── default.conf
│
└── scripts/                        # 运维脚本
    ├── deploy.sh                   # 部署脚本
    ├── backup.sh                   # 备份脚本
    ├── restore.sh                  # 恢复脚本
    └── health-check.sh             # 健康检查
```

### 5.3 Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: content-automation-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: content-automation-backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/content_automation?useSSL=false&serverTimezone=UTC
      - SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
      - SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - SANITY_PROJECT_ID=${SANITY_PROJECT_ID}
      - SANITY_DATASET=${SANITY_DATASET}
      - SANITY_API_TOKEN=${SANITY_API_TOKEN}
    volumes:
      - ./backend/logs:/app/logs
    depends_on:
      - mysql
      - redis
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: content-automation-mysql
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=content_automation
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/init:/docker-entrypoint-initdb.d:ro
    networks:
      - app-network
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: content-automation-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  mysql-data:
    driver: local
  redis-data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### 5.4 环境变量配置

```bash
# .env.example
# 复制为 .env 并填写实际值

# MySQL
MYSQL_ROOT_PASSWORD=your_root_password_here
MYSQL_USER=content_automation
MYSQL_PASSWORD=your_password_here

# Claude AI
ANTHROPIC_API_KEY=sk-ant-xxx

# Sanity CMS
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# 应用配置
APP_ENV=production
APP_PORT=8080
LOG_LEVEL=INFO

# JWT 密钥
JWT_SECRET=your_jwt_secret_here

# SMTP 邮件（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

### 5.5 一键部署脚本

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 开始部署内容自动化平台..."

# 1. 检查 Docker 环境
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: 未安装 Docker Compose"
    exit 1
fi

# 2. 检查环境变量文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件并填写实际配置"
    exit 1
fi

# 3. 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 4. 拉取最新镜像
echo "📦 拉取最新镜像..."
docker-compose pull

# 5. 构建镜像
echo "🔨 构建镜像..."
docker-compose build --no-cache

# 6. 启动服务
echo "▶️  启动服务..."
docker-compose up -d

# 7. 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 10

# 8. 健康检查
echo "🏥 健康检查..."
./scripts/health-check.sh

echo "✅ 部署完成!"
echo ""
echo "📍 访问地址:"
echo "   前端: http://localhost"
echo "   后端 API: http://localhost:8080"
echo "   API 文档: http://localhost:8080/swagger-ui.html"
echo ""
echo "📊 查看日志:"
echo "   docker-compose logs -f"
```

### 5.6 健康检查脚本

```bash
#!/bin/bash
# scripts/health-check.sh

echo "检查后端服务..."
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ 后端服务正常"
else
    echo "❌ 后端服务异常"
    exit 1
fi

echo "检查 MySQL..."
if docker exec content-automation-mysql mysqladmin ping -h localhost > /dev/null 2>&1; then
    echo "✅ MySQL 正常"
else
    echo "❌ MySQL 异常"
    exit 1
fi

echo "检查 Redis..."
if docker exec content-automation-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 正常"
else
    echo "❌ Redis 异常"
    exit 1
fi

echo ""
echo "✅ 所有服务健康"
```

### 5.7 快速开始指南

```markdown
# 快速开始

## 前置要求
- Docker 20.10+
- Docker Compose 2.0+
- 8GB+ 内存
- 20GB+ 磁盘空间

## 部署步骤

1. 克隆项目
```bash
git clone https://github.com/your-org/content-automation-platform.git
cd content-automation-platform
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填写必需配置
vi .env
```

3. 一键部署
```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

4. 访问系统
- 前端: http://localhost
- 后端: http://localhost:8080
- 默认账号: admin / admin123

## 常用命令

```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 备份数据
./scripts/backup.sh

# 恢复数据
./scripts/restore.sh backup-2026-07-28.sql
```
```

---

## 六、技术实现细节

### 6.1 技术栈总览

| 层级 | 技术选型 | 版本 | 用途 |
|------|---------|------|------|
| 前端框架 | Vue 3 | 3.4+ | 响应式 UI |
| UI 组件 | Vben Admin | 2.10+ | 企业级模板 |
| 状态管理 | Pinia | 2.1+ | 状态管理 |
| HTTP 客户端 | Axios | 1.6+ | API 请求 |
| 图表 | ECharts | 5.4+ | 数据可视化 |
| 后端框架 | Spring Boot | 3.2+ | 微服务基础 |
| AI 集成 | Spring AI | 1.0+ | LLM 抽象层 |
| ORM | MyBatis Plus | 3.5+ | 数据持久化 |
| 缓存 | Redis | 7.0+ | 缓存+队列 |
| 数据库 | MySQL | 8.0+ | 关系型存储 |
| 任务调度 | Spring Quartz | 2.3+ | 定时任务 |
| API 文档 | Swagger/OpenAPI | 3.0+ | API 文档生成 |
| 监控 | Spring Actuator | 3.2+ | 应用监控 |
| 容器化 | Docker | 20.10+ | 容器化部署 |
| CMS | Sanity | 3.0+ | 内容存储 |
| AI 模型 | Claude 3.5 Sonnet | Latest | 内容生成 |

### 6.2 核心接口设计

#### 6.2.1 任务管理 API

```
POST   /api/v1/tasks                    创建生成任务
GET    /api/v1/tasks                    获取任务列表
GET    /api/v1/tasks/{id}               获取任务详情
DELETE /api/v1/tasks/{id}               取消任务
POST   /api/v1/tasks/batch              批量创建任务
GET    /api/v1/tasks/stats              获取任务统计
```

#### 6.2.2 内容管理 API

```
GET    /api/v1/contents                 获取内容列表
GET    /api/v1/contents/{id}            获取内容详情
PUT    /api/v1/contents/{id}            更新内容
DELETE /api/v1/contents/{id}            删除内容
POST   /api/v1/contents/{id}/approve    审核通过
POST   /api/v1/contents/{id}/reject     审核拒绝
GET    /api/v1/contents/{id}/preview    预览内容
```

#### 6.2.3 关键词库 API

```
POST   /api/v1/keywords                 创建关键词
GET    /api/v1/keywords                 获取关键词列表
PUT    /api/v1/keywords/{id}            更新关键词
DELETE /api/v1/keywords/{id}            删除关键词
POST   /api/v1/keywords/research        关键词研究
POST   /api/v1/keywords/import          批量导入
GET    /api/v1/keywords/stats           关键词统计
```

#### 6.2.4 素材库 API

```
POST   /api/v1/materials                上传素材
GET    /api/v1/materials                获取素材列表
GET    /api/v1/materials/{id}           获取素材详情
PUT    /api/v1/materials/{id}           更新素材
DELETE /api/v1/materials/{id}           删除素材
POST   /api/v1/materials/recommend      推荐素材
```

### 6.3 数据库设计要点

#### 核心表设计原则

1. **任务表**：记录生成任务的完整生命周期
2. **内容表**：存储生成的内容及质量评分
3. **关键词表**：管理关键词及其元数据
4. **素材表**：统一管理所有数字资产
5. **历史表**：审计日志和版本控制

#### 索引策略

```sql
-- 高频查询字段
CREATE INDEX idx_keyword_priority ON keywords(priority, business_value);
CREATE INDEX idx_content_workflow ON contents(workflow_state, created_at);
CREATE INDEX idx_task_status ON tasks(status, created_at);

-- 关联查询
CREATE INDEX idx_content_keyword ON contents(keyword_id);
CREATE INDEX idx_material_category ON materials(category_id);

-- 全文搜索
CREATE FULLTEXT INDEX ft_content_body ON contents(body);
CREATE FULLTEXT INDEX ft_keyword_term ON keywords(keyword);
```

---

## 五、SaaS 最佳实践

### 5.1 内容营销漏斗

```
TOFU (漏斗顶部) - 认知阶段
  ├─ 内容类型：长文博客、SEO Guide、行业报告、趋势分析
  ├─ 目标：获取搜索流量，建立权威性
  └─ KPI：自然流量、页面停留时间

MOFU (漏斗中部) - 考虑阶段
  ├─ 内容类型：产品对比、功能介绍、案例研究、邮件系列
  ├─ 目标：展示解决方案，建立信任
  └─ KPI：注册数、邮件打开率

BOFU (漏斗底部) - 决策阶段
  ├─ 内容类型：免费试用、产品 Demo、ROI 计算器、客户评价
  ├─ 目标：降低决策门槛，促成转化
  └─ KPI：试用注册、转化率
```

### 5.2 内容发布节奏

**周度节奏**：
- Monday: 长文博客发布（TOFU）
- Tuesday: 社交媒体推广（全漏斗）
- Wednesday: 案例研究发布（MOFU）
- Thursday: 邮件营销发送（MOFU/BOFU）
- Friday: 产品更新通知（BOFU）

**月度规划**：
- Week 1: 主题关键词批量生成（20-30 篇）
- Week 2: 人工审核 + 优化
- Week 3: 批量发布 + 多渠道分发
- Week 4: 效果分析 + 优化迭代

### 5.3 质量与效率平衡

```
人工写作：
  质量：⭐⭐⭐⭐⭐ (95分)
  效率：⭐ (1篇/天)
  成本：💰💰💰 ($50/篇)

AI生成 + 人工审核（推荐）：
  质量：⭐⭐⭐⭐ (85分)
  效率：⭐⭐⭐⭐ (20篇/天)
  成本：💰 ($5/篇)

推荐比例：
  70% AI生成（TOFU/长尾词）
  30% 人工精品（BOFU/核心页面）
```

### 5.4 成功指标

**生产效率指标**：
- 日生产量：20-50 篇
- 审核通过率：> 80%
- 人工修改率：< 20%
- 平均生产时间：< 5 分钟/篇

**内容质量指标**：
- 质量评分：> 85 分
- 原创性：> 95%
- SEO 分数：> 80 分
- 可读性：Flesch > 60

**业务效果指标**：
- 自然流量增长：+30% (3 个月)
- 关键词排名：Top 10 覆盖率 +50%
- 潜客获取成本：-40%
- 内容 ROI：> 300%

### 5.5 投资回报分析

**投入成本**：
- 开发成本：2 人 × 3 周（MVP）≈ $30k
- 基础设施：$500-1000/月
- Claude API：$1000-2000/月

**回报收益**：
- 内容生产效率：20 倍提升
- 内容成本降低：80%
- 自然流量增长：300%
- 潜客获取成本降低：60%

**ROI 计算**：
- 累计投资：$30,000（开发）+ $1,500/月（运营）
- 月度节省：$35,000（人工成本）- $1,500（系统成本）= $33,500
- 回本周期：$30,000 / $33,500 ≈ **不到 1 个月**

---

## 附录：技术栈参考

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.4+ | 前端框架 |
| Vben Admin | 2.10+ | UI 模板 |
| Pinia | 2.1+ | 状态管理 |
| Axios | 1.6+ | HTTP 客户端 |
| ECharts | 5.4+ | 数据可视化 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.2+ | 后端框架 |
| Spring AI | 1.0+ | LLM 抽象层 |
| MyBatis Plus | 3.5+ | ORM |
| MySQL | 8.0+ | 数据库 |
| Redis | 7.0+ | 缓存 |
| Docker | 20.10+ | 容器化 |

### 第三方服务

| 服务 | 用途 |
|------|------|
| Claude 3.5 Sonnet | 内容生成 |
| Sanity CMS | 内容存储 |
| AWS/阿里云 | 云服务器 |

---

## 总结

### MVP 核心价值

```
从零到一（2-3周）：
  ✅ 运营创建任务（提示词 + 配置）
  ✅ AI 生成高质量文章（2-3分钟）
  ✅ 自动写入 Sanity CMS
  ✅ 运营审核发布

效率革命：
  ✅ 生产效率提升 20 倍
  ✅ 成本降低 80%
  ✅ 质量保持 85 分以上

业务增长：
  ✅ 自然流量增长 300%
  ✅ 潜客获取成本降低 60%
  ✅ 内容营销 ROI 提升 300%

投资回报：
  ✅ 开发成本 $30k
  ✅ 不到 1 个月回本
  ✅ 持续产生价值
```

### 演进路线

```
MVP (2-3周)：
  └─ 单一 Agent + 基础表单 + Sanity 集成

Phase 2 (4-6周)：
  └─ Multi-Agent + 结构化知识库 + 多样化输出

Phase 3 (6-8周)：
  └─ 多语言 + 扩展功能（音视频/AI图片/CRM）

持续优化：
  └─ Prompt 迭代 + 质量提升 + 效果追踪
```

---

**文档版本**: v2.0 (MVP 优先)  
**最后更新**: 2026-07-28  
**维护者**: Content Automation Team  
**变更日志**:
- v2.0 (2026-07-28): 重构为 MVP 优先，简化 Agent 为单一 Agent，移除代码，后置详细设计
- v1.0 (2026-07-28): 初始完整版本

```
┌────────────────────────────────────────────────────────┐
│                 TOFU (漏斗顶部)                         │
│              认知阶段 - 吸引流量                        │
│  ┌──────────────────────────────────────────────┐     │
│  │ 长文博客 | SEO Guide | 行业报告 | 趋势分析  │     │
│  │ 目标: 获取搜索流量，建立权威性                │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────┐
│                 MOFU (漏斗中部)                         │
│              考虑阶段 - 培育潜客                        │
│  ┌──────────────────────────────────────────────┐     │
│  │ 产品对比 | 功能介绍 | 案例研究 | 邮件系列  │     │
│  │ 目标: 展示解决方案，建立信任                  │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────────┐
│                 BOFU (漏斗底部)                         │
│              决策阶段 - 转化成交                        │
│  ┌──────────────────────────────────────────────┐     │
│  │ 免费试用 | 产品Demo | ROI计算器 | 客户评价 │     │
│  │ 目标: 降低决策门槛，促成转化                  │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

### 7.2 内容类型映射

| 漏斗阶段 | 主要内容类型 | 次要内容类型 | KPI 指标 |
|----------|-------------|-------------|---------|
| TOFU | 长文博客(70%) | 信息图/视频(30%) | 自然流量、页面停留时间 |
| MOFU | 案例研究(40%) | 对比文章/邮件(60%) | 注册数、邮件打开率 |
| BOFU | 产品页面(50%) | 客户评价/白皮书(50%) | 试用注册、转化率 |

### 7.3 内容发布节奏

#### 周度节奏

```
Monday:     长文博客发布 (TOFU)
Tuesday:    社交媒体推广 (全漏斗)
Wednesday:  案例研究发布 (MOFU)
Thursday:   邮件营销发送 (MOFU/BOFU)
Friday:     产品更新通知 (BOFU)
Weekend:    社交媒体互动
```

#### 月度规划

```
Week 1: 主题关键词批量生成(20-30篇)
Week 2: 人工审核 + 优化
Week 3: 批量发布 + 多渠道分发
Week 4: 效果分析 + 优化迭代
```

### 7.4 质量与效率平衡

```
人工写作:
  质量: ⭐⭐⭐⭐⭐ (95分)
  效率: ⭐ (1篇/天)
  成本: 💰💰💰 ($50/篇)

AI生成 + 人工审核:
  质量: ⭐⭐⭐⭐ (85分)
  效率: ⭐⭐⭐⭐ (20篇/天)
  成本: 💰 ($5/篇)

推荐比例:
  70% AI生成 (TOFU/长尾词)
  30% 人工精品 (BOFU/核心页面)
```

### 7.5 成功指标

#### 生产效率指标

- 日生产量: 20-50篇
- 审核通过率: > 80%
- 人工修改率: < 20%
- 平均生产时间: < 5分钟/篇

#### 内容质量指标

- 质量评分: > 85分
- 原创性: > 95%
- SEO 分数: > 80分
- 可读性: Flesch > 60

#### 业务效果指标

- 自然流量增长: +30% (3个月)
- 关键词排名: Top 10 覆盖率 +50%
- 潜客获取成本: -40%
- 内容 ROI: > 300%

---

## 八、总结与下一步

### 8.1 核心价值

1. **输入体系**：结构化知识库（关键词/分类/素材/客户数据）
2. **AI Agent**：Multi-Agent 协作，确保质量和效率
3. **输出多样化**：从博客到广告，覆盖全营销漏斗
4. **Docker 部署**：一键启动，开箱即用

### 8.2 实施路线

```
Month 1-2: Phase 1 + Phase 2
  └─ 打通基础链路 + Claude Code 验证

Month 3-4: Phase 3 基础功能
  └─ 独立系统 + 输入体系 + 长文生产

Month 5-6: Phase 3 扩展功能
  └─ 多样化输出 + 高级 Agent + 数据分析

Month 6+: 持续优化
  └─ 提示词迭代 + 质量提升 + 效果追踪
```

### 8.3 投资回报

**投入**：
- 开发成本: 2人 × 6个月 ≈ $100k
- 基础设施: $500-1000/月
- Claude API: $1000-2000/月

**回报**：
- 内容生产效率: 20倍提升
- 内容成本降低: 80%
- 自然流量增长: 300%
- 潜客获取成本降低: 60%

**ROI**: 6-12个月回本

---

**文档版本**: v1.0  
**最后更新**: 2026-07-28  
**维护者**: Content Automation Team

---

## 九、扩展功能简述

本系统具备以下扩展能力，可根据业务发展阶段按需启用：

### 9.1 音视频内容生成
- 视频脚本、播客大纲自动生成
- 从博客文章改编为口语化音视频内容
- 支持 YouTube、TikTok、播客等平台

### 9.2 AI 图片生成
- 集成 DALL-E 3/Midjourney/Stable Diffusion
- 自动为文章生成封面图和配图
- 智能 Prompt 生成和成本优化

### 9.3 CRM 深度集成
- 支持 Salesforce/HubSpot 双向数据同步
- 基于客户数据的个性化内容生产
- 自动回写内容互动数据到 CRM


### 9.4 知识库集成（可选）
- Dify 知识库集成用于产品文档引用
- 历史文章去重和竞品分析
- 按需启用，非核心必需

### 9.5 多语言支持方案

### 9.5 多语言支持方案

#### 支持语言清单
- **Phase 1**：🇺🇸 英语 (en)、🇨🇳 简体中文 (zh-cn)
- **Phase 2**：🇯🇵 日语、🇰🇷 韩语、🇩🇪 德语、🇫🇷 法语、🇪🇸 西班牙语
- **Phase 3**：其他主要语言按需扩展

#### 翻译策略
1. **AI 自动翻译**（TOFU 内容）：成本 $0.01/1000字，质量 85分
2. **AI + 人工审核**（MOFU 内容）：成本 $0.05/1000字，质量 90分
3. **本地化创作**（BOFU 内容）：成本 $0.10/1000字，质量 95分

#### 文化适配
- 日期/货币/度量单位本地化
- 图片和案例本地化
- 法律合规检查（GDPR/CCPA等）
- 社交平台适配（Facebook vs WeChat）

---

## 十、输入输出模型深度优化

现在我们重点探讨输入和输出模型的设计优化。

### 10.1 输入模型优化分析

#### 当前输入体系回顾与重构

之前的输入设计缺少了**最核心的输入源**：运营用户的直接输入。

现在重新定义完整的输入体系：

```
完整输入体系：
  ├─ 【核心层】运营用户输入（User Input）⭐⭐⭐
  │   └─ 任务指令、提示词、配置、人工干预
  │
  ├─ 【数据层】结构化知识库
  │   ├─ 关键词库（Keyword Library）
  │   ├─ 分类库（Category Library）
  │   ├─ 素材库（Material Asset Library）
  │   ├─ 客户数据库（Customer Data）
  │   └─ 竞品情报库（Competitor Intelligence）
  │
  └─ 【上下文层】系统智能推荐
      ├─ AI 建议
      ├─ 历史数据
      └─ 效果反馈
```

### 10.1.1 核心输入：运营用户输入层

这是整个系统的**触发源和控制中心**。

#### A. 任务创建输入（Task Creation Input）

```
TaskCreationInput {
  id: string
  createdBy: string                    // 运营人员ID
  createdAt: datetime
  
  // ========== 核心输入字段 ==========
  
  // 1. 基础指令
  instruction: {
    type: "generate" | "translate" | "refresh" | "adapt"
    prompt: string                     // 运营输入的核心提示词 ⭐
    additionalContext: string          // 额外上下文说明
  }
  
  // 2. 内容配置
  contentConfig: {
    targetType: "blog_post" | "email" | "social_media" | "ad_copy" | "video_script"
    targetLanguage: string[]           // ["en", "zh-cn"]
    targetLength: {
      min: number                      // 最少字数
      max: number                      // 最多字数
      preferred: number                // 期望字数
    }
    tone: "professional" | "casual" | "technical" | "friendly"
    style: string                      // "教程型" | "故事型" | "数据型"
  }
  
  // 3. 关联数据选择（可选）
  dataReferences: {
    keywordId: string | null           // 指定关键词
    categoryId: string | null          // 指定分类
    materialIds: string[]              // 指定素材
    customerDataIds: string[]          // 指定客户案例
    
    // 自动查询规则
    autoFetchKeywords: boolean         // 自动查询相关关键词
    autoFetchMaterials: boolean        // 自动推荐素材
    autoFetchCases: boolean            // 自动匹配客户案例
  }
  
  // 4. SEO 和营销配置
  seoConfig: {
    primaryKeyword: string             // 主关键词 ⭐
    secondaryKeywords: string[]        // 次要关键词
    targetAudience: string             // 目标受众
    userIntent: "informational" | "transactional" | "navigational" | "commercial"
    funnelStage: "TOFU" | "MOFU" | "BOFU"
  }
  
  // 5. 质量要求
  qualityRequirements: {
    minQualityScore: number            // 最低质量分数 (0-100)
    requireOriginalityCheck: boolean   // 是否检查原创性
    requireFactCheck: boolean          // 是否检查事实
    requireHumanReview: boolean        // 是否需要人工审核
  }
  
  // 6. 发布配置
  publishConfig: {
    autoPublish: boolean               // 是否自动发布
    scheduledAt: datetime | null       // 定时发布
    targetPlatforms: string[]          // 目标平台
    isDraft: boolean                   // 是否保存为草稿
  }
  
  // 7. 模板和参考
  templateConfig: {
    useTemplate: boolean               // 是否使用模板
    templateId: string | null          // 模板ID
    referenceContentIds: string[]      // 参考内容ID列表
    referenceUrls: string[]            // 参考URL列表
  }
  
  // ========== 系统辅助字段 ==========
  
  // AI 建议（系统提供，用户可修改）
  aiSuggestions: {
    suggestedKeywords: string[]
    suggestedMaterials: string[]
    suggestedStructure: string
    suggestedLength: number
    confidenceScore: number            // 建议可信度
  }
  
  // 批量任务
  batchConfig: {
    isBatch: boolean
    batchSize: number
    variations: Array<{
      prompt: string
      config: any
    }>
  }
}
```

#### B. 提示词工程（Prompt Engineering）

运营用户的提示词是最核心的输入，需要提供**提示词模板和辅助工具**。

**提示词模板库**：

```
PromptTemplate {
  id: string
  name: string
  category: "blog" | "email" | "social" | "ad" | "technical"
  
  // 模板结构
  template: {
    // 占位符系统
    structure: string                  // "为 {TARGET_AUDIENCE} 写一篇关于 {TOPIC} 的 {CONTENT_TYPE}"
    
    // 必填字段
    requiredFields: Array<{
      fieldName: string
      fieldType: "text" | "select" | "number"
      label: string
      placeholder: string
      options: string[] | null         // 下拉选项
    }>
    
    // 可选字段
    optionalFields: Array<{
      fieldName: string
      label: string
      defaultValue: string
    }>
  }
  
  // 示例
  examples: Array<{
    filledPrompt: string
    resultQuality: number
    resultUrl: string
  }>
  
  // 使用统计
  usage: {
    usageCount: number
    avgQualityScore: number
    successRate: number
  }
}
```

**提示词模板示例**：

```
模板 1: 长文博客
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
为 {目标受众} 写一篇关于 {主题} 的深度教程文章。

文章要求：
- 字数：{字数范围}
- 语气：{语气}
- 包含：{必需元素}（如：案例研究、数据统计、实操步骤）

重点解决的问题：{核心痛点}

期望读者收获：{学习目标}

SEO 关键词：{主关键词} + {次要关键词}

参考风格：{参考文章URL}（可选）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

模板 2: 社交媒体帖子
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
为 {平台}（LinkedIn/Twitter/Instagram）创建一条关于 {主题} 的社交媒体帖子。

目标：{营销目标}（如：引流、互动、品牌曝光）
语气：{语气}
字数：{字数限制}
必须包含：{CTA/标签/表情符号}

核心观点：{一句话核心信息}

目标受众：{受众描述}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

模板 3: 客户案例研究
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
基于客户 {客户名称/行业} 的成功案例，创建一篇案例研究。

案例背景：
- 客户行业：{行业}
- 使用产品：{产品名称}
- 使用时长：{时长}

要突出的成果：
- 指标1：{之前} → {之后} ({提升幅度})
- 指标2：{之前} → {之后} ({提升幅度})

关键成功因素：{1-3个关键因素}

引用客户评价：{是/否}

目标读者：{类似客户画像}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### C. 人工干预和反馈输入

```
HumanInterventionInput {
  taskId: string
  interventionType: "modification" | "approval" | "rejection" | "regeneration"
  
  // 修改指令
  modifications: {
    section: string                    // 要修改的部分
    instruction: string                // 修改指令 ⭐
    reason: string                     // 修改原因
  }[]
  
  // 审核反馈
  reviewFeedback: {
    approved: boolean
    qualityRating: number              // 1-5星
    issues: string[]                   // 问题列表
    suggestions: string[]              // 改进建议
    
    // 结构化反馈
    qualityDimensions: {
      accuracy: number                 // 准确性 1-5
      relevance: number                // 相关性 1-5
      readability: number              // 可读性 1-5
      engagement: number               // 吸引力 1-5
    }
  }
  
  // 重新生成配置
  regenerationConfig: {
    keepSections: string[]             // 保留的部分
    regenerateSections: string[]       // 重新生成的部分
    newInstructions: string            // 新的指令 ⭐
  }
  
  timestamp: datetime
  operatorId: string
}
```

#### D. 配置和偏好设置

```
UserPreferences {
  userId: string
  
  // 默认配置
  defaultSettings: {
    preferredLanguage: string
    preferredTone: string
    preferredLength: number
    preferredQualityThreshold: number
    autoPublish: boolean
  }
  
  // 品牌规范
  brandGuidelines: {
    brandVoice: string                 // 品牌语气描述
    doList: string[]                   // 必须做的
    dontList: string[]                 // 禁止做的
    preferredTerms: {
      term: string
      usage: string
    }[]
    avoidTerms: string[]               // 避免使用的词汇
  }
  
  // 提示词收藏
  savedPrompts: Array<{
    name: string
    prompt: string
    category: string
    usageCount: number
  }>
  
  // 快捷操作
  shortcuts: Array<{
    name: string
    action: string
    config: any
  }>
}
```

#### 10.1.2 数据层输入：结构化知识库

让我们深入探讨每个输入模块还可以如何优化：

**A. 关键词库优化方向**

当前已有：
- ✅ 基础字段（关键词、搜索量、难度、意图）
- ✅ 分类和标签
- ✅ 优先级管理
- ✅ 效果追踪

**还可以优化的方向**：

1. **关键词关系图谱**
   ```
   KeywordRelationship {
     relatedKeywords: Array<{
       keyword: string
       relationshipType: "synonym" | "parent" | "child" | "related"
       strength: number  // 0-100 关联强度
     }>
     
     keywordCluster: {
       clusterId: string
       clusterName: string  // 如："Amazon SEO 优化"
       coreKeyword: string  // 核心关键词
       supportingKeywords: string[]  // 支撑关键词
     }
   }
   ```
   
2. **季节性和趋势预测**
   ```
   seasonalityData: {
     peakMonths: number[]  // [11, 12] 表示11-12月高峰
     trendDirection: "rising" | "stable" | "declining"
     yearOverYearChange: number  // +25% 同比增长
     forecastNextQuarter: number  // 预测下季度搜索量
   }
   ```

3. **用户搜索路径分析**
   ```
   searchJourney: {
     beforeKeywords: string[]  // 用户之前搜索的词
     afterKeywords: string[]   // 用户之后搜索的词
     conversionKeywords: string[]  // 最终转化的词
   }
   ```

**B. 分类库优化方向**

当前已有：
- ✅ 3级层级结构
- ✅ SEO 配置
- ✅ 内容策略

**还可以优化的方向**：

1. **内容缺口分析**
   ```
   contentGapAnalysis: {
     recommendedContentCount: number  // 该分类建议文章数
     currentContentCount: number      // 当前文章数
     gap: number                      // 缺口
     priorityTopics: string[]         // 优先创建的主题
     competitorCoverage: number       // 竞品覆盖率 0-100
   }
   ```

2. **分类表现数据**
   ```
   categoryPerformance: {
     avgTrafficPerArticle: number
     avgConversionRate: number
     bestPerformingArticles: string[]
     underperformingArticles: string[]
     suggestedOptimization: string[]
   }
   ```

**C. 素材库优化方向**

当前已有：
- ✅ 图片、数据、案例、引用管理
- ✅ 使用追踪
- ✅ 质量评分

**还可以优化的方向**：

1. **智能标签和分类**
   ```
   aiTags: {
     autoTags: string[]          // AI 自动识别的标签
     visualElements: string[]    // 图片内容识别
     emotions: string[]          // 情感标签
     colors: string[]            // 主色调
     style: string               // 视觉风格
   }
   ```

2. **素材推荐引擎**
   ```
   recommendationScore: {
     contentRelevance: number    // 内容相关性 0-100
     visualAppeal: number        // 视觉吸引力 0-100
     historicalPerformance: number  // 历史表现 0-100
     freshness: number           // 新鲜度 0-100
     overallScore: number        // 综合评分 0-100
   }
   ```

3. **素材版本管理**
   ```
   versionControl: {
     currentVersion: string
     history: Array<{
       version: string
       updatedAt: datetime
       changes: string
       updatedBy: string
     }>
     abTestVariants: Array<{
       variantId: string
       performance: {
         clicks: number
         engagement: number
       }
     }>
   }
   ```

**D. 客户数据库优化方向**

当前已有：
- ✅ 基础客户信息
- ✅ 使用数据和成果
- ✅ 案例研究

**还可以优化的方向**：

1. **客户分层和画像**
   ```
   customerSegmentation: {
     tier: "enterprise" | "mid-market" | "smb"
     lifecycle: "prospect" | "trial" | "customer" | "champion"
     healthScore: number         // 客户健康度 0-100
     churnRisk: "low" | "medium" | "high"
     expansionOpportunity: number  // 扩展机会评分
   }
   
   customerPersona: {
     role: string                // 决策者角色
     painPoints: string[]        // 痛点
     goals: string[]             // 目标
     preferredChannels: string[] // 偏好渠道
     contentConsumptionPattern: {
       frequency: string
       format: string[]
       topics: string[]
     }
   }
   ```

2. **客户旅程追踪**
   ```
   customerJourney: {
     touchpoints: Array<{
       timestamp: datetime
       channel: string           // "blog" | "email" | "social" | "sales"
       contentId: string
       action: string            // "viewed" | "clicked" | "downloaded"
       stage: "awareness" | "consideration" | "decision" | "retention"
     }>
     
     conversionPath: {
       firstTouch: string
       lastTouch: string
       assistedTouches: string[]
       timeToConversion: number  // 天数
     }
   }
   ```

**E. 新增：竞品情报库（Competitor Intelligence）**

这是一个当前缺失但可能很有价值的输入源：

```
CompetitorIntelligence {
  id: string
  competitorName: string
  website: string
  
  // 内容策略分析
  contentStrategy: {
    topPerformingTopics: string[]
    contentFrequency: number          // 周发布频率
    avgContentLength: number
    contentTypes: string[]
    tone: string
  }
  
  // 关键词覆盖
  keywordCoverage: {
    totalKeywords: number
    sharedKeywords: string[]          // 与我们重叠的关键词
    uniqueKeywords: string[]          // 他们独有的关键词
    keywordGaps: string[]             // 我们的机会
  }
  
  // 内容缺口
  contentGaps: Array<{
    topic: string
    theirRanking: number
    ourRanking: number | null
    opportunity: "high" | "medium" | "low"
  }>
  
  // 反向链接
  backlinks: {
    totalBacklinks: number
    domainAuthority: number
    topReferringDomains: string[]
  }
  
  // 更新频率
  lastAnalyzed: datetime
  nextAnalysisDate: datetime
}
```

### 10.2 输出模型优化分析

#### 当前输出体系回顾

```
现有输出：
  ├─ 长文博客（Article）
  ├─ 短文案（Snippet）
  ├─ 社交媒体（Social Media Post）
  ├─ 邮件内容（Email Content）
  └─ 广告文案（Ad Copy）
```

#### 输出优化方向探讨

**A. 长文博客优化方向**

当前已有比较完善的模型，可以优化的点：

1. **内容结构模板**
   ```
   contentTemplate: {
     templateType: "how-to" | "listicle" | "case-study" | "comparison" | "guide"
     structure: {
       introduction: {
         hook: string
         problem: string
         promise: string
       }
       body: Array<{
         sectionType: "explanation" | "example" | "data" | "quote"
         content: string
       }>
       conclusion: {
         summary: string
         cta: string
         nextSteps: string[]
       }
     }
   }
   ```

2. **交互元素**
   ```
   interactiveElements: {
     toc: boolean                    // 目录
     jumpLinks: boolean              // 跳转链接
     expandableSections: boolean     // 可展开章节
     inlineCalculators: Array<{      // 内嵌计算器
       type: "roi" | "cost" | "time"
       position: number
     }>
     progressBar: boolean            // 阅读进度条
   }
   ```

3. **内容变体（A/B 测试）**
   ```
   contentVariants: Array<{
     variantId: string
     changes: {
       title: string | null
       introduction: string | null
       cta: string | null
     }
     performance: {
       views: number
       timeOnPage: number
       bounceRate: number
       conversionRate: number
     }
     winner: boolean
   }>
   ```

**B. 新增：交互式内容（Interactive Content）**

这是一个高价值但当前缺失的输出类型：

```
InteractiveContent {
  id: string
  type: "calculator" | "quiz" | "assessment" | "configurator" | "comparison_tool"
  
  // 计算器示例
  calculator: {
    title: string
    description: string
    inputs: Array<{
      id: string
      label: string
      type: "number" | "select" | "slider"
      unit: string | null
      min: number | null
      max: number | null
      default: number | string
    }>
    
    formula: string                   // 计算公式
    outputs: Array<{
      id: string
      label: string
      format: "currency" | "percentage" | "number"
      interpretation: string          // 结果解读
    }>
    
    ctaOnResult: {
      text: string
      url: string
      condition: string               // 如：result > 1000
    }
  }
  
  // 测评/测试示例
  quiz: {
    title: string
    description: string
    questions: Array<{
      question: string
      options: Array<{
        text: string
        score: number
        category: string | null
      }>
    }>
    
    results: Array<{
      scoreRange: { min: number, max: number }
      title: string
      description: string
      recommendations: string[]
      cta: {
        text: string
        url: string
      }
    }>
  }
  
  // 数据收集
  leadCapture: {
    enabled: boolean
    fields: string[]                  // ["email", "company", "industry"]
    gatedContent: boolean             // 是否需要填写才能看结果
  }
  
  // 关联
  sourceArticleId: string | null
  keywordId: string
}
```

**C. 新增：内容系列（Content Series）**

将相关内容组织成系列，提升用户粘性：

```
ContentSeries {
  id: string
  title: string
  description: string
  
  // 系列结构
  structure: {
    seriesType: "course" | "guide" | "journey" | "challenge"
    totalParts: number
    duration: number                  // 预估完成时间（天）
    difficulty: "beginner" | "intermediate" | "advanced"
  }
  
  // 内容列表
  contents: Array<{
    partNumber: number
    contentId: string
    title: string
    estimatedTime: number             // 分钟
    prerequisites: string[]           // 前置要求
    learningObjectives: string[]      // 学习目标
  }>
  
  // 用户进度追踪
  progressTracking: {
    enabled: boolean
    completionCriteria: "view" | "time_spent" | "quiz_passed"
    certificate: boolean              // 是否颁发证书
  }
  
  // 个性化路径
  personalization: {
    adaptiveContent: boolean          // 根据用户选择调整内容
    branches: Array<{
      condition: string
      nextPartId: string
    }>
  }
}
```

**D. 新增：内容更新策略（Content Refresh）**

自动识别需要更新的内容：

```
ContentRefreshStrategy {
  contentId: string
  
  // 更新触发条件
  triggers: {
    ageThreshold: number              // 超过N天需要复审
    performanceDecline: {
      trafficDrop: number             // 流量下降超过N%
      rankingDrop: number             // 排名下降超过N位
    }
    competitorUpdate: boolean         // 竞品更新了类似内容
    dataOutdated: boolean             // 引用的数据过时
    productChange: boolean            // 产品功能变化
  }
  
  // 更新建议
  refreshRecommendation: {
    priority: "high" | "medium" | "low"
    suggestedChanges: string[]
    newKeywords: string[]
    newStatistics: string[]
    competitorInsights: string[]
  }
  
  // 更新历史
  refreshHistory: Array<{
    refreshedAt: datetime
    changes: string[]
    performanceImpact: {
      trafficChange: number
      rankingChange: number
    }
  }>
}
```

### 10.3 输入输出模型关联优化

#### 智能匹配机制

```
InputOutputMatcher {
  // 关键词 → 内容类型匹配
  keywordToContentType: {
    searchIntent: "informational" → contentType: "blog_post" | "guide"
    searchIntent: "transactional" → contentType: "product_page" | "comparison"
    searchIntent: "navigational" → contentType: "landing_page"
    searchIntent: "commercial" → contentType: "case_study" | "calculator"
  }
  
  // 客户阶段 → 内容推荐
  customerStageMapping: {
    stage: "awareness" → [
      { type: "blog_post", topics: ["industry_trends", "challenges"] },
      { type: "social_media", format: "educational" }
    ]
    stage: "consideration" → [
      { type: "case_study", focus: "results" },
      { type: "comparison", includeCompetitors: true }
    ]
    stage: "decision" → [
      { type: "calculator", showROI: true },
      { type: "demo_video", includeTestimonial: true }
    ]
  }
  
  // 素材 → 内容格式匹配
  assetToFormat: {
    hasVideo: boolean → recommendVideoScript: true
    hasDetailedData: boolean → recommendInfographic: true
    hasCustomerQuotes: boolean → recommendCaseStudy: true
    hasComparisons: boolean → recommendComparisonTable: true
  }
}
```

---

现在让我们讨论：

1. **输入端**：您觉得哪些输入优化方向最有价值？还有其他输入源需要补充吗？

2. **输出端**：交互式内容、内容系列、内容更新策略这些新的输出类型，您觉得哪些对您的业务最有价值？

3. **输入输出关联**：智能匹配机制的设计是否符合您的预期？还需要考虑哪些关联规则？


#### 9.5.2 集成架构

```
┌──────────────────────────────────────────────────────┐
│              Dify 知识库（可选）                       │
│  • 产品文档库                                          │
│  • 历史文章库                                          │
│  • 竞品分析库                                          │
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│         知识库适配层（KB Adapter Service）             │
│  • RAG 检索                                            │
│  • 相关性评分                                          │
│  • 上下文拼接                                          │
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│            Research Agent（增强版）                    │
│  输入：关键词 + 结构化数据 + 知识库检索结果            │
└──────────────────────────────────────────────────────┘
```

#### 9.5.3 使用场景

**场景 1: 产品功能详解文章**

```
问题：需要准确描述产品功能细节
解决：
  1. 从知识库检索产品文档
  2. 提取功能说明
  3. 结合用户案例
  4. 生成准确的功能介绍
```

**场景 2: 历史文章去重**

```
问题：避免重复相似主题的文章
解决：
  1. 检索知识库中的历史文章
  2. 相似度分析
  3. 如果相似度 > 80% → 建议更新而非新建
  4. 如果相似度 < 80% → 创建新文章，但引用旧文章
```

**场景 3: 竞品对比文章**

```
问题：需要准确的竞品信息
解决：
  1. 从知识库检索竞品分析报告
  2. 提取功能对比数据
  3. 生成客观的对比分析
  4. 定期更新竞品数据
```

#### 9.5.4 数据模型

```
KnowledgeBaseConfig {
  id: string
  provider: "dify" | "custom"
  
  // 连接配置
  connection: {
    apiEndpoint: string
    apiKey: string
    workspaceId: string
  }
  
  // 知识库列表
  knowledgeBases: Array<{
    id: string
    name: string
    type: "product_docs" | "historical_articles" | "competitor_research" | "other"
    enabled: boolean
    priority: number                   // 检索优先级
  }>
  
  // 检索配置
  retrievalConfig: {
    enabled: boolean
    topK: number                       // 返回前 K 个结果
    minRelevanceScore: number          // 最低相关性分数 0-1
    contextWindow: number              // 上下文窗口大小
  }
  
  // 使用策略
  usagePolicy: {
    autoRetrieve: boolean              // 是否自动检索
    requireHumanApproval: boolean      // 是否需要人工批准
    maxTokens: number                  // 每次检索最大 token 数
  }
}

ContentGeneration {
  // ... 原有字段 ...
  
  // 知识库引用
  knowledgeBaseReferences: Array<{
    kbId: string
    documentId: string
    snippet: string
    relevanceScore: number
    usedInSection: string              // 使用在哪个段落
  }>
}
```

#### 9.5.5 API 接口

```
POST   /api/v1/kb/connect               连接知识库
GET    /api/v1/kb/list                  列出知识库
POST   /api/v1/kb/search                检索知识库
GET    /api/v1/kb/stats                 知识库使用统计
PUT    /api/v1/kb/config                更新配置
```

#### 9.5.6 决策清单

**何时启用知识库**：

```
✓ 场景 1: 产品复杂，需要频繁引用产品文档
✓ 场景 2: 历史文章 > 500篇，去重成为问题
✓ 场景 3: 竞品分析频繁更新，需要集中管理
✓ 场景 4: 多团队协作，需要统一知识来源
✓ 场景 5: 合规要求高，需要引用可追溯

✗ 不需要场景：
  - 结构化输入已足够（关键词库+素材库+客户数据）
  - 内容主要基于外部研究（搜索引擎）
  - 团队小，手动管理可行
  - 初期 MVP，先验证核心流程
```

**评估标准**：

| 标准 | 阈值 | 当前状态 |
|------|------|---------|
| 产品文档页面数 | > 100 | ❓ 待评估 |
| 历史文章数量 | > 500 | ❓ 待评估 |
| 竞品数量 | > 5 | ❓ 待评估 |
| 团队规模 | > 10人 | ❓ 待评估 |
| 合规要求 | 高 | ❓ 待评估 |

**满足 ≥ 3 个条件 → 建议启用知识库**

---

## 十、更新后的系统架构图

### 10.1 完整架构全景

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            输入体系层（增强）                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │关键词库  │ │分类库    │ │素材库    │ │客户数据  │ │知识库    │      │
│  │(多语言)  │ │(3级层级) │ │(AI生成)  │ │(CRM集成) │ │(可选)    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI Agent 生产引擎层（Multi-Agent）                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Research → Writer → Optimizer → Quality → Publisher              │   │
│  │              ↑                                                    │   │
│  │       Localization Agent (多语言)                                 │   │
│  │       Media Adapter Agent (音视频)                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        输出体系层（多样化+多语言）                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │长文博客│ │短文案  │ │社交媒体│ │邮件内容│ │广告文案│ │视频/播客│    │
│  │Article │ │Snippet │ │Social  │ │Email   │ │Ad Copy │ │Media    │    │
│  │(12种语│ │        │ │        │ │        │ │        │ │        │    │
│  │言支持) │ │        │ │        │ │        │ │        │ │        │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        外部系统集成层                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Sanity CMS│ │CRM系统   │ │AI图片    │ │知识库    │ │分析平台  │      │
│  │(内容存储)│ │(客户数据)│ │(DALL-E)  │ │(Dify)    │ │(GA/Mixpanel)│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                          分发渠道层                                        │
│  Website | Blog | Social Media | Email | Ads | Video | Podcast          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.2 扩展功能模块图

```
核心系统
  ├─ 输入体系
  │   ├─ 关键词库 ⭐⭐⭐ (必需)
  │   ├─ 分类库   ⭐⭐⭐ (必需)
  │   ├─ 素材库   ⭐⭐⭐ (必需)
  │   ├─ 客户数据 ⭐⭐  (重要)
  │   └─ 知识库   ⭐   (可选)
  │
  ├─ AI Agent
  │   ├─ Research Agent    ⭐⭐⭐ (必需)
  │   ├─ Writer Agent      ⭐⭐⭐ (必需)
  │   ├─ Optimizer Agent   ⭐⭐⭐ (必需)
  │   ├─ Quality Agent     ⭐⭐⭐ (必需)
  │   ├─ Publisher Agent   ⭐⭐⭐ (必需)
  │   ├─ Localization Agent ⭐⭐ (Phase 2)
  │   └─ Media Adapter Agent ⭐  (Phase 3)
  │
  ├─ 输出体系
  │   ├─ 长文博客   ⭐⭐⭐ (必需)
  │   ├─ 短文案     ⭐⭐  (Phase 2)
  │   ├─ 社交媒体   ⭐⭐  (Phase 2)
  │   ├─ 邮件内容   ⭐⭐  (Phase 2)
  │   ├─ 广告文案   ⭐   (Phase 3)
  │   └─ 视频/播客  ⭐   (Phase 3)
  │
  └─ 外部集成
      ├─ Sanity CMS      ⭐⭐⭐ (必需)
      ├─ CRM 集成        ⭐⭐  (Phase 2)
      ├─ AI 图片生成     ⭐   (Phase 3)
      ├─ 知识库集成      ⭐   (可选)
      └─ 分析平台        ⭐⭐  (Phase 2)
```

### 10.3 数据流图

```
┌──────────────────────────────────────────────────────────┐
│                    内容生产流程                           │
└──────────────────────────────────────────────────────────┘

Step 1: 准备输入
  ├─ 查询关键词库 → 获取关键词详情
  ├─ 查询分类库   → 确定内容策略
  ├─ 查询素材库   → 获取相关素材
  ├─ 查询客户数据 → 获取案例和数据
  └─ (可选) 查询知识库 → 获取产品文档
        ↓
Step 2: Research Agent
  ├─ 竞品分析
  ├─ 内容缺口识别
  ├─ 大纲规划
  └─ 素材推荐
        ↓
Step 3: Writer Agent
  ├─ 生成草稿 (Pass 1)
  ├─ 扩展细节 (Pass 2)
  ├─ 语言润色 (Pass 3)
  ├─ 引用素材和案例
  └─ (可选) 调用 AI 图片生成
        ↓
Step 4: Optimizer Agent
  ├─ SEO 优化
  ├─ GEO 优化
  ├─ 可读性优化
  └─ CTA 优化
        ↓
Step 5: Quality Agent
  ├─ 基础检查
  ├─ 事实核查
  ├─ 原创性检查
  └─ 质量评分
        ↓
Step 6: (可选) Localization Agent
  ├─ 多语言翻译
  ├─ 文化适配
  └─ 本地化调整
        ↓
Step 7: (可选) Media Adapter Agent
  ├─ 生成视频脚本
  ├─ 生成播客大纲
  └─ 生成社交媒体内容
        ↓
Step 8: Publisher Agent
  ├─ 写入 Sanity CMS
  ├─ 生成预览链接
  ├─ 触发通知
  └─ (可选) 回写到 CRM
        ↓
Step 9: 人工审核
  ├─ 审核通过 → 发布
  └─ 审核拒绝 → 返回修改
        ↓
Step 10: 分发和追踪
  ├─ 发布到 Website/Blog
  ├─ 分发到社交媒体
  ├─ 发送邮件营销
  └─ 追踪效果数据
```

---

## 十一、成本与收益分析（更新）

### 11.1 投资成本

#### 开发成本

| 阶段 | 功能 | 人力 | 时间 | 成本 |
|------|------|------|------|------|
| Phase 1 | 基础链路 | 2人 | 2周 | $20k |
| Phase 2 | 核心功能 | 2人 | 6周 | $60k |
| Phase 3 | 扩展功能 | 2人 | 8周 | $80k |
| Phase 4 | 高级功能 | 2人 | 6周 | $60k |
| **总计** | - | - | **22周** | **$220k** |

#### 运营成本（月度）

| 项目 | 说明 | 成本/月 |
|------|------|---------|
| 服务器 | AWS/阿里云 (4C16G × 2) | $400 |
| 数据库 | MySQL + Redis | $200 |
| CDN | 图片/静态资源 | $150 |
| Claude API | 10k 文章/月 @ $0.10/篇 | $1,000 |
| DALL-E 3 | 500 图片/月 @ $0.04/张 | $20 |
| Sanity CMS | Pro 计划 | $199 |
| CRM API | HubSpot/Salesforce | $100 |
| 监控告警 | Datadog/Sentry | $50 |
| 备份存储 | S3 | $30 |
| **总计** | - | **$2,149** |

#### 人工成本（月度）

| 角色 | 职责 | 人数 | 成本/月 |
|------|------|------|---------|
| 内容审核 | 质量把控 | 1人 | $5,000 |
| 运营专员 | 任务配置、发布管理 | 1人 | $4,000 |
| 技术运维 | 系统维护 | 0.5人 | $3,000 |
| **总计** | - | 2.5人 | **$12,000** |

**总运营成本**: $2,149 (系统) + $12,000 (人工) = **$14,149/月**

### 11.2 收益分析

#### 效率提升

**传统人工方式**：
- 生产能力: 2篇/天/人
- 月生产量: 2 × 20天 = 40篇
- 需要人数: 10人
- 月度人工成本: 10人 × $5,000 = **$50,000**

**AI 自动化方式**：
- 生产能力: 50篇/天
- 月生产量: 50 × 20天 = 1,000篇
- 需要人数: 2.5人（审核+运营）
- 月度总成本: $14,149

**效率提升**: 1,000 / 40 = **25倍**  
**成本节省**: ($50,000 - $14,149) / $50,000 = **71.7%**

#### 业务效果（预期）

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 月发布文章 | 40篇 | 1,000篇 | +2400% |
| 自然流量 | 10k/月 | 50k/月 | +400% |
| 关键词排名 Top 10 | 50个 | 500个 | +900% |
| 潜客获取 | 100/月 | 500/月 | +400% |
| 潜客获取成本 | $500 | $200 | -60% |
| 内容营销 ROI | 150% | 500% | +233% |

### 11.3 投资回报周期

```
累计投资：
  开发成本: $220,000 (一次性)
  运营成本: $14,149/月

累计节省：
  人工成本节省: $35,851/月 ($50k - $14.149k)

回本周期：
  $220,000 / $35,851 = 6.1个月

额外收益（业务增长）：
  假设每个潜客价值 $1,000
  新增潜客: 400/月
  月度新增收入: $400,000
  扣除运营成本后: $400,000 - $14,149 = $385,851

考虑业务增长的回本周期：
  $220,000 / $385,851 = 0.57个月（不到1个月）
```

**结论**: 纯成本节省角度 6个月回本，考虑业务增长不到 1 个月回本

### 11.4 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| AI 质量不稳定 | 中 | 高 | 多轮质检 + 人工审核 |
| API 成本超支 | 中 | 中 | 配额控制 + 成本告警 |
| CRM 集成复杂 | 高 | 中 | Phase 2 再做 + 标准化适配 |
| 多语言本地化成本高 | 中 | 中 | 渐进式扩展 + AI 辅助 |
| 内容同质化 | 中 | 中 | Prompt 多样化 + 人工干预 |
| 知识库维护成本 | 低 | 低 | 可选模块，按需启用 |

---

## 十二、实施路线图（更新）

### 12.1 Phase 1: 基础 MVP（2周）

**目标**: 验证核心链路

```
Week 1:
  ├─ Docker 环境搭建
  ├─ 前端框架选型和初始化
  ├─ 后端 Spring Boot 项目初始化
  └─ Sanity CMS 配置

Week 2:
  ├─ 实现关键词库（基础版）
  ├─ 实现 Writer Agent（单一 Agent）
  ├─ 打通 Sanity MCP 写入
  └─ 人工测试发布流程

交付物：
  ✓ 可运行的 Docker 环境
  ✓ 基础前端界面
  ✓ 关键词 → 文章生成 → Sanity 存储闭环
  ✓ 5-10篇测试文章
```

### 12.2 Phase 2: 核心功能（6周）

**目标**: 企业级内容生产能力

```
Week 3-4: 输入体系
  ├─ 完善关键词库（优先级/效果追踪）
  ├─ 实现分类库（3级层级）
  ├─ 实现素材库（图片/数据/案例）
  └─ 客户数据库（基础版）

Week 5-6: Multi-Agent 架构
  ├─ Research Agent
  ├─ Writer Agent (Multi-Pass)
  ├─ Optimizer Agent (SEO/GEO)
  ├─ Quality Agent
  └─ Publisher Agent

Week 7-8: 输出多样化
  ├─ 长文博客（完善）
  ├─ 短文案生成
  ├─ 社交媒体帖子
  └─ 邮件内容

交付物：
  ✓ 完整的输入体系
  ✓ Multi-Agent 生产引擎
  ✓ 4种输出类型
  ✓ 批量生产能力（50篇/天）
  ✓ 质量评分系统
```

### 12.3 Phase 3: 扩展功能（8周）

**目标**: 全球化+多样化+智能化

```
Week 9-10: 多语言支持
  ├─ Localization Agent
  ├─ 支持 6-8 种语言
  ├─ 翻译质量评估
  └─ 文化适配

Week 11-12: AI 图片生成
  ├─ 集成 DALL-E 3
  ├─ Prompt 生成策略
  ├─ 图片后处理
  └─ 成本优化

Week 13-14: CRM 集成
  ├─ Salesforce/HubSpot 连接
  ├─ 数据同步（双向）
  ├─ 客户洞察提取
  └─ 个性化内容生成

Week 15-16: 音视频扩展
  ├─ Media Adapter Agent
  ├─ 视频脚本生成
  ├─ 播客大纲生成
  └─ 制作资源清单

交付物：
  ✓ 多语言内容生产
  ✓ AI 图片自动配图
  ✓ CRM 深度集成
  ✓ 视频/播客脚本生成
  ✓ 广告文案生成
```

### 12.4 Phase 4: 高级功能（6周）

**目标**: 知识库+高级分析+自动化优化

```
Week 17-18: 知识库集成（可选）
  ├─ Dify 集成
  ├─ RAG 检索
  ├─ 产品文档引用
  └─ 历史文章去重

Week 19-20: 高级分析
  ├─ 内容效果追踪
  ├─ ROI 分析
  ├─ A/B 测试
  └─ 智能推荐

Week 21-22: 自动化优化
  ├─ Prompt 自动优化
  ├─ 质量模型训练
  ├─ 发布节奏优化
  └─ 成本优化

交付物：
  ✓ (可选) 知识库集成
  ✓ 完整的分析仪表板
  ✓ A/B 测试平台
  ✓ 自动化优化系统
```

### 12.5 里程碑验收标准

| 阶段 | 验收标准 | 成功指标 |
|------|---------|---------|
| Phase 1 | 闭环打通 | 成功生成并发布 10 篇文章 |
| Phase 2 | 批量生产 | 日生产 50 篇，质量评分 > 85 |
| Phase 3 | 全球化 | 支持 6 种语言，CRM 数据同步 |
| Phase 4 | 智能化 | ROI 提升 300%，成本降低 50% |

---

## 十三、总结

### 13.1 架构亮点

1. **结构化输入体系** → 不依赖知识库也能高质量生产
2. **Multi-Agent 协作** → 确保质量和效率的平衡
3. **输出多样化** → 从博客到视频，覆盖全营销渠道
4. **多语言支持** → 支撑全球化扩张
5. **Docker 一键部署** → 降低部署和运维门槛
6. **可选扩展** → CRM/知识库/AI 图片按需启用
7. **渐进式实施** → 快速验证，持续迭代

### 13.2 核心价值主张

```
从零到一：
  2周验证 MVP → 6周核心功能 → 8周扩展功能 → 6周高级功能
  
效率革命：
  生产效率提升 25倍
  成本降低 72%
  
业务增长：
  自然流量增长 400%
  潜客获取成本降低 60%
  内容营销 ROI 提升 300%
  
投资回报：
  6 个月回本（纯成本节省）
  1 个月回本（考虑业务增长）
```

### 13.3 下一步行动

1. **立即行动**：
   - [ ] 组建团队（2名全栈工程师）
   - [ ] 准备开发环境（AWS/阿里云）
   - [ ] 申请 API Key（Claude/Sanity）

2. **Week 1**：
   - [ ] Docker 环境搭建
   - [ ] 前后端项目初始化
   - [ ] Sanity CMS 配置

3. **Week 2**：
   - [ ] 实现关键词库（MVP）
   - [ ] 实现 Writer Agent（单一）
   - [ ] 完成首篇文章生成和发布

4. **Week 3+**：
   - [ ] 按照 Phase 2-4 路线图持续迭代

---

**文档版本**: v2.0  
**最后更新**: 2026-07-28  
**维护者**: Content Automation Team  
**变更日志**:
- v2.0 (2026-07-28): 新增扩展功能章节（视频/播客、AI图片、CRM集成、多语言、知识库）
- v1.0 (2026-07-28): 初始版本
