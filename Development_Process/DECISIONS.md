# 决策记录

追加式日志。绝不改写历史 —— 要修正或取代旧决策，就新增一条条目。

```md
## D-NNN: <标题> (<日期>, accepted)
- 背景：<1-3 行>
- 决策：<1 行>
- 被拒绝的备选方案：<1-2 行，含原因>
- 后果：<1-2 行>
```

---

## D-001: CLAUDE.md 保持一行指针；master-prompt §8 要求的 CLAUDE.md 内容改放进 AGENTS.md/WORKFLOW.md (2026-07-22, accepted)
- 背景：`../../prd-docs/prompts/00_migration_loop_master_prompt.txt` §8 要求把一份独立的、约 100-140 行的 `CLAUDE.md` 作为 Stage 0 的第一个交付物。本仓库遵循的 project-init 框架规定 `AGENTS.md` 是唯一的宪法文件，`CLAUDE.md` 精简为一行 `@AGENTS.md` 引用，以防止出现两份互相偏离的规则文件。
- 决策：`AGENTS.md` 是宪法文件；`CLAUDE.md` = `@AGENTS.md`。Stage 0 执行时，master-prompt §8 要求的内容（业务北极星、上下文管理、P1-P4 地图、编码约定、Handoff/CTA 最小实现、铁律、自检、HITL 摘要、范围、参考路径）并入 `AGENTS.md` + `Development_Process/WORKFLOW.md`，而不是另写一份完整文件。
- 被拒绝的备选方案：按 master-prompt §8 逐字生成 `CLAUDE.md` —— 被拒绝，会产生两份可能随时间漂移的规则文件。
- 后果：Stage 0 执行时必须把 master-prompt §8 "生成 CLAUDE.md" 这一步改写为"更新 AGENTS.md + Development_Process/WORKFLOW.md" —— Stage 0 启动时需明确标注这一改动，避免它成为对 master prompt 字面要求的一次静默偏离。

## D-002: 全部工程文档/记忆统一收进 `Development_Process/`；迁移产物迁出 master prompt 字面指定的路径 (2026-07-22, accepted)
- 背景：用户指示：`原网站代码asinseed/` 是只读参考（禁止编辑）；`prd-docs/SDD.md` 是主要实现依据，`prd-docs/PRD.md` 用于验收/对照；`new_asinseed/` 是工作区；其内部要有一个统一的 `Development_Process/` 文件夹，统管历史记录、功能/字段/用户流程/页面映射关系与项目工作记忆 —— 不再散落在一个裸的 `docs/` 里。master prompt（§2.2、§5.6）另行规定了字面产物路径 `migration/<page>/inventory.md`、`migration/report-<batch>.md`、`migration/STATE.md`。
- 决策：把原来的 `docs/{ARCHITECTURE,DECISIONS,STATE,WORKFLOW}.md` 移入 `Development_Process/`。新增 `Development_Process/HISTORY.md`（追加式会话日志，区别于可变的 `STATE.md`）、`Development_Process/mappings/{page,field,feature,user-flow}-map.md`（跨页汇总表，新旧对照）、`Development_Process/migration/{inventory,reports}/`（逐页/逐批次细节 —— master prompt 的 P1/P4 产物，迁到此处而非裸的根目录 `migration/`）。`Development_Process/specs/` 取代根目录级的 `specs/`，承载通用非迁移 spec 闸门流程。master prompt 的 `migration/STATE.md` 检查点被视为等同于本仓库的 `Development_Process/STATE.md` —— 不是第二份状态文件。
- 被拒绝的备选方案：保留 `docs/`，另外按 master prompt 字面路径新增根目录 `migration/` + `specs/` —— 被拒绝，会产生 3 个以上散落的顶层位置，而用户明确想要一个统一的家；且会产生两份可能互相矛盾的"当前状态"文件（`docs/STATE.md` 对 `migration/STATE.md`）。
- 后果：任何按 master prompt 字面文本读写 `migration/STATE.md`、`migration/<page>/inventory.md` 或 `migration/report-<batch>.md` 的 skill/脚本，都必须改指向 `Development_Process/STATE.md` / `Development_Process/migration/inventory/<page>/` / `Development_Process/migration/reports/` —— Stage 0 第一次搭建 `scripts/migration/` 或 `.claude/skills/migration-state-checkpoint` 时必须明确指出这一点，避免它成为一次静默偏离。

## D-003: Handoff 目标域名确定为 `sellersprite.ai` (2026-07-22, accepted)
- 背景：PRD §0.3 的 `TBD-SELLERSPRITE-HOST` 标出了一处冲突：线上 JSP 的 CTA（`sellersprite.com`，`search.jsp`）与 master prompt 假定的白名单（`sellersprite.ai`）不一致。按既定政策，PRD、SDD、`ARCHITECTURE.md` 均不能凭推断解决此问题 —— 需要一次明确的业务决策。
- 决策：用户确认目标域名为 `sellersprite.ai`。`sellersprite.com` 是旧站遗留域名，不带入新站 handoff-registry 白名单。
- 被拒绝的备选方案：先用占位域名+TODO，等待单独的书面签字确认 —— 被拒绝，用户本次会话中已直接给出决策，无需再拖延。
- 后果：`PRD.md` §0.2/§0.3/§11、`SDD.md` §5.4/§9.2/§17、`ARCHITECTURE.md`（数据流 + 未决问题）均已更新为直接写明 `sellersprite.ai`，不再有 TBD 占位语言。未来若要再变更此域名，仍需按 `AGENTS.md` § Boundaries 先问过用户。

## D-004: 内容自动化工作流从占位提升为主动建设，与迁移试点并行推进 (2026-07-22, accepted)
- 背景：PRD v0.2.0 明确把博客/文章自动化排除在本阶段之外（只有 schema 骨架 + 占位 skill，见 §0.2 第 5 点 / §2.3 非目标 4）。用户决定把它提前：现在就搭建真实的"生产 → 评审 → 定时发布"流水线，尽量利用 Sanity 自身能力，不必等迁移试点（轨A）先完成 —— 两条轨道（ADR-003）本就在时序/权限上相互独立，结构上没有任何东西阻止它们并行推进。
- 决策：Content Agent（轨B）现在是一个主动的工作项。流水线：关键词库（`KeywordEntry`）→ 素材库（`MaterialAsset`）→ Content Agent 写入 `ContentEntry`，`workflowState: draft` → 人工在 Studio 中把它推进 `in_review` → `approved` → 人工为已批准的文档设定 Sanity **Content Release** 定时 → Sanity 到点机械发布。E-E-A-T 字段（`author`/`sourceCitations`/`methodology`）保持可选，不对 agent 生成内容强制要求（用户明确要求 —— 先验证流水线，后续需要再收紧）。不引入第三方 workflow 插件（见 D-004 的配套 ADR-005，位于 `SDD.md` §16）—— 原生 Content Releases + 自定义 `workflowState` 字段已足够满足这条流水线的实际需求。
- 被拒绝的备选方案：(a) 等 Stage 0-1 试点通过后再启动轨B —— 被拒绝，两条轨道按设计本就独立（ADR-003），没有理由串行化。(b) 安装 `sanity-plugin-workflow` 等插件以获得更丰富的看板评审界面 —— 因团队规模和实际需求而被判定为过度设计（见 ADR-005），被拒绝。(c) 对 agent 生成内容强制要求 E-E-A-T 字段 —— 按用户明确指示被拒绝，只有日后出现质量问题才重新考虑。
- 后果：`PRD.md` §0.2/§2.3/§4.2/§6.3/§8/§9/§12 与 `SDD.md` §10/§11/§12/§15/§16 已相应改写（见 PRD/SDD v0.3.0）。`STATE.md` 的 现状/下一步 已更新以反映两条并行战线。任何实现都必须确保 agent 可写的 Sanity 角色不能把 `workflowState` 推进到 `approved`，也不能创建/修改 Content Release —— 这是一个可测试的 Gate（SDD §12），不是一条要靠信任遵守的约定。

## D-005: 在当前个人 agent-loop 探索阶段采用轻量/按需流程 (2026-07-23, accepted)
- 背景：在任何真实迁移工作发生之前，Stage 0 就已经在堆积团队规模的治理成本 —— 14 个预先写好的 `.claude/skills/*`（在任何模式实际重复出现之前）、几乎 1:1 重复 `STATE.md` 自身"近期变更记录"叙事的 `HISTORY.md`、为受审计团队流程设计的三闸门 spec/plan/tasks 仪式、以及一条尚未验证 Stage 0 的轨A 旁边完全并行运行的轨B。用户指出这对项目实际所处的阶段而言过重了：这是一个人在探索 agent-loop 工作流，不是一个团队在审计下执行高风险迁移。
- 决策：(a) 停止预先编写 skills —— 保留 `jsp-page-inventory`（已建成，Stage 1 第一步立刻需要），原计划的其余 13 个延后，只有当 Stage 1 实际手工重复出现某个模式时才按需现写。(b) 轨B（Content Agent）暂停 —— 其 schema（`contentEntry`/`keywordEntry`/`materialAsset`）作为有效的前期铺垫保留，但 workflowState actions、Content Releases 接线以及任何主动流水线工作，要等轨A 的 Stage 1 试点（`index.jsp` + `search.jsp`）通过验收后才开始。(c) `HISTORY.md` 退役，并入 `STATE.md` 的"近期变更记录"小节 —— 用一份文件同时承载可变的当前状态和追加式日志，而不是两份内容近乎重复的文件。(d) `WORKFLOW.md` §3 的通用 spec/plan/tasks 流程从三闸门仪式精简为一句话指引；只有当项目变成一个审计追溯比迭代速度更重要的多人项目时，才恢复完整的正式闸门（EARS 验收标准、逐任务覆盖检查）。(e) 放弃独立的 `migration/pilot-plan.md` 交付物 —— Stage 1 范围写在 `STATE.md` § 下一步 的几行字里，不再单独立一个文件。
- 被拒绝的备选方案：保留 Stage 0 原计划的全部治理面、只是执行得更快 —— 被拒绝，问题在于仪式本身（而非节奏）与阶段不匹配；更快地走完不必要的流程并不能修正"为尚不存在的问题预先建设"这件事。直接删掉轨B 已建好的 schema —— 被拒绝，它们是低成本、正确的前期铺垫；为了"简化"而删掉能用的代码只是流程表演，不是真正的简化。
- 后果：`AGENTS.md`、`WORKFLOW.md`、`ARCHITECTURE.md` 已更新，不再把那 13 个未建的 skills 或轨B 描述为"当前活跃"，也去掉了对 `HISTORY.md` 的引用。这是一条长期默认策略，不是一次性清理：一旦某项被延后的治理（某个具名 skill、轨B 的主动建设、正式 spec 闸门）的实际触发条件出现，就立刻重新引入它，而不是提前引入。

## D-006: 权限管控收敛为风险边界一句话规则 (2026-07-23, accepted)
- 背景：旧规则把生产发布、真实支付等高风险操作，与新增依赖、本地 schema 源码和可恢复删除等低风险操作并列为 Ask First，且在 `AGENTS.md`、主提示词和流程说明中重复列举，增加了单人探索期的 Agent 停顿和上下文负担。
- 决策：采用唯一规则：**本地可逆改动默认执行；涉及生产内容、真实用户/支付/旧后端、线上 URL/流量或不可恢复删除时必须先获人工批准。** 具体高风险范围只在 `AGENTS.md` § Boundaries 展开；主提示词只保留该句和试点未绿不得扩批。
- 被拒绝的备选方案：保留逐项 Ask First 清单 —— 被拒绝，低风险本地工作频繁被阻断，且同一规则多处复制容易漂移。
- 后果：新增依赖、本地 schema 源码、Mock、草稿工件、测试和可恢复的仓库内删除默认执行并在结果中汇报；生产 Sanity、真实业务系统、线上 SEO 流量与不可恢复外部删除继续保持 HITL。

## D-007: 热 STATE 与冷 archive 分离，降低会话记忆与权威漂移 (2026-07-27, accepted)
- 背景：D-005 将 `HISTORY.md` 并入 `STATE.md` 后，`STATE.md` 同时承担快照、长 backlog 和追加式日志，已超出会话热记忆用途；`AGENTS.md` 的阶段表述也因此未能及时和实际迁移进度同步。
- 决策：`STATE.md` 只保留现状、下一步、阻塞项、尝试与失败记录和最近五条（每条≤5行）变更记录；更早记录迁入 `Development_Process/archive/STATE-changelog-YYYY-MM.md`。Track B 长任务迁入 `backlog-track-b.md`，提案状态留在原报告的状态表。`AGENTS.md` 只写边界、分流和会话协议，不写长进度。
- 被拒绝的备选方案：恢复独立 `HISTORY.md` 并与 `STATE.md` 双写 —— 被拒绝，会重新制造 D-005 已消除的平行叙事；继续无限追加 STATE —— 被拒绝，会持续污染每次会话的必要上下文。
- 后果：会话开始只读热 `STATE.md`；任何会话结束时若将写入第六条记录，必须先归档。历史仍保留，但不再被当作当前事实阅读。

## D-008: P1 使用最小中断快照与信息架构反向复核，不新增运行时自动化 (2026-07-27, accepted)
- 背景：Claude Code 式对话会话可能中断；`STATE.md` 只能表达项目级状态，无法精确恢复一项已读部分 JSP/include/Controller 的 P1。另一方面，“照搬/调整”栏位若没有反向检查，容易退化成默认全选“照搬”。
- 决策：仅对跨会话或长时间的 P1，在对应 inventory 目录写 `.p1-progress.md`，记录已完成证据、剩余读取、`UNRESOLVED` 和精确下一步；P1 完成后标为 `completed`。若所有 Index Candidate 均为“照搬”，记录一个 `IA counterfactual`，说明评估过但未采用的替代结构。规则由既有 `jsp-page-inventory` skill 与主提示词承载。
- 被拒绝的备选方案：新增 Claude hooks 自动写 STATE —— 当前仓库没有现成 hooks 配置，且跨客户端/中断时的触发可靠性未验证；新增 Markdown→Zod 解析器 —— 需要维护脆弱的文档语法解析，当前只有一个 P1 skill，不足以抵消复杂度。
- 后果：不新增依赖、后台服务、常驻脚本或新 skill；`STATE.md` 仍是项目级唯一热状态，`.p1-progress.md` 仅是可删除/可复核的单页恢复指针。若连续多次出现 progress 漂移或 inventory 格式错误，再按 D-005 评估引入校验脚本。

## D-009: 真实后端接入以获批证据报告为门，不预建设假设性契约 (2026-07-28, accepted)
- 背景：现有 `ReverseAsinProvider`、Zod 与 Mock Adapter 已能支撑当前迁移；评估发现未来真实后端接入缺少可执行入口，但真实 URL、认证方式、错误格式尚无证据。提前新增端点/认证代码会把假设固化为事实。
- 决策：仅在人工批准 Mock → 真实 Legacy Adapter 切换后，复制 `Development_Process/specs/backend-integration-template.md` 为 `legacy-contract-report.md`。每项实现须有路由、字段、认证归属和成功/失败样例的证据；`UNRESOLVED` 不得进入 real-adapter。
- 被拒绝的备选方案：现在预建 `api-endpoints.ts`、`auth.ts`、`errors.ts` 或填入猜测的 URL/认证协议 —— 被拒绝，当前不具备真实接口事实源，且超出试点范围。
- 后果：主提示词与 `AGENTS.md` 明确对接门；当前只将 Track B 的 Portable Text/Zod 不一致列为恢复后的首项，不实施真实后端与生产化重试/降级设计。

## D-010: 页面 SEO 与可见运营文案采用字段职责单一、发布后双面验证 (2026-07-28, accepted)
- 背景：首页 `homepageSeo` 的 metadata 已接入，但 `heroHeading`/`heroSubheading` 一度只存在于 Studio 与 GROQ 投影，未被页面消费，造成“可配置却不生效”的误导。
- 决策：每个 Studio 页面字段在 P2 必须写清唯一来源、前台消费位置和空值 fallback；`seo{}` 仅控制 `<head>`，可见 Hero/正文使用显式内容字段。P4 分别验证 metadata 与可见覆盖字段，确认各自改变正确表面且不串扰。
- 被拒绝的备选方案：要求 `<title>` 与 H1 强制相同，或保留未消费字段等待以后接线 —— 前者混淆 SEO 与页面文案职责，后者会持续误导运营。
- 后果：首页已将 Hero 覆盖接入；主提示词 P2/P4 增加字段消费图与发布后双面验证规则，作为后续页面迁移范例。

## D-011: JSP 迁移是字段与业务证据驱动的重建，不是旧站视觉复刻 (2026-07-28, accepted)
- 背景：旧 JSP 代码在 discovery 中占据大量上下文，容易使 agent 将“读取旧页面”误解为“用新技术栈还原旧页面”，偏离新站通过 SEO/GEO、内容运营和文章规模化获取自然流量的目标。
- 决策：旧站仅用于提取路由、字段语义、数据来源、用户任务和业务边界证据；DOM、布局、可见文案、图片与视觉设计默认不迁移。新页面从新站 DTO/Schema 出发，按当前 SEO/GEO 信息架构、运营可编辑性与用户任务重写；例外须经用户明确批准并确认内容权利。
- 被拒绝的备选方案：以 Next.js/Sanity 对旧 JSP 做视觉等价重写 —— 被拒绝，会把新站降格为技术换壳，且继承旧站内容质量、信息架构和运营不可控问题。
- 后果：AGENTS、主提示词 P1/P3 明确“证据提取 vs 页面重建”边界；后续 inventory 只记录可验证字段与业务事实，P3 不得以旧截图/DOM 作为设计验收基准。

## D-012: Agent-Loop 按经验升级路由演进，内容 SEO/GEO schema 按消费批次落地 (2026-07-28, accepted)
- 背景：验收失败与用户纠正已能零散写入 STATE/DECISIONS，但缺少“何时进入测试、主提示词、Skill 或架构决策”的路由；元数据模型评估提出 Article JSON-LD、多语言、quick answer 等字段，但 Track B 尚未解锁，提前建字段会重演 D-010 的伪配置问题。
- 决策：采用最小经验升级路由：单页错误进源码+测试，字段消费问题进 P2/P4，跨两次复发才申请 Skill，架构取舍进 DECISIONS，其余留 STATE/P4。内容 SEO/GEO MVP 按 `backlog-track-b.md` 分流；仅在人工文章前台同批实现字段、渲染与验证，不预建未消费 schema。
- 被拒绝的备选方案：自动自修改 Prompt/Skill 的无人值守进化，或立即实现评估清单中全部字段 —— 前者会造成规则膨胀，后者会在暂停的 Track B 中制造无消费者配置。
- 后果：AGENTS 与主提示词增加统一路由；Track B backlog 成为内容 metadata 的唯一实施顺序，未来文章页以真实数据生成 JSON-LD/hreflang/quick answer，不提供任意 schema 类型编辑器。

## D-013: 页面按角色重构，先确认方案再进入 Schema/实现 (2026-07-28, accepted)
- 背景：D-011 已禁止旧 JSP 视觉复刻，但没有要求 agent 在编码前明确页面用途、重构信息架构和内容/CMS 边界，仍可能在实现过程中被旧站布局、旧文案和旧图片牵引。负责人进一步明确：新站应按当下 SaaS 官网的页面角色重构，先提交方案，不应直接动手。
- 决策：首次重构页面，或改变已确认页面的角色、信息架构或 CMS 模型时，P1 后必须写一份短 `rebuild-brief.md` 并获得人工明确确认，再开始 P2 schema/P3 实现。Brief 必须说明页面角色、用户/搜索意图、主 CTA、新信息架构、Sanity 内容模型、事实/创作内容边界、视觉/动效方向、SEO/GEO 与浏览器验收方式。旧站仅提供经验证的功能、数据字段、用户任务与事实；不作为布局/文案/图片默认来源。
- 被拒绝的备选方案：仅在主提示词中重复“不要 1:1 还原”——被拒绝，缺少可审阅的替代方案与停点；为每次小修复新建复杂 spec 审批链——被拒绝，会违背 D-005 的轻量、按需原则。
- 后果：新增一个可复用的 Brief 模板，并把确认门与 Chrome 实页审查写入 AGENTS、Migration Loop 与 P4。博客/资源页继续是规模化长尾收录主战场；首页/产品/功能页仍须承接核心商业词、产品实体和转化，不能借此放弃基础 SEO/GEO。

## D-014: 先做页面组合规划，再排期逐页重构 (2026-07-28, accepted)
- 背景：单页 P1 与 D-013 Brief 能避免旧 JSP 视觉复刻，但无法回答“旧站全部页面中哪些应合并、淘汰、作为内容资产或优先重构”。按旧 JSP 文件顺序推进会让迁移排期继承遗留信息架构，而不是服务新站的品牌、转化、工具与内容增长目标。
- 决策：每轮开始新的 JSP 页面批次前，先对公开页面做只读轻扫描，并在 `mappings/page-map.md` 按业务域、功能域、一个主页面角色、候选处置（`rebuild`/`merge`/`replace`/`exclude`/`UNRESOLVED`）和建议批次汇总。该扫描只使用路径、标题、局部入口与已知证据；不递归全量 include/Controller，不替代 P1。人工确认目标页面组合和首批排期后，再对单页执行 P1→Brief→P2→P4。
- 被拒绝的备选方案：先对每个 JSP 做完整 P1——被拒绝，成本高且仍以旧页面为中心；只凭文件名自动生成新路由/收录计划——被拒绝，路由、权限与内容价值均可能未知。
- 后果：`page-map.md` 成为组合层唯一事实来源；一个新页面可以合并多个旧 JSP，一个旧 JSP 也可以被排除或由新内容页替代。博客/资源页作为长尾与 AI 可引用性增长主线，但其具体实现仍受 Track B 解锁与内容事实证据约束。

## D-015: URL 一一对应与简中优先的多语言底座 (2026-07-28, accepted)
- 背景：负责人要求旧/新站同语义 URL 尽量一一对应，以减少未来无必要的 301；同时要求先把多语言底座打开，但先只开发、验收简体中文，让业务能集中判断页面效果后再逐语言本地化。此前试点错误地将旧 `/cn` 改为 `/zh-cn`，并同时暴露未验收的 `/en` 与 hreflang，已经造成 `/cn` 运行时崩溃和错误的索引信号。
- 决策：在 `packages/contracts/src/locales.ts` 建立共享语言注册表。当前唯一 active route 是 `cn`，并映射 Sanity `zh-cn`；繁中、英、法、德、意、西、日、越南、马来仅为 planned。根路径、导航、Studio 下拉、静态路由、sitemap、canonical 与 Open Graph 只消费 active 项；单语言阶段不输出 hreflang 或 x-default。旧/新同语义路径默认原样保留，例外 301 只可在获批后精确记录。
- 被拒绝的备选方案：(a) 继续并行开放 `/en` 和 `/zh-cn`——被拒绝，会分散简中验收并发送未完成页面的索引信号；(b) 只做中文页面、未来再硬编码多语言——被拒绝，会将路由、Studio 和 SEO 变更散落到多处；(c) 将所有语言即时打开但使用中文 fallback——被拒绝，属于伪本地化并伤害搜索与信任。
- 后果：未来新增语言以集中配置为入口，但必须同时具备已验收本地化内容和 P4 证据；尚未迁移的功能页不再提供指向 404 的首页内部链接，而是明确标注重构状态。P4 需增加直接旧 URL、inactive route、sitemap 与 hreflang 的回归测试。

## D-016: 已明确方向的页面重构默认连续实施 (2026-07-28, accepted)
- 背景：D-013 的 Brief 原意是防止旧 JSP 视觉复刻，但被执行成每个首页 Schema、Sanity 内容和页面区块都必须等待再次批准，违背 D-005/D-006 的轻量与“本地可逆改动默认执行”原则。用户已明确授权：凡围绕负责人既定的新 SaaS 重构、引流获客转化、SEO/GEO 和运营可维护目标的改造，应主动完成。
- 决策：Brief 保留为可审阅的设计记录，不再是默认停工门。在已有明确业务北极星、负责人方向或用户授权时，agent 应连续完成 P2/P3（本地 Schema、Sanity 草稿/seed 与页面实现）；只有用户明确要求先看方案、主角色/CTA/URL 出现不可消解的业务冲突，或触及生产发布、真实后端、线上 URL/流量、自动发布等既有高风险边界时，才升级等待人工决定。
- 被拒绝的备选方案：(a) 继续把 D-013 当作逐项实施审批——被拒绝，会让已获授权的正常页面重构停滞；(b) 完全删除 Brief——被拒绝，会失去页面角色、CMS 消费边界与验收计划的可复核依据。
- 后果：未证实的产品/客户/数据事实必须省略或改为无事实承诺的原创表述，但不阻断页面结构、转化路径、运营字段与本地实现；AGENTS、主提示词、Brief 与 STATE 同步采用此默认。

## D-017: 以 #FF9200 作为唯一主品牌色，并由 token 控制视觉层级 (2026-07-29, accepted)
- 背景：新站此前误以深青绿为主色、琥珀为点缀，遗漏了已确认的 ASINSeed 品牌色 `#FF9200`。只替换几个按钮会留下旧主色，整页铺橙又会降低 B2B 页面可读性与文字对比度。
- 决策：`#FF9200` 是唯一主品牌色，必须在集中 token 中用于主 CTA、品牌强调和 focus ring；深色中性色承担正文、深色 Hero 和小字号信息。页面应按角色分配色彩层级，不得把旧青绿、蓝紫或临时颜色作为并列主色。
- 被拒绝的备选方案：局部按钮换橙 —— 无法形成品牌一致性；全页面高饱和橙色 —— 会损害层级、可读性和转化信任。
- 后果：P3 使用 token、P4 以计算后的主色/桌面与移动视觉检查验证；后续页面不得复制旧页面配色。

## D-018: GEO 采用 SEO 与原创内容优先的资格模型，不设 AI 特殊文件硬门槛 (2026-07-29, accepted)
- 背景：原 GEO 打分标准将 `llms.txt` 与逐个 AI crawler 规则设为 FAIL，且以固定 meta 长度、单一外链 CTA 等伪精确规则衡量页面。这会把 agent 引向形式化信号，而非被索引、被理解和被引用的真实条件。
- 决策：依据 [Google 官方 AI 搜索优化指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)，GEO 作为核心 SEO 的延伸：优先公开可抓取、可索引的技术结构，独特可靠且以人为本的内容，清晰标题与直接回答，真实实体关系和良好页面体验。`llms.txt`、AI 专用标记、刻意分块、虚假提及和关键词变体堆页不构成 Google AI 搜索通过条件；可作为其他服务的可选兼容项，不得阻塞 P4/Track B。
- 被拒绝的备选方案：以 AI 特殊文件/Schema 数量作为推荐保证 —— Google 明确不以此作为生成式搜索资格；以首页承担全部长尾内容 —— 会模糊品牌/转化页角色，长尾深度应由后续资源/博客页承接。
- 后果：更新 SEO/GEO 评分标准、元数据约束和主提示词；首页继续承担品牌实体、核心意图解释与下一步转化，补足分享图、实体关联和直接回答；后续文章必须以独特经验、方法、来源与真实用户问题竞争，而非规模化同质内容。

## D-019: 页面体验以可解释交互替代静态海报式区块堆叠 (2026-07-29, accepted)
- 背景：首页经多轮颜色与卡片调整后，仍呈现为“Hero + 平铺卡片 + FAQ + CTA”的静态模板组合，不能表达工具型 SaaS 的产品感；用户明确要求避免将新页面做成静态 PPT/海报。
- 决策：新 SaaS 落地页、转化页和功能页必须围绕一个可验证用户任务或数据契约，提供至少一个可操作、可解释的产品体验（真实入口、研究路径、筛选或状态反馈均可）。SSR 语义内容、FAQ 与 SEO/GEO 结构仍保留；交互不得伪造未接入的查询结果、数据量、客户背书或产品状态，并须支持 reduced motion。
- 被拒绝的备选方案：继续通过更换配色、圆角、阴影或增加同质卡片改善页面——被拒绝，无法改变页面的静态信息结构；为追求动态感伪造实时 dashboard 或结果表——被拒绝，会违反事实边界并伤害信任。
- 后果：P3 的视觉验收增加“用户可操作的体验是否帮助理解任务”检查；P4 同时验证无 JavaScript 时的可抓取语义内容与启用 JavaScript 后的交互状态。若后续真实工具接入，预览画布须替换为真实任务入口，而不是并列保留两套虚假/重复界面。

## D-020: 禁用渐变与玻璃拟态，以真实任务状态建立工具型体验 (2026-07-29, accepted)
- 背景：首页连续几轮改版主要靠配色、渐变、模糊背景和“研究工作台”示意增强视觉，仍没有让用户真正开始查询；用户明确要求不使用渐变/模糊玻璃效果，并避免把页面做成静态 PPT。
- 决策：默认禁止 CSS/SVG `linear-gradient`、`radial-gradient`、blur、backdrop-filter 和玻璃拟态。新页面用品牌纯色、边框、留白、排版、SVG 实线、原生 HTML 状态元素以及真实任务交互构建层级；只有用户为特定页面明确批准时才可例外。每个工具/转化页优先实现一个可解释的用户动作与反馈，不能用伪数据 dashboard 代替。
- 被拒绝的备选方案：继续用渐变、毛玻璃和发光背景快速制造“现代感”——被拒绝，会掩盖信息架构和产品能力缺口；完全禁用动效——被拒绝，输入、加载、结果和可达性反馈仍需要克制的状态变化。
- 后果：AGENTS、迁移主提示词和 Brief 模板均加入同一约束；P4 视觉审查必须检查页面源码和实页是否有未经批准的 gradient/blur/glass 效果，并确认动效与真实任务状态相关。

## D-021: 用项目专属设计 Skill 收敛页面重构方法 (2026-07-29, accepted)
- 背景：外部设计 Skill 能提供字体、层级、交互、可访问性和设计审计方法，但直接整包采用会与 ASINSeed 的中文优先、工具优先、Sanity 字段职责、SEO/GEO 和禁渐变/玻璃拟态约束冲突。当前多轮页面改造仍暴露“静态海报/模板卡片”倾向，已具备跨任务固化价值。
- 决策：在 `.claude/skills/asinseed-saas-design/` 建立唯一项目级页面设计 Skill；它吸收“先定义页面角色和用户任务、再选择单一视觉方向、构建可操作体验、最后批评审计”的方法，但不复制外部模板或依赖。涉及页面设计/重构/UI 审查的任务默认读取该 Skill，`AGENTS.md` 与当轮用户要求始终优先。
- 被拒绝的备选方案：(a) 直接安装完整外部 Skill 集合——被拒绝，规则过多且不适配项目边界；(b) 只更换 UI 组件库——被拒绝，组件库不能解决页面角色、任务体验和原创视觉语言问题；(c) 继续靠一次次口头提醒——被拒绝，无法稳定避免同类模板化页面。
- 后果：页面任务新增“用户任务—视觉方向—真实状态—设计审计”的可复核路径；外部参考站仅用于抽取原则，旧 JSP 和公开网站均不得成为视觉/素材复刻来源。Skill 本身不引入 npm 依赖、生产配置或自动发布行为。


## D-022: 以 Taste 的设计读数与反模板审计增强项目设计 Skill (2026-07-30, accepted)
- 背景：D-021 的项目 Skill 已阻止旧站视觉复刻与通用模板，但首页与搜索工具页仍被用户评为“低、静态海报/PPT 感”，说明“页面角色—任务—视觉方向”的抽象规则还不足以持续推动彻底重构。经核验的 Taste 方法提供了可移植的 Design Read、三旋钮、Anti-Slop 审计和已有页面重设计流程；其完整默认实现却包含与本项目边界不相容的玻璃拟态、渐变、泛化营销构图和高强度动效倾向。
- 决策：在唯一的 `.claude/skills/asinseed-saas-design/` 中吸收四个方法：(a) 先写页面角色、受众、信任/能量/密度的 Design Read；(b) 显式设定 DESIGN_VARIANCE、MOTION_INTENSITY、VISUAL_DENSITY 三个旋钮；(c) 实施前后各做一次 Anti-Slop 审计，FAIL 必须结构性修正；(d) 已有页面按 Scan→Diagnose→Remap→Build→Verify 重做。工具优先、中文优先、Sanity 字段职责、SEO/GEO、真实状态、#FF9200 和禁渐变/blur/glass 继续优先于这些方法。
- 被拒绝的备选方案：(a) 原样安装/执行 Taste 的全部 Skill——被拒绝，会引入与项目边界冲突的默认视觉和技术偏好；(b) 只换组件库——被拒绝，无法改变错误的任务序列与信息架构；(c) 继续局部美化当前页——被拒绝，不能解决“静态海报”根因。
- 后果：页面重构交付必须说明 Design Read 和三旋钮；P4 视觉验收增加反模板与重构深度检查。首页和搜索工具页允许替换现有构图，但不得破坏已批准 URL、Sanity、SEO、输入查询和 Mock 边界。