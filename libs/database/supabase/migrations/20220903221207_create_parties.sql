create table "public"."parties" (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  join_code character varying unique,
  host_actor_id character varying,
  is_public boolean not null default true,
  last_activity_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

CREATE UNIQUE INDEX parties_pkey ON public.parties USING btree (id);

alter table "public"."parties" add constraint "parties_pkey" PRIMARY KEY using index "parties_pkey";
alter table "public"."parties" add constraint "parties_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;
alter table "public"."parties" validate constraint "parties_user_id_fkey";

alter table "public"."parties" enable row level security;

create policy "Enable read access for all users"
on "public"."parties"
as permissive
for select
to public
using ((is_public = true));

create policy "Enable insert for authenticated users only"
on "public"."parties"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));

-- Ensure users can only write to whitelisted fields
REVOKE INSERT ON parties FROM public, anon, authenticated;
GRANT INSERT (is_public) ON parties TO authenticated;


-- Enable real-time
alter publication supabase_realtime add table parties;