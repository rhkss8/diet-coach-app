create table if not exists public.approved_plan_snapshots (
  user_id uuid primary key references public.users (id) on delete cascade,
  plan_snapshot jsonb not null,
  approved_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.approved_plan_snapshots enable row level security;

drop policy if exists "approved_plan_snapshots_own_rows" on public.approved_plan_snapshots;
create policy "approved_plan_snapshots_own_rows"
  on public.approved_plan_snapshots
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
