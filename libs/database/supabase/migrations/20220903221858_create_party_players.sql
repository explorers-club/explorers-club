create table "public"."party_players" (
    "party_id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    "connected" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."party_players" enable row level security;

CREATE UNIQUE INDEX party_players_pkey ON public.party_players USING btree (party_id, user_id);

alter table "public"."party_players" add constraint "party_players_pkey" PRIMARY KEY using index "party_players_pkey";
alter table "public"."party_players" add constraint "party_players_party_id_fkey" FOREIGN KEY (party_id) REFERENCES parties(id) not valid;
alter table "public"."party_players" validate constraint "party_players_party_id_fkey";
alter table "public"."party_players" add constraint "party_players_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;
alter table "public"."party_players" validate constraint "party_players_user_id_fkey";

create policy "Enable read access for all users on public parties"
on "public"."party_players"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM parties
  WHERE party_players.party_id = parties.id AND parties.is_public = true)));