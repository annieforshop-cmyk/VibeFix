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
| `ADMIN_PASSWORD` | 登录 `/admin` 管理后台所需的密码，请设置一个强密码。 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 可选，Google Search Console 验证串。 |

所有数据读写都通过 Next.js 服务端用 service-role key 访问 Supabase（route handlers / server components），因此不需要在浏览器暴露任何 Supabase key。

## 管理后台

访问 `/admin`，用 `ADMIN_PASSWORD` 登录后可以：

- 查看全部灵感（含草稿/已发布/已下架状态和收藏数）
- 新增单条灵感（`/admin/new`）
- 批量导入：把审阅过的 Grok（或其他数据源）产出的 JSON 数组粘贴进导入框，一次性创建为草稿，再逐条发布
- 发布 / 下架 / 删除
- 审核社区提交（`/admin/submissions`）：查看用户通过「提交一个问题」表单提交的内容，通过后自动生成一条草稿（进入上面的灵感列表，还需手动发布），拒绝则仅标记状态

没有默认账号——必须显式设置 `ADMIN_PASSWORD` 才能登录，未设置时 `/admin` 会拒绝所有登录请求。

## 数据流转

1. 每天从 X（Twitter）抓取真实用户抱怨（人工/脚本，当前阶段不含在本仓库内）。
2. AI 分析后整理为 `title / description / target_users / why_now / detail(evidence/market/tech)` 等结构化字段。
3. 通过 `/admin/new` 的批量导入表单粘贴 JSON，创建为草稿。
4. 人工审阅后在 `/admin` 列表页点击「发布」，前台首页和详情页会立即读取到最新数据。

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
