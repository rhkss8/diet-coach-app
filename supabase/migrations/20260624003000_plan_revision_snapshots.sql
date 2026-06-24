create table if not exists public.plan_revision_snapshots (
  user_id uuid not null references auth.users (id) on delete cascade,
  revision_id text not null,
  revision_snapshot jsonb not null,
  persisted_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, revision_id)
);

alter table public.plan_revision_snapshots enable row level security;

drop policy if exists "plan_revision_snapshots_own_rows" on public.plan_revision_snapshots;
create policy "plan_revision_snapshots_own_rows"
  on public.plan_revision_snapshots
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists plan_revision_snapshots_user_id_persisted_at_idx
  on public.plan_revision_snapshots (user_id, persisted_at desc);
