# 输入输出演进矩阵

> 状态：架构优化草案。仅调整现有内容生产的输入、输出和演进边界；不创建新服务、不改变发布权限、不启动自动发布。

## 一、优化结论

原模型“提示词 + 关键词 + 语言/字数 + 图片 URL → 长文 + 图片”过于扁平：它无法稳定约束文章结构、受众、转化目标和事实来源，也没有让运营直接获得可审核的 SEO 与转化产物。

本次只做四项修改：

1. 将 Phase 3 的输入从零散字段收敛为六组结构化输入。
2. 将输出从“长文 + 图片”补齐为五类可审核产物。
3. 图片 URL 改为可管理的素材/资产引用；Markdown 仅可作为生成中间格式，文章正式数据以 Sanity Portable Text 为准。
4. 取消无依据的质量分数、月产量和“输入越多质量必然越高”的承诺，改用可解释的 `pass / warn / block` 检查。

## 二、演进矩阵总览

| 阶段 | 输入重点 | 输出重点 | 进入下一阶段的条件 |
|---|---|---|---|
| Phase 1：人工文章 | 编辑专业判断与人工素材 | 人工文章、基础 SEO 元数据 | 人工创建、审核、发布和前台渲染链路跑通 |
| Phase 2：对话式 AI 辅助 | 自然语言要求、人工追问与反馈 | 单篇可编辑的 AI 草稿 | 运营已需要重复生成同类文章，且人工审核仍可控 |
| Phase 3：结构化 MVP | 六组结构化输入、运营预设、关键词/素材引用 | 五类结构化输出、人工审核草稿 | 单篇草稿能稳定进入 Sanity，审核问题可定位 |
| Phase 3.1：内容知识增强 | 已核验事实、素材、内链和模板预设 | 可追溯主张、内链网络、更新建议 | 审核反复因事实、素材或内链问题退回 |
| Phase 3.2：按需拆分能力 | 有证据表明单一 Agent 成为瓶颈 | 可选研究、写作、质检或内容复用产物 | 先有稳定的单 Agent 流程与明确瓶颈 |
| Phase 3.3：反馈与本地化 | 人工反馈、已验证的市场内容 | 内容迭代与经审核的本地化版本 | 简中内容、审核和前台收录验证稳定后再进入 |

说明：阶段不是质量分数或产量承诺。文章是否值得发布，由事实依据、编辑审核、可读性和用户价值决定。

## 三、Phase 3：结构化 MVP 输入模型

### 3.1 输入从 4 项优化为 6 组

| 输入组 | 字段 | 运营操作 | 作用 |
|---|---|---|---|
| 1. 任务要求 | `editorBrief`、必须回答的问题、禁用表述 | 自由填写，可为空 | 补充结构化字段无法表达的特殊要求 |
| 2. 内容策略 | `contentType`、`audience`、`primaryObjective` | 从运营可配置的下拉预设选择 | 稳定文章结构、深度、语气与转化侧重点 |
| 3. 关键词计划 | 主关键词、辅助关键词、问题词 | 关联 `KeywordEntry` | 将一个页面绑定到一个中心搜索意图，避免关键词堆砌 |
| 4. 产品与场景上下文 | 产品能力主题、平台、类目/市场（适用时） | 默认 Amazon；按主题选择 | 让内容只讨论真实的卖家精灵能力和相关卖家任务 |
| 5. 内容配置 | `locale`、字数档位、语气/风格 | 从预设选择 | 当前只启用 `cn` / `zh-cn`；字数为范围而非质量承诺 |
| 6. 素材与依据 | 封面/正文资产、数据、引用、案例、产品事实 | 关联 `MaterialAsset` 或已审核来源 | 给具体产品、数据、客户成果或案例主张提供依据 |

### 3.2 输入组详细定义

#### 3.2.1 内容策略预设值

**内容类型（contentType）**：
```typescript
type ContentType = 
  | 'guide'              // 指南：系统性介绍某个主题
  | 'tutorial'           // 教程：分步骤操作指导
  | 'feature-doc'        // 功能说明：产品功能使用文档
  | 'glossary'           // 术语解释：行业术语定义
  | 'comparison'         // 对比：A vs B 或多工具对比
  | 'case-study'         // 案例研究：客户成功故事
  | 'update'             // 更新说明：产品更新/行业动态
  | 'list'               // 榜单：Top N / Best of 类型

// 每种类型的默认结构
const contentTypeDefaults = {
  guide: {
    structure: ['引言', '背景/概念', '主体章节(3-5个)', '总结/下一步'],
    minSections: 4,
    recommendedWordCount: 'medium',
    tone: 'professional'
  },
  tutorial: {
    structure: ['目标和前提', '步骤1-N', '常见问题', '总结'],
    minSections: 3,
    recommendedWordCount: 'medium',
    tone: 'instructive'
  },
  comparison: {
    structure: ['对比背景', '对比维度', '对比表格', '选择建议'],
    minSections: 3,
    recommendedWordCount: 'short',
    tone: 'objective'
  },
  'case-study': {
    structure: ['客户背景', '挑战', '解决方案', '成果', '关键要点'],
    minSections: 4,
    recommendedWordCount: 'medium',
    tone: 'narrative'
  }
  // ... 其他类型
};
```

**目标受众（audience）**：
```typescript
type Audience = 
  | 'beginner-seller'      // 新手卖家（0-1年）
  | 'growing-seller'       // 成长卖家（1-3年）
  | 'selection-specialist' // 选品人员
  | 'operation-specialist' // 运营/PPC人员

const audiencePresets = {
  'beginner-seller': {
    assumedKnowledge: '基础电商概念，亚马逊基本术语',
    avoidJargon: true,
    provideGlossary: true,
    exampleComplexity: 'simple',
    recommendedTone: 'friendly'
  },
  'growing-seller': {
    assumedKnowledge: '亚马逊运营基础，常用工具',
    avoidJargon: false,
    provideGlossary: false,
    exampleComplexity: 'intermediate',
    recommendedTone: 'professional'
  },
  'operation-specialist': {
    assumedKnowledge: '广告、数据分析、竞品研究',
    avoidJargon: false,
    provideGlossary: false,
    exampleComplexity: 'advanced',
    recommendedTone: 'technical'
  }
  // ...
};
```

**主要目标（primaryObjective）**：
```typescript
type PrimaryObjective = 
  | 'education'         // 教育：解释概念、建立认知
  | 'problem-solving'   // 解决问题：回答具体问题
  | 'seo-coverage'      // SEO覆盖：覆盖搜索需求
  | 'tool-trial'        // 工具试用：引导使用产品

const objectivePresets = {
  'education': {
    ctaType: 'soft',              // 轻量CTA
    ctaPosition: ['bottom'],      // 仅底部
    contentPriority: 'depth',     // 内容深度优先
    internalLinksMin: 2,
    internalLinksMax: 5
  },
  'tool-trial': {
    ctaType: 'medium',            // 中等强度CTA
    ctaPosition: ['middle', 'bottom'],
    contentPriority: 'value',     // 价值主张优先
    internalLinksMin: 3,
    internalLinksMax: 7,
    requireProductLink: true      // 必须有产品链接
  }
  // ...
};
```

#### 3.2.2 关键词计划说明

```typescript
interface KeywordPlan {
  // 主关键词（必填，1个）
  primaryKeyword: {
    keywordId: string;            // 关联 KeywordEntry
    keyword: string;              // 例："amazon keyword research tools"
    searchVolume: number;         // 月搜索量
    difficulty: number;           // 0-100
    searchIntent: 'informational' | 'navigational' | 'transactional';
  };
  
  // 辅助关键词（可选，3-5个）
  secondaryKeywords?: Array<{
    keyword: string;              // 例："keyword finder", "search term research"
    relation: 'synonym' | 'related' | 'subtopic';
    usage: 'natural-integration'; // 自然融入正文，不堆砌
  }>;
  
  // 问题词（可选，2-3个）
  questionKeywords?: Array<{
    question: string;             // 例："how to find keywords on amazon"
    searchVolume: number;
    usage: 'faq-section';         // 用于FAQ section
    targetFeaturedSnippet: boolean; // 是否争取featured snippet
  }>;
}

// 使用规则：
// 1. 主关键词：在标题、H1、前100字、结论中自然出现
// 2. 辅助关键词：分散在H2/H3和正文中，避免密度过高
// 3. 问题词：专门用于FAQ section，使用问答格式
```

#### 3.2.3 产品能力主题详细定义

```typescript
type ProductCapability = 
  | 'selection-research'    // 选品研究
  | 'keyword-tools'         // 关键词工具
  | 'competitor-analysis'   // 竞品分析
  | 'advertising-optimization' // 广告优化

const productCapabilityDetails = {
  'selection-research': {
    displayName: '选品研究',
    subTopics: [
      '市场机会挖掘',
      '类目趋势分析',
      '蓝海选品策略',
      '产品验证方法'
    ],
    relatedFeatures: [
      'market-opportunity-finder',
      'category-analyzer',
      'niche-finder'
    ],
    typicalKeywords: [
      'best products to sell on amazon',
      'amazon niche finder',
      'product research tools'
    ],
    recommendedContentTypes: ['guide', 'tutorial', 'case-study'],
    requiredMaterials: ['product screenshots', 'real data examples']
  },
  
  'keyword-tools': {
    displayName: '关键词工具',
    subTopics: [
      '关键词挖掘',
      '关键词反查',
      '竞品关键词分析',
      '长尾词策略'
    ],
    relatedFeatures: [
      'keyword-miner',
      'reverse-asin-lookup',
      'keyword-tracker'
    ],
    typicalKeywords: [
      'amazon keyword research',
      'keyword tool for amazon',
      'how to find keywords'
    ],
    recommendedContentTypes: ['tutorial', 'guide', 'comparison'],
    requiredMaterials: ['tool screenshots', 'search volume data']
  },
  
  'competitor-analysis': {
    displayName: '竞品分析',
    subTopics: [
      '竞品流量分析',
      '销量估算方法',
      'Listing优化对比',
      '价格策略分析'
    ],
    relatedFeatures: [
      'traffic-analyzer',
      'sales-estimator',
      'listing-optimizer'
    ],
    typicalKeywords: [
      'amazon competitor analysis',
      'sales estimator tool',
      'competitor research'
    ],
    recommendedContentTypes: ['guide', 'tutorial', 'case-study'],
    requiredMaterials: ['competitor data', 'comparison charts']
  },
  
  'advertising-optimization': {
    displayName: '广告优化',
    subTopics: [
      'PPC策略制定',
      '否定词管理',
      '广告报表分析',
      'ACoS优化方法'
    ],
    relatedFeatures: [
      'ppc-manager',
      'negative-keyword-tool',
      'ad-report-analyzer'
    ],
    typicalKeywords: [
      'amazon ppc optimization',
      'sponsored ads strategy',
      'how to reduce acos'
    ],
    recommendedContentTypes: ['guide', 'tutorial', 'case-study'],
    requiredMaterials: ['ad data examples', 'before-after results']
  }
};
```

#### 3.2.4 字数档位量化配置

```typescript
interface WordCountTier {
  name: string;
  min: number;
  target: number;
  max: number;
  description: string;
  typicalUseCase: string[];
}

const wordCountTiers: Record<string, WordCountTier> = {
  short: {
    name: '短文',
    min: 800,
    target: 1200,
    max: 1500,
    description: '快速阅读，聚焦单一要点',
    typicalUseCase: ['术语解释', '产品更新', '简单对比']
  },
  
  medium: {
    name: '中文',
    min: 1500,
    target: 2000,
    max: 2500,
    description: '标准深度，适合大多数主题',
    typicalUseCase: ['教程', '指南', '功能说明', '案例研究']
  },
  
  long: {
    name: '长文',
    min: 2500,
    target: 3500,
    max: 5000,
    description: '深度内容，系统性覆盖',
    typicalUseCase: ['综合指南', '深度研究', '完整方法论']
  }
};

// 配置位置：
// Sanity Studio → Settings → Content Presets → Word Count Tiers
// 权限：Admin only
// 可调整：min/target/max 数值
```

#### 3.2.5 语气风格预设

```typescript
type ToneStyle = 
  | 'professional'    // 专业严谨：数据驱动、逻辑清晰
  | 'friendly'        // 友好易懂：口语化、比喻、幽默
  | 'instructive'     // 指导性：直接、清晰、步骤化
  | 'objective'       // 客观中立：不偏颇、平衡、事实
  | 'narrative'       // 叙事性：故事化、情感、案例

const tonePresets = {
  professional: {
    sentenceStructure: 'complex-allowed',
    terminology: 'industry-standard',
    examples: 'data-focused',
    avoidEmoji: true,
    formalityLevel: 'high'
  },
  
  friendly: {
    sentenceStructure: 'simple-preferred',
    terminology: 'explain-jargon',
    examples: 'relatable-scenarios',
    avoidEmoji: false,
    formalityLevel: 'medium'
  },
  
  instructive: {
    sentenceStructure: 'imperative-sentences',
    terminology: 'clear-definitions',
    examples: 'step-by-step',
    avoidEmoji: true,
    formalityLevel: 'medium'
  }
  // ...
};
```

### 3.3 必填与可选规则

**运营必填**（7项）：
1. 主关键词（keywordId）
2. 内容类型（contentType）
3. 目标受众（audience）
4. 主业务目标（primaryObjective）
5. 产品能力主题（productCapability）
6. 字数档位（wordCountTier）
7. 语气风格（toneStyle）

**按内容类型必填**：
- **比较类**（comparison）：必须关联至少2个对比对象的MaterialAsset
- **案例类**（case-study）：必须关联客户案例MaterialAsset，包含可核验成果
- **数据驱动内容**：任何具体统计数字必须关联数据来源MaterialAsset
- **产品功能说明**：必须关联产品截图或功能文档MaterialAsset

**运营可选**：
- 编辑补充说明（editorBrief）
- 辅助关键词（secondaryKeywords）
- 问题词（questionKeywords）
- 平台类型（platform，默认Amazon）
- 类目/市场（category/market，仅当内容依赖地域或类目差异时填写）
- 封面图片素材（coverAsset）
- 正文图片素材（contentAssets）
- CTA预设选择（ctaPresetId，根据primaryObjective自动推荐）

### 3.4 输入数据结构（TypeScript）

```typescript
interface TaskInput {
  // 1. 任务要求
  taskRequirements?: {
    editorBrief?: string;           // 自由文本补充
    mustAnswerQuestions?: string[]; // 必须回答的问题
    avoidPhrases?: string[];        // 禁用表述
  };
  
  // 2. 内容策略（必填）
  contentStrategy: {
    contentType: ContentType;        // 必填
    audience: Audience;              // 必填
    primaryObjective: PrimaryObjective; // 必填
  };
  
  // 3. 关键词计划（必填主关键词）
  keywordPlan: {
    primaryKeyword: {
      keywordId: string;             // 必填，关联KeywordEntry
      keyword: string;
      searchVolume: number;
      difficulty: number;
      searchIntent: 'informational' | 'navigational' | 'transactional';
    };
    secondaryKeywords?: Array<{      // 可选，3-5个
      keyword: string;
      relation: 'synonym' | 'related' | 'subtopic';
    }>;
    questionKeywords?: Array<{       // 可选，2-3个
      question: string;
      searchVolume: number;
      targetFeaturedSnippet: boolean;
    }>;
  };
  
  // 4. 产品与场景上下文（必填产品能力）
  productContext: {
    productCapability: ProductCapability; // 必填
    platform: 'amazon' | 'shopify' | 'tiktok' | 'general'; // 默认amazon
    category?: string;                 // 可选，仅当依赖类目差异
    market?: string;                   // 可选，仅当依赖地域差异
  };
  
  // 5. 内容配置（必填）
  contentConfig: {
    locale: 'zh-CN' | 'en';           // 当前仅支持zh-CN
    wordCountTier: 'short' | 'medium' | 'long'; // 必填
    toneStyle: ToneStyle;             // 必填
  };
  
  // 6. 素材与依据（按类型必填）
  materialsAndEvidence?: {
    coverAsset?: string;              // MaterialAsset ID
    contentAssets?: string[];         // MaterialAsset IDs
    requiredEvidence?: Array<{        // 必须引用的依据
      materialAssetId: string;
      usageContext: string;           // 用于什么主张
    }>;
  };
  
  // 元数据
  metadata: {
    createdBy: string;
    createdAt: string;
    ctaPresetId?: string;             // 可选，根据objective推荐
    scheduledPublishAt?: string;      // 可选
  };
}
```

## 四、Phase 3：结构化 MVP 输出模型

### 4.1 输出从 2 项优化为 5 类

| 输出 | 至少包含 | 运营价值 |
|---|---|---|
| 1. 结构化文章草稿 | 标题、摘要、H1/H2/H3、正文、结论；写入前转换为 Portable Text | 人工可直接在 Sanity 修改和发布 |
| 2. SEO 元素包 | `metaTitle`、`metaDescription`、slug 候选、中心关键词、标题结构、FAQ 候选 | 降低运营补齐页面 SEO 的重复工作 |
| 3. 图片与素材包 | 封面/正文资产引用、建议插入位置、alt、caption | 图片可在 Sanity 管理、替换和复用，不依赖裸 URL |
| 4. 内链与 CTA 建议 | 已发布页面的内链候选、锚文本、CTA preset 与建议位置 | 让文章连接到真实内容和产品承接路径 |
| 5. 审核报告 | 结构、依据、SEO、链接、素材、待人工确认事项 | 让运营知道应修改什么，而非只得到一篇黑盒文章 |

### 4.2 输出数据结构（TypeScript）

#### 4.2.1 结构化文章草稿

```typescript
interface ArticleDraft {
  // 基础元数据
  title: string;                    // 标题（包含主关键词）
  summary: string;                  // 摘要（150-200字）
  
  // 正文内容（Portable Text格式）
  body: PortableTextBlock[];        // 转换后的Portable Text
  bodyMarkdown?: string;            // 可选，保留Markdown中间稿供调试
  
  // 结构化标题
  headingStructure: {
    h1: string;                     // 主标题（唯一）
    h2List: Array<{
      text: string;
      order: number;
      h3List?: string[];            // 该H2下的H3列表
    }>;
  };
  
  // 统计信息
  statistics: {
    wordCount: number;              // 实际字数
    paragraphCount: number;         // 段落数
    sentenceCount: number;          // 句子数
    readingTime: number;            // 预计阅读时间（分钟）
    imageCount: number;             // 图片数量
    internalLinkCount: number;      // 内链数量
    externalLinkCount: number;      // 外链数量
  };
  
  // 生成元数据
  generatedAt: string;
  generatedBy: 'content-agent-v1';
  inputHash: string;                // 输入的hash，用于追溯
}
```

#### 4.2.2 SEO 元素包

```typescript
interface SEOPackage {
  // 基础Meta标签（候选，运营可修改）
  metaTitle: string;                // 50-60字符，含主关键词
  metaTitleAlternatives?: string[]; // 2-3个备选
  metaDescription: string;          // 120-160字符，吸引点击
  metaDescriptionAlternatives?: string[];
  
  // URL Slug
  slugCandidate: string;            // SEO友好，小写+连字符
  slugAlternatives?: string[];      // 备选slug
  
  // 关键词分布
  keywordUsage: {
    primaryKeyword: {
      keyword: string;
      occurrences: number;
      density: number;              // 百分比
      positions: string[];          // 出现位置：title, h1, first-100-words, conclusion
    };
    secondaryKeywords?: Array<{
      keyword: string;
      occurrences: number;
      naturalIntegration: boolean;  // 是否自然融入
    }>;
  };
  
  // 结构化标题分析
  headingAnalysis: {
    h1Count: number;                // 必须=1
    h2Count: number;
    h3Count: number;
    hierarchyValid: boolean;        // H2必须在H3之前
    issues?: string[];              // 如果有层级问题
  };
  
  // FAQ Schema（结构化数据）
  faqSchema?: Array<{
    question: string;               // 基于questionKeywords生成
    answer: string;                 // 从正文提取或生成
    questionFromInput: boolean;     // 是否来自输入的questionKeywords
  }>;
  
  // Open Graph
  ogData: {
    ogTitle: string;
    ogDescription: string;
    ogImage?: string;               // 如果有coverAsset
    ogType: 'article';
  };
  
  // 技术元数据（不可由Agent覆盖）
  technicalMeta: {
    canonical?: string;             // 由站点规则控制
    noindex?: boolean;              // 由站点规则控制
    robots?: string;                // 由站点规则控制
  };
}
```

#### 4.2.3 图片与素材包

```typescript
interface ImageAndAssetPackage {
  // 封面图
  coverImage?: {
    assetReference: string;         // Sanity asset reference
    assetId: string;                // MaterialAsset ID
    alt: string;                    // Alt文本（含关键词）
    caption?: string;               // 图片说明
    source?: string;                // 来源URL（如果是外部图）
  };
  
  // 正文图片
  contentImages: Array<{
    assetReference: string;         // Sanity asset reference
    assetId: string;                // MaterialAsset ID
    alt: string;                    // 描述性alt
    caption?: string;               // 图片说明
    suggestedPosition: {
      afterHeading?: string;        // 建议插入位置："H2: 关键词研究方法"
      afterParagraph?: number;      // 或：第N段落后
      reason: string;               // 推荐理由
    };
    purpose: 'illustration' | 'data-visualization' | 'screenshot' | 'example';
  }>;
  
  // 其他素材引用
  referencedMaterials: Array<{
    materialAssetId: string;
    materialType: 'data' | 'case' | 'reference' | 'productFact';
    usageLocation: string;          // 在文章中的位置
    usageContext: string;           // 如何使用
  }>;
  
  // 素材覆盖分析
  assetCoverage: {
    totalMaterialsProvided: number;
    materialsUsed: number;
    unusedMaterials?: Array<{
      materialAssetId: string;
      reason: string;               // 为什么没用
    }>;
  };
}
```

#### 4.2.4 内链与CTA建议

```typescript
interface InternalLinkingAndCTA {
  // 内链建议（只能引用已发布页面）
  internalLinkRecommendations: Array<{
    targetPageId: string;           // Sanity document ID
    targetPageTitle: string;
    targetPageSlug: string;
    anchorText: string;             // 推荐锚文本
    suggestedPosition: {
      afterHeading?: string;
      inParagraph?: number;
      context: string;              // 周边文本上下文
    };
    relevanceScore: number;         // 0-1，相关度
    userJourneyFit: number;         // 0-1，用户旅程匹配度
    seoValue: number;               // 0-1，SEO价值
    overallScore: number;           // 综合评分
    reason: string;                 // 推荐理由
  }>;
  
  // 内链约束检查
  internalLinkConstraints: {
    totalRecommendations: number;
    minRequired: number;            // 基于primaryObjective
    maxAllowed: number;
    currentCount: number;
    meetsRequirement: boolean;
  };
  
  // CTA建议
  ctaRecommendations: {
    primary: {
      ctaPresetId: string;          // 关联已批准的CTA preset
      ctaText: string;              // 预设文案
      ctaType: 'button' | 'banner' | 'inline';
      position: 'top' | 'middle' | 'bottom' | 'floating';
      targetUrl: string;            // 预设目标链接
      reason: string;               // 基于primaryObjective的推荐理由
    };
    
    secondary?: {
      ctaPresetId: string;
      ctaText: string;
      ctaType: string;
      position: string;
      targetUrl: string;
      reason: string;
    };
    
    // CTA策略说明
    strategy: {
      intensity: 'light' | 'medium' | 'strong';
      rationale: string;            // 基于primaryObjective
      placementLogic: string;       // 为什么这样放置
    };
  };
  
  // 转化路径设计（基于AIDA模型）
  conversionPath?: {
    attention: string[];            // 吸引注意的元素位置
    interest: string[];             // 引起兴趣的章节
    desire: string[];               // 激发欲望的价值主张
    action: string[];               // 促成行动的CTA位置
  };
}
```

#### 4.2.5 审核报告（结构化）

```typescript
interface AuditReport {
  // 总体状态
  overallStatus: 'pass' | 'warn' | 'block';
  timestamp: string;
  
  // 分项检查
  checks: {
    structure: CheckResult;         // 结构检查
    evidence: CheckResult;          // 依据检查
    seo: CheckResult;               // SEO检查
    links: CheckResult;             // 链接检查
    assets: CheckResult;            // 素材检查
    compliance: CheckResult;        // 合规检查
  };
  
  // 人工确认项
  humanConfirmRequired: Array<{
    id: string;
    type: 'data' | 'case' | 'claim' | 'link' | 'tone';
    severity: 'high' | 'medium' | 'low';
    content: string;                // 需要确认的内容
    location: string;               // 位置
    reason: string;                 // 为什么需要确认
    required: boolean;              // 是否必须确认
    suggestedAction?: string;       // 建议操作
  }>;
  
  // 建议操作
  suggestedActions: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
    autoFixable: boolean;
    estimatedTime?: string;         // 预计耗时
  }>;
  
  // 亮点与不足
  strengthPoints: string[];         // 做得好的地方
  weakPoints: string[];             // 需要改进的地方
}

interface CheckResult {
  status: 'pass' | 'warn' | 'block';
  score: number;                    // 0-100
  weight: number;                   // 权重（用于计算综合状态）
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    code: string;                   // 错误码，如 'SEO-001'
    location: string;               // 具体位置
    message: string;                // 问题描述
    suggestion: string;             // 修复建议
    autoFixable: boolean;           // 是否可自动修复
    relatedTo?: string;             // 关联的输入字段
  }>;
  passedChecks: string[];           // 通过的检查项
  metadata?: Record<string, any>;   // 额外元数据
}
```

### 4.3 审核规则与检查标准

#### 4.3.1 结构检查（Structure Check）

```typescript
const structureChecks = {
  // H1唯一性（block级别）
  'STR-001': {
    name: 'H1 Uniqueness',
    check: 'h1Count === 1',
    severity: 'error',
    message: 'H1标题必须且只能有1个',
    autoFix: false
  },
  
  // 标题层级（warn级别）
  'STR-002': {
    name: 'Heading Hierarchy',
    check: 'H2 must appear before H3, no skip levels',
    severity: 'warning',
    message: '标题层级不正确：H3必须在H2下',
    autoFix: true
  },
  
  // 段落长度（info级别）
  'STR-003': {
    name: 'Paragraph Length',
    check: 'avgParagraphLength < 200 words',
    severity: 'info',
    message: '部分段落过长（>200字），影响可读性',
    autoFix: false
  },
  
  // 最小章节数（warn级别）
  'STR-004': {
    name: 'Minimum Sections',
    check: 'h2Count >= contentType.minSections',
    severity: 'warning',
    message: `${contentType}类型文章至少需要${minSections}个主要章节`,
    autoFix: false
  },
  
  // 字数范围（warn级别）
  'STR-005': {
    name: 'Word Count Range',
    check: 'wordCount in [tier.min, tier.max]',
    severity: 'warning',
    message: `字数${wordCount}不在${tier.name}范围（${tier.min}-${tier.max}）`,
    autoFix: false
  }
};
```

#### 4.3.2 依据检查（Evidence Check）

```typescript
const evidenceChecks = {
  // 无依据的具体数据（block级别）
  'EVI-001': {
    name: 'Unsupported Data Claims',
    check: 'Every specific number/percentage must link to MaterialAsset',
    severity: 'error',
    examples: [
      '❌ "用户流量提升了47%" 但无MaterialAsset',
      '✅ "根据我们的客户数据[^1]，流量提升了47%" + MaterialAsset reference'
    ],
    autoFix: false,
    message: '段落{location}包含具体数据但无依据'
  },
  
  // 无依据的客户案例（block级别）
  'EVI-002': {
    name: 'Unsupported Case Studies',
    check: 'Case study claims must link to case MaterialAsset',
    severity: 'error',
    examples: [
      '❌ "ABC公司使用后销量提升50%" 但无案例素材',
      '✅ 关联MaterialAsset type=case，包含客户信息和核验成果'
    ],
    autoFix: false,
    message: '客户案例"{content}"需要关联已核验素材'
  },
  
  // 虚构产品功能（block级别）
  'EVI-003': {
    name: 'Unverified Product Claims',
    check: 'Product capability claims must match productCapability + real features',
    severity: 'error',
    examples: [
      '❌ "我们的AI能自动生成listing" 但产品无此功能',
      '✅ 只描述productCapability范围内的真实功能'
    ],
    autoFix: false,
    message: '产品功能描述"{content}"超出{productCapability}范围或不真实'
  },
  
  // 模糊表述检查（info级别）
  'EVI-004': {
    name: 'Vague Claims',
    check: 'Avoid vague terms without data: "显著提升", "大幅增长"',
    severity: 'info',
    message: '使用了模糊表述，建议量化或删除',
    autoFix: false
  }
};
```

#### 4.3.3 SEO检查（SEO Check）

```typescript
const seoChecks = {
  // Meta Title长度（warn级别）
  'SEO-001': {
    name: 'Meta Title Length',
    check: 'metaTitle.length in [50, 60]',
    severity: 'warning',
    message: `Meta Title长度${length}不在推荐范围（50-60字符）`,
    autoFix: true
  },
  
  // Meta Description长度（warn级别）
  'SEO-002': {
    name: 'Meta Description Length',
    check: 'metaDescription.length in [120, 160]',
    severity: 'warning',
    message: `Meta Description长度${length}不在推荐范围（120-160字符）`,
    autoFix: true
  },
  
  // 主关键词覆盖（warn级别）
  'SEO-003': {
    name: 'Primary Keyword Coverage',
    check: 'primaryKeyword appears in title, h1, first-100-words, conclusion',
    severity: 'warning',
    message: '主关键词未在关键位置出现',
    autoFix: false
  },
  
  // 关键词密度（info级别）
  'SEO-004': {
    name: 'Keyword Density',
    check: 'keywordDensity in [1%, 3%]',
    severity: 'info',
    message: `关键词密度${density}%，建议范围1-3%`,
    autoFix: false
  },
  
  // Slug格式（warn级别）
  'SEO-005': {
    name: 'Slug Format',
    check: 'slug is lowercase, hyphenated, no special chars',
    severity: 'warning',
    message: 'URL slug格式不符合SEO规范',
    autoFix: true
  },
  
  // FAQ完整性（info级别）
  'SEO-006': {
    name: 'FAQ Completeness',
    check: 'If questionKeywords provided, FAQ must answer them',
    severity: 'info',
    message: '输入了问题词但FAQ未完整回答',
    autoFix: false
  }
};
```

#### 4.3.4 链接检查（Links Check）

```typescript
const linksChecks = {
  // 内链目标不存在（block级别）
  'LNK-001': {
    name: 'Broken Internal Links',
    check: 'All internal link targets must exist in published pages',
    severity: 'error',
    message: '内链目标"{targetSlug}"不存在或未发布',
    autoFix: false
  },
  
  // 外链无效（warn级别）
  'LNK-002': {
    name: 'Invalid External Links',
    check: 'External links must be reachable (HTTP 200)',
    severity: 'warning',
    message: '外链"{url}"无法访问',
    autoFix: false
  },
  
  // 内链数量（info级别）
  'LNK-003': {
    name: 'Internal Link Count',
    check: 'internalLinkCount in [minRequired, maxAllowed]',
    severity: 'info',
    message: `内链数量${count}，建议${minRequired}-${maxAllowed}个`,
    autoFix: false
  },
  
  // 内链锚文本（info级别）
  'LNK-004': {
    name: 'Anchor Text Quality',
    check: 'Avoid generic anchor text: "点击这里", "阅读更多"',
    severity: 'info',
    message: '内链锚文本过于通用，建议使用描述性文本',
    autoFix: true
  }
};
```

#### 4.3.5 素材检查（Assets Check）

```typescript
const assetsChecks = {
  // 图片Alt缺失（warn级别）
  'AST-001': {
    name: 'Missing Image Alt',
    check: 'All images must have alt text',
    severity: 'warning',
    message: '图片缺少alt文本',
    autoFix: true  // 可基于上下文生成
  },
  
  // 图片数量（info级别）
  'AST-002': {
    name: 'Image Count',
    check: 'Recommend 1 image per 500 words for long articles',
    severity: 'info',
    message: `文章${wordCount}字，建议至少${Math.floor(wordCount/500)}张图`,
    autoFix: false
  },
  
  // 素材未使用（info级别）
  'AST-003': {
    name: 'Unused Materials',
    check: 'Warn if provided MaterialAsset not referenced',
    severity: 'info',
    message: '素材"{materialTitle}"未在文章中使用',
    autoFix: false
  },
  
  // Asset reference有效性（block级别）
  'AST-004': {
    name: 'Invalid Asset Reference',
    check: 'All asset references must point to valid Sanity assets',
    severity: 'error',
    message: '资产引用"{assetId}"无效',
    autoFix: false
  }
};
```

#### 4.3.6 合规检查（Compliance Check）

```typescript
const complianceChecks = {
  // CTA未使用预设（block级别）
  'CMP-001': {
    name: 'Unapproved CTA',
    check: 'CTA must use approved presets, not generated',
    severity: 'error',
    message: 'CTA"{ctaText}"不在已批准预设中',
    autoFix: false
  },
  
  // 虚假承诺（block级别）
  'CMP-002': {
    name: 'False Urgency Claims',
    check: 'No fabricated urgency: "限时", "仅剩N个", "今日特惠"',
    severity: 'error',
    message: 'CTA包含虚假紧迫性表述',
    autoFix: false
  },
  
  // 语气不符（warn级别）
  'CMP-003': {
    name: 'Tone Mismatch',
    check: 'Generated tone matches toneStyle preset',
    severity: 'warning',
    message: '内容语气与预设"{toneStyle}"不符',
    autoFix: false
  },
  
  // 品牌术语（info级别）
  'CMP-004': {
    name: 'Brand Term Usage',
    check: 'Product names use approved terms',
    severity: 'info',
    message: '产品名称使用不一致',
    autoFix: true
  }
};
```

#### 4.3.7 综合评分逻辑

```typescript
// 计算overallStatus的逻辑
function calculateOverallStatus(checks: Record<string, CheckResult>): Status {
  const weights = {
    structure: 0.15,
    evidence: 0.30,    // 依据检查最重要
    seo: 0.20,
    links: 0.15,
    assets: 0.10,
    compliance: 0.10
  };
  
  // 任何check有error → block
  const hasError = Object.values(checks).some(
    check => check.issues.some(issue => issue.severity === 'error')
  );
  if (hasError) return 'block';
  
  // 加权评分
  const weightedScore = Object.entries(checks).reduce((sum, [key, check]) => {
    return sum + check.score * weights[key];
  }, 0);
  
  // warn阈值
  if (weightedScore < 70) return 'warn';
  
  // 有warning但分数>70 → warn
  const hasWarning = Object.values(checks).some(
    check => check.issues.some(issue => issue.severity === 'warning')
  );
  if (hasWarning) return 'warn';
  
  return 'pass';
}
```

## 五、素材、事实与格式规则

1. `MaterialAsset` 不只保存图片：也保存已核验的数据、产品事实、案例和引用来源。
2. 图片正式使用 Sanity asset reference；外部 URL 只可作为待处理来源，不能成为发布文章的唯一图片依据。
3. AI 可以先生成 Markdown 作为中间稿，但写入 `ContentEntry` 前必须转换为 Portable Text；前台只消费 Portable Text。
4. 任何具体数据、客户成果、竞品结论或产品承诺必须能指回关联素材/来源；没有依据时应删去或改为不含事实承诺的通用表述。
5. 当前只生成简体中文内容；多语言是后续本地化工作，不是自动翻译后直接发布的输出项。

## 六、Phase 3.1 及之后的调整原则

### Phase 3.1：内容知识增强

在现有关键词库、素材库基础上增强以下内容：

- 内容类型的默认大纲、语气和字数策略；
- 已核验产品事实、图片、数据、引用和案例；
- 已发布文章/产品页的内链目录；
- 内容更新提示：哪些章节、数据或链接需要人工复核。

输出应具体为“可追溯的引用关系、有效内链建议、更新待办”，而不是笼统的“SEO 和内容质量增强”。

### Phase 3.2：按需拆分，不预设 Multi-Agent

只有出现可复现瓶颈时才考虑拆分研究、写作、质检或内容复用职责。例如：单一 Agent 经常无法同时保持事实准确和格式正确，或运营明确需要从已审核长文派生多渠道内容。没有这些证据时，保持单一 Agent。

### Phase 3.3：人工反馈与本地化

人工退回原因、编辑修改和实际内容表现用于迭代预设；当简中前台、审核和内容质量已稳定后，再为每种目标语言准备当地事实素材、术语和审核规则。禁止把中文文章直接批量翻译后当作已完成的多语言内容。

## 七、修改后的最小闭环

```text
运营选择：内容类型 + 受众 + 目标 + 主关键词 + 产品能力 + 字数档位
                 + 可选素材/依据/补充要求
                                  ↓
                         单一 Content Agent
                                  ↓
Portable Text 文章草稿 + SEO 包 + 图片包 + 内链/CTA 建议 + 审核报告
                                  ↓
                         Sanity draft
                                  ↓
                 人工修改、审核、批准、发布
```

本矩阵不新增自动发布、多 Agent 编排、队列/重试、爬虫/RAG、客户数据库或多语言批量生成。这些能力只在现有闭环出现明确瓶颈后再单独评估。
