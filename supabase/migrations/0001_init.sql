-- VibeFix — core schema
-- All application reads/writes go through the Next.js server (service-role key),
-- so RLS is enabled with no anon policies as defense-in-depth rather than as the
-- primary access-control layer.

create extension if not exists "pgcrypto";

create table if not exists problems (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique,
  title             text not null,
  description       text not null,
  country           text not null default '中国',
  country_flag      text not null default '🇨🇳',
  region            text not null default '中国'
                      check (region in ('中国', '亚洲', '全球', '非洲', '欧洲', '美洲')),
  category          text not null
                      check (category in (
                        '自由职业', '小生意', '效率工具', '创作者', '学习成长',
                        '本地生活', '社交连接', '个人财务', '宠物生活', '健身健康'
                      )),
  subcategory       text not null default '',
  status            text not null default '无人在做'
                      check (status in ('无人在做', '有人在做', '部分解决')),
  ai_potential       text not null default '中' check (ai_potential in ('高', '中', '低')),
  difficulty        text not null default '周末项目'
                      check (difficulty in ('周末项目', '1-3个月', '需要团队')),
  pain_score        int not null default 5 check (pain_score between 1 and 10),
  target_users      text not null default '',
  why_now           text not null default '',
  tech_hints        text[] not null default '{}',
  complaint_count   int not null default 0,
  growth_rate       numeric not null default 0,
  upvotes           int not null default 0,
  views             int not null default 0,
  submitted_by      text not null default '创始人精选'
                      check (submitted_by in ('创始人精选', '社区提交')),
  source            text,
  source_links      text[] not null default '{}',
  -- structured evidence / market / tech detail, extensible without migrations:
  -- { evidence: { keywords: string[], quotes: [{text, author, url}] },
  --   market: { market_size, competitors: string[], monetization: string[], willingness_to_pay },
  --   tech: { stack: string[], timeline, reusable_modules: string[] } }
  detail            jsonb not null default '{}'::jsonb,
  publish_status    text not null default 'draft'
                      check (publish_status in ('draft', 'published', 'archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists problems_publish_status_idx on problems (publish_status);
create index if not exists problems_category_idx on problems (category);
create index if not exists problems_upvotes_idx on problems (upvotes desc);
create index if not exists problems_created_at_idx on problems (created_at desc);

create table if not exists collections (
  id           uuid primary key default gen_random_uuid(),
  device_id    text not null,
  problem_id   uuid not null references problems (id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (device_id, problem_id)
);

create index if not exists collections_problem_id_idx on collections (problem_id);

create table if not exists submissions (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  category     text,
  region       text,
  source       text,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists problems_set_updated_at on problems;
create trigger problems_set_updated_at
  before update on problems
  for each row execute function set_updated_at();

alter table problems    enable row level security;
alter table collections enable row level security;
alter table submissions enable row level security;
-- No policies are defined: all access happens server-side via the
-- Supabase service-role key, which bypasses RLS by design.
