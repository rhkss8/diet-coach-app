alter table public.plan_items
  add column if not exists calories_kcal numeric(8, 2),
  add column if not exists protein_g numeric(8, 2),
  add column if not exists carbs_g numeric(8, 2),
  add column if not exists fat_g numeric(8, 2),
  add column if not exists nutrition_source text,
  add column if not exists nutrition_confidence text;

create table if not exists public.plan_item_foods (
  id uuid primary key default gen_random_uuid(),
  plan_item_id uuid not null references public.plan_items (id) on delete cascade,
  name text not null,
  amount text not null,
  calories_kcal numeric(8, 2),
  protein_g numeric(8, 2),
  carbs_g numeric(8, 2),
  fat_g numeric(8, 2),
  created_at timestamptz not null default now()
);

create table if not exists public.planning_contexts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  management_intent jsonb not null default '{}'::jsonb,
  food_context jsonb not null default '{}'::jsonb,
  routine_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  plan_id uuid references public.plans (id) on delete set null,
  role text not null check (role in ('assistant', 'user')),
  content text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  chat_message_id uuid references public.chat_messages (id) on delete set null,
  storage_path text not null,
  name text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create index if not exists plan_item_foods_plan_item_id_idx
  on public.plan_item_foods (plan_item_id);
create index if not exists planning_contexts_user_id_idx
  on public.planning_contexts (user_id);
create index if not exists chat_messages_user_id_created_at_idx
  on public.chat_messages (user_id, created_at);
create index if not exists attachments_user_id_created_at_idx
  on public.attachments (user_id, created_at);

alter table public.plan_item_foods enable row level security;
alter table public.planning_contexts enable row level security;
alter table public.chat_messages enable row level security;
alter table public.attachments enable row level security;

drop policy if exists "users_own_rows" on public.users;
create policy "users_own_rows"
  on public.users
  for all
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "goals_own_rows" on public.goals;
create policy "goals_own_rows"
  on public.goals
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "plans_own_rows" on public.plans;
create policy "plans_own_rows"
  on public.plans
  for all
  using (
    exists (
      select 1
      from public.goals
      where goals.id = plans.goal_id
        and goals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.goals
      where goals.id = plans.goal_id
        and goals.user_id = auth.uid()
    )
  );

drop policy if exists "plan_items_own_rows" on public.plan_items;
create policy "plan_items_own_rows"
  on public.plan_items
  for all
  using (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = plan_items.plan_id
        and goals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = plan_items.plan_id
        and goals.user_id = auth.uid()
    )
  );

drop policy if exists "plan_item_foods_own_rows" on public.plan_item_foods;
create policy "plan_item_foods_own_rows"
  on public.plan_item_foods
  for all
  using (
    exists (
      select 1
      from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      join public.goals on goals.id = plans.goal_id
      where plan_items.id = plan_item_foods.plan_item_id
        and goals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      join public.goals on goals.id = plans.goal_id
      where plan_items.id = plan_item_foods.plan_item_id
        and goals.user_id = auth.uid()
    )
  );

drop policy if exists "adjustment_requests_own_rows" on public.adjustment_requests;
create policy "adjustment_requests_own_rows"
  on public.adjustment_requests
  for all
  using (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = adjustment_requests.plan_id
        and goals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = adjustment_requests.plan_id
        and goals.user_id = auth.uid()
    )
  );

drop policy if exists "plan_revisions_own_rows" on public.plan_revisions;
create policy "plan_revisions_own_rows"
  on public.plan_revisions
  for all
  using (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = plan_revisions.plan_id
        and goals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.plans
      join public.goals on goals.id = plans.goal_id
      where plans.id = plan_revisions.plan_id
        and goals.user_id = auth.uid()
    )
  );

drop policy if exists "daily_check_ins_own_rows" on public.daily_check_ins;
create policy "daily_check_ins_own_rows"
  on public.daily_check_ins
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "planning_contexts_own_rows" on public.planning_contexts;
create policy "planning_contexts_own_rows"
  on public.planning_contexts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "chat_messages_own_rows" on public.chat_messages;
create policy "chat_messages_own_rows"
  on public.chat_messages
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "attachments_own_rows" on public.attachments;
create policy "attachments_own_rows"
  on public.attachments
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "analytics_events_insert_own_rows" on public.analytics_events;
create policy "analytics_events_insert_own_rows"
  on public.analytics_events
  for insert
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "analytics_events_select_own_rows" on public.analytics_events;
create policy "analytics_events_select_own_rows"
  on public.analytics_events
  for select
  using (user_id = auth.uid());
