alter table public.planning_contexts
  drop constraint if exists planning_contexts_user_id_fkey;
alter table public.planning_contexts
  add constraint planning_contexts_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.chat_messages
  drop constraint if exists chat_messages_user_id_fkey;
alter table public.chat_messages
  add constraint chat_messages_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.attachments
  drop constraint if exists attachments_user_id_fkey;
alter table public.attachments
  add constraint attachments_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.approved_plan_snapshots
  drop constraint if exists approved_plan_snapshots_user_id_fkey;
alter table public.approved_plan_snapshots
  add constraint approved_plan_snapshots_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;
