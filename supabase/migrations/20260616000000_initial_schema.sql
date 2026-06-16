create extension if not exists pgcrypto;

create type public.sex as enum ('female', 'male', 'other', 'prefer_not_to_say');
create type public.goal_status as enum ('draft', 'active', 'paused', 'completed', 'archived');
create type public.plan_status as enum ('draft', 'active', 'completed', 'archived');
create type public.plan_item_type as enum ('meal', 'exercise');
create type public.plan_item_slot as enum ('breakfast', 'lunch', 'dinner', 'snack', 'workout');
create type public.plan_item_status as enum ('pending', 'completed', 'skipped', 'adjusted');
create type public.plan_item_intensity as enum ('light', 'moderate', 'challenging');
create type public.adjustment_reason as enum (
  'meal_changed',
  'missed_exercise',
  'schedule_changed',
  'want_replan'
);
create type public.plan_revision_status as enum ('proposed', 'approved', 'dismissed');
create type public.daily_check_in_status as enum (
  'not_started',
  'in_progress',
  'completed',
  'adjusted'
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  birth_date date,
  age integer,
  sex public.sex not null,
  height_cm numeric(5, 2) not null,
  current_weight_kg numeric(5, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  start_date date not null,
  target_date date not null,
  target_weight_kg numeric(5, 2) not null,
  status public.goal_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  summary text not null,
  status public.plan_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  date date not null,
  type public.plan_item_type not null,
  slot public.plan_item_slot not null,
  title text not null,
  description text not null,
  intensity public.plan_item_intensity,
  status public.plan_item_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.adjustment_requests (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  affected_date date not null,
  reason public.adjustment_reason not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.plan_revisions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  request_id uuid references public.adjustment_requests (id) on delete set null,
  affected_date date not null,
  reason public.adjustment_reason not null,
  status public.plan_revision_status not null default 'proposed',
  summary text not null,
  user_message text not null,
  changed_item_ids uuid[] not null default '{}',
  updated_today_items jsonb not null default '[]'::jsonb,
  updated_future_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  dismissed_at timestamptz
);

create table public.daily_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete cascade,
  date date not null,
  status public.daily_check_in_status not null default 'not_started',
  completed_plan_item_ids uuid[] not null default '{}',
  skipped_plan_item_ids uuid[] not null default '{}',
  revision_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index goals_user_id_idx on public.goals (user_id);
create index plans_goal_id_idx on public.plans (goal_id);
create index plan_items_plan_id_date_idx on public.plan_items (plan_id, date);
create index adjustment_requests_plan_id_date_idx on public.adjustment_requests (plan_id, affected_date);
create index plan_revisions_plan_id_date_idx on public.plan_revisions (plan_id, affected_date);
create index daily_check_ins_user_id_date_idx on public.daily_check_ins (user_id, date);
create index analytics_events_user_id_name_idx on public.analytics_events (user_id, name);

alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.plans enable row level security;
alter table public.plan_items enable row level security;
alter table public.adjustment_requests enable row level security;
alter table public.plan_revisions enable row level security;
alter table public.daily_check_ins enable row level security;
alter table public.analytics_events enable row level security;
