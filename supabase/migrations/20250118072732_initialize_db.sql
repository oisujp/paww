alter table "public"."passTemplates" add column "templateName" text not null;

alter table "public"."passTemplates" enable row level security;

alter table "public"."userProfiles" enable row level security;

create policy "Enable users to access their own data only"
on "public"."passTemplates"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to access their own data only"
on "public"."userProfiles"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = "userId"));




