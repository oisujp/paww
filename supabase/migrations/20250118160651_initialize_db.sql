drop policy "Enable users to access their own data only" on "public"."passTemplates";

drop policy "Enable users to access their own data only" on "public"."users";

alter table "public"."passes" drop column "publishdAt";

alter table "public"."passes" add column "addedAt" timestamp without time zone;

alter table "public"."passes" add column "publicUrl" text not null;

alter table "public"."passes" add column "publishedAt" timestamp without time zone default now();

alter table "public"."passes" alter column "id" set default gen_random_uuid();

alter table "public"."passes" alter column "id" drop identity;

alter table "public"."passes" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."users" alter column "id" set default auth.uid();

create policy "Policy with security definer functions"
on "public"."passes"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to access their own data only"
on "public"."passTemplates"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to access their own data only"
on "public"."users"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));




