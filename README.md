# VibeFix

Problems Worth Building For

每天沉淀值得独立开发者动手的真实痛点：从社交平台抱怨中提炼出结构化的「灵感卡片」，标注痛点强度、技术难度和市场机会，帮助你找到值得全力以赴的方向。

## 技术栈

- Next.js 16 (App Router) + Tailwind CSS
- Supabase（PostgreSQL，通过服务端 service-role key 访问，不依赖客户端 RLS）
- Vercel 部署

## 本地开发

```bash
npm install
npm run dev
```

不配置任何 Supabase 环境变量也能跑起来——所有读取接口在检测不到 `SUPABASE_URL` 时会自动回退到 `lib/data.ts` 里的静态样例数据，方便本地开发和预览环境。

## 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 新建一个项目。
2. 打开 SQL Editor，依次执行：
   - `supabase/migrations/0001_init.sql`（建表：`problems` / `collections` / `submissions`）
   - `supabase/seed.sql`（可选，导入 10 条示例灵感，方便预览效果）
3. 在 Project Settings → API 中找到 `Project URL` 和 `service_role` key。

## 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

| 变量 | 说明 |
| --- | --- |
| `SUPABASE_URL` | Supabase 项目 URL。留空则使用静态样例数据。 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key（**仅服务端使用，不要加 `NEXT_PUBLIC_` 前缀，不要暴露到浏览器**）。 |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同一个 Supabase 项目的公开 URL 和 anon key，仅用于前台用户登录/注册（Supabase Auth）。anon key 可以安全暴露给浏览器——`problems` / `collections` / `submissions` 表没有配置任何 RLS 策略，anon key 对它们没有任何读写权限。留空则前台隐藏 Sign In 入口，匿名「感兴趣」记录仍正常工作。 |
| `ADMIN_PASSWORD` | 登录 `/admin` 管理后台所需的密码，请设置一个强密码。 |
| `INGEST_API_KEY` | 可选，供自动化管道调用批量导入接口用的密钥，见下方「自动化每日导入」。留空则关闭这个通道，只能从 `/admin/new` 手动导入。 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 可选，Google Search Console 验证串。 |

所有数据读写都通过 Next.js 服务端用 service-role key 访问 Supabase（route handlers / server components），因此不需要在浏览器暴露 service-role key。前台用户登录用的是 Supabase Auth 自带的 `auth.users` 体系，走 anon key，和业务表完全隔离。

### 用户登录

前台右上角「Sign In」用邮箱 + 密码登录/注册（Supabase Auth，无需额外建表）。登录后，「感兴趣/收藏」会绑定到账号而不是匿名设备 cookie，换设备登录同一账号也能看到之前收藏的内容。若 Supabase 项目开启了邮箱验证，注册后需要先点邮件里的确认链接才能登录。

## 管理后台

访问 `/admin`，用 `ADMIN_PASSWORD` 登录后可以：

- 查看全部灵感（含草稿/已发布/已下架状态和收藏数）
- 新增单条灵感（`/admin/new`）
- 批量导入：把审阅过的 Grok（或其他数据源）产出的 JSON 数组粘贴进导入框，一次性创建为草稿，再逐条发布
- 发布 / 下架 / 删除
- 审核社区提交（`/admin/submissions`）：查看用户通过「提交一个问题」表单提交的内容，通过后自动生成一条草稿（进入上面的灵感列表，还需手动发布），拒绝则仅标记状态

没有默认账号——必须显式设置 `ADMIN_PASSWORD` 才能登录，未设置时 `/admin` 会拒绝所有登录请求。

## 数据流转

1. 每天从 X（Twitter）/ Grok 等来源抓取真实用户抱怨（人工/脚本/Grok 自带的检索，当前阶段不含在本仓库内）。
2. AI 分析后整理为 `title / description / category / difficulty / target_users / why_now / detail(evidence/market/tech)` 等结构化字段（`ProblemInput`，见 `lib/problems.ts`）。
3. 导入为草稿，两种方式：
   - 手动：通过 `/admin/new` 的批量导入表单粘贴 JSON。
   - 自动：见下方「自动化每日导入」，让脚本直接把 Grok 产出的 JSON POST 过来。
4. 人工审阅后在 `/admin` 列表页点击「发布」，前台首页和详情页会立即读取到最新数据。

### 自动化每日导入

如果你已经有一个每天能产出结构化数据的管道（比如定时调用 Grok API 生成当天的痛点报告），可以跳过手动粘贴，直接调用批量导入接口：

```bash
curl -X POST https://your-domain.com/api/admin/import \
  -H "Authorization: Bearer $INGEST_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "……",
        "description": "……",
        "category": "效率工具",
        "difficulty": "周末项目",
        "source": "grok-daily-report"
      }
    ]
  }'
```

- `title` / `description` / `category`（需是 `lib/data.ts` 里 `ALL_CATEGORIES` 中的值）/ `difficulty`（`周末项目` / `1-3个月` / `需要团队`）为必填，其余字段（`targetUsers`、`whyNow`、`detail` 等）可选。
- 所有条目都以 `draft` 状态创建，不会自动发布到前台——还是要去 `/admin` 逐条确认后再发布，避免未经处理的内容直接上线。
- 触发方式随意：GitHub Actions 定时任务、Vercel Cron、n8n/Zapier，或你自己写的一个每天跑一次的脚本，只要最终发一个上面这样的 HTTP 请求就行。这个仓库本身不包含"调用 Grok 抓数据"这一步，因为具体用什么账号/API 由你决定。

## 部署到 Vercel

1. 将本仓库导入 Vercel（New Project → 选择该仓库）。
2. 在 Vercel 项目的 Environment Variables 中填入上面「环境变量」表格里的值。
3. 部署。Vercel 会自动识别 Next.js 项目并使用 `npm run build`。
4. 部署完成后，访问 `/admin` 用 `ADMIN_PASSWORD` 登录即可开始录入 / 发布灵感。

## 数据库结构

见 `supabase/migrations/0001_init.sql`：

- `problems`：灵感卡片主表，`publish_status` 控制草稿/发布/下架，`detail` 为 jsonb，存放 `evidence`（关键词/原帖引用）、`market`（市场规模/竞品/变现模式/付费意愿）、`tech`（技术栈/周期/可复用模块）。
- `collections`：匿名设备（cookie）对灵感的「感兴趣/收藏」记录，用于统计热度和收藏数。
- `submissions`：社区提交的问题，`status` 控制待审核/已通过/已拒绝，在 `/admin/submissions` 中人工审核。
