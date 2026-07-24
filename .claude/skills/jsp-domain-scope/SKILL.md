---
name: jsp-domain-scope
description: 在任何旧站 JSP 页面改造/阅读工作开始前使用（不论是走正式 P1 inventory 流程，还是临时性的静态页面/SEO 抽取工作）。按功能/业务域精准定位要读的 JSP 文件，默认只读 JSP；只有在 JSP 内容本身无法回答问题时才允许读后端，且读后端必须精准定位到单个 Controller 路由方法或单个 entity/vo 字段声明，禁止读 Service/Dao 业务逻辑层。用于防止旧站代码检索范围过大、过散、冗余度过高从而污染上下文。
---

# JSP 业务域定位与阅读纪律

旧站 `../原网站代码asinseed/` 始终只读；本 skill 不产出 Next.js/Sanity/redirect 代码，只负责"进场前把要读的文件收窄到最小必要集合"。它是 `jsp-page-inventory`（正式 P1 产物流程）之外，任何涉及旧站代码阅读的工作（包括非正式的静态页面抽取、临时性 SEO 文案核对）都应先过一遍的前置纪律。

## 第一步：按业务域定位 JSP，而不是泛读目录

1. 先明确当前要处理的**业务域**（如：首页、反查 ASIN 搜索、文章/资讯、帮助中心、论坛、用户中心、登录、价格/订阅、浏览器插件、后台），不要以"页面"为最小单位跳过这一步——同一业务域往往对应 cn/en 两个 locale 的一对 JSP 加上各自的本地 include。
2. 用 Glob 精确定位该业务域在 `asinseed-front/src/main/webapp/jsp/{cn,en}/__frontend/` 下的主 JSP 文件路径，不要用开放式关键字全文检索或列出整个目录树。
3. 只有主 JSP 文件本身引用到的 `<jsp:include>` / `<%@ include %>` 才在阅读范围内；未被引用的 `base/*.jsp` 片段不读。

## 第二步：默认只读 JSP

- 主 JSP + 其递归 include 是唯一默认读取范围。
- 表单、AJAX 端点、SEO 标签、可见文案、服务端变量，都优先从 JSP 本身的证据中提取（`文件路径:行号`），不要为了"确认一下"而跳去读后端。
- 只有当 JSP 中出现的字段/路由/参数存在**无法从 JSP 自身证据解决的疑点**（例如：某路由的 HTTP method 无法从 JSP 判断、某展示字段的数据形状不确定）时，才进入第三步。

## 第三步：后端阅读分级许可（默认避免，必要时精准定位）

**允许读（且必须先精准定位到单个文件，不做全仓库检索）：**
- Controller 层的路由注解与方法签名（`@RequestMapping`/`@GetMapping`/`@PostMapping` 及其参数列表）——只读与当前业务域匹配的**单个** Controller 文件，用 Grep 按路由字符串或方法名定位，不要读整个 controller 目录。
- entity/vo 的字段声明——只读与当前页面展示字段对应的**单个**实体类，用于确认数据形状。

**禁止读（即使看起来"顺手"也不读）：**
- Service 实现层（`asinseed-service/.../service/**`）与业务逻辑代码——当前阶段不调用真实后端接口（用 mock-adapters），业务逻辑对静态页面/SEO 改造没有参考价值，读了只会增加冗余上下文。
- Dao/Mapper 实现或 SQL/XML 映射文件。
- 与当前业务域无关的 Controller（例如做首页时顺带翻后台 admin 的 Controller）。
- 本次会话内已经读过、已经在证据里记录过的文件——不要重复读取。
- 用 Explore agent 或 Grep 对整个 `asinseed-front`/`asinseed-service` 做无约束的全仓库关键字搜索；搜索必须先圈定到下方已核实的目录范围内。

## 已核实的业务域 → 目录映射（避免重新做全仓库 find）

以下路径均已核实存在（仅目录/文件名核实，未读取内容），后续会话直接按域名跳转，不必重新扫描：

| 业务域 | 前台 Controller（`asinseed-front/src/main/java/com/iyunya/asinseed/monitor/controller/`） | 备注 |
|---|---|---|
| 首页 | `frontend/FrontendController.java` | |
| 反查 ASIN / 搜索 | `frontend/SearchAsinController.java`、`frontend/AsinAnalysisController.java` | |
| 文章/资讯 | `frontend/ArticleController.java`（前台展示）；`admin/cms/ArticleController.java`（后台，通常 `exclude`） | |
| 帮助中心/FAQ | `frontend/HelpController.java` | |
| 论坛 | `frontend/BBSController.java`（前台）；`admin/cms/BBSController.java`（后台，通常 `exclude`） | |
| 登录 | `frontend/LoginController.java`；`extension/LoginController.java` | 两者不是同一个，插件登录单独一份，不要混用证据 |
| 用户中心/账号 | `user/MeController.java`、`user/MyCouponController.java`、`user/ProxyController.java`、`user/WeChatController.java` | 微信绑定二维码相关路由在 `WeChatController.java` |
| 价格/订阅 | `frontend/PriceController.java`、`payment/PaymentOrderController.java`、`payment/SubscriptionManagerController.java`、`payment/SubscriptionPlanController.java` | |
| 浏览器插件 | `extension/KeywordController.java`、`extension/LoginController.java`、`extension/UpgradingController.java` | |
| 后台管理 | `admin/*.java`（Dashboard/User/Coupon/GiftCard/Env/LookupLog/Package/PlanOrder/ReferralCode/Report） | P1 通常直接标 `exclude`，一般不需要读 |

支付网关回调（`asinseed-service/src/main/java/com/iyunya/asinseed/controller/base/`）：`AliPayController.java`、`AliPalReturnController.java`、`PayPalController.java`、`PayPalReturnController.java`、`StripeController.java`、`StripeReturnController.java`、`SubscriptionController.java`、`RootWapController.java`、`BaseController.java`、`BodyLogController.java`——这些几乎必然是 `exclude`（真实支付回调），**默认不读**，除非要证明某个前台页面确实直连了其中某个回调路由。

entity/vo 位置（`asinseed-dao/src/main/java/com/iyunya/asinseed/dao/`）：`entity/` 与 `vo/` 两个目录，按需读取与当前域名对应的单个文件，不做目录级全读。

## 与 `jsp-page-inventory` 的关系

本 skill 负责"进场前的范围收敛与阅读纪律"，产出的是一次性的域扫描范围（读了哪些 JSP、哪些 include、是否读了后端、读了哪个文件、为什么），不是正式 P1 产物，不替代 `jsp-page-inventory` 的 `inventory.md`。若后续要走完整 P1 流程，直接沿用本 skill 已精准定位读取的 Controller/entity 证据填入 `jsp-page-inventory` 的 Route/Scope 表，不必重新扩大检索范围重新搜一遍。

## 完成条件

只在下列条件都满足时才算完成一次域扫描：
- 已列出本次读取的 JSP 文件清单（主文件 + 实际被引用的 include）。
- 若读了后端文件，逐个说明：读了哪个文件、为什么 JSP 证据不够、对应的业务域。
- 未出现 Service/Dao 层文件、未出现无关业务域的 Controller、未出现全仓库级搜索。
