drop policy "can access auth user only" on "public"."user_profiles";

revoke delete on table "public"."pass_templates" from "anon";

revoke insert on table "public"."pass_templates" from "anon";

revoke references on table "public"."pass_templates" from "anon";

revoke select on table "public"."pass_templates" from "anon";

revoke trigger on table "public"."pass_templates" from "anon";

revoke truncate on table "public"."pass_templates" from "anon";

revoke update on table "public"."pass_templates" from "anon";

revoke delete on table "public"."pass_templates" from "authenticated";

revoke insert on table "public"."pass_templates" from "authenticated";

revoke references on table "public"."pass_templates" from "authenticated";

revoke select on table "public"."pass_templates" from "authenticated";

revoke trigger on table "public"."pass_templates" from "authenticated";

revoke truncate on table "public"."pass_templates" from "authenticated";

revoke update on table "public"."pass_templates" from "authenticated";

revoke delete on table "public"."pass_templates" from "service_role";

revoke insert on table "public"."pass_templates" from "service_role";

revoke references on table "public"."pass_templates" from "service_role";

revoke select on table "public"."pass_templates" from "service_role";

revoke trigger on table "public"."pass_templates" from "service_role";

revoke truncate on table "public"."pass_templates" from "service_role";

revoke update on table "public"."pass_templates" from "service_role";

revoke delete on table "public"."user_profiles" from "anon";

revoke insert on table "public"."user_profiles" from "anon";

revoke references on table "public"."user_profiles" from "anon";

revoke select on table "public"."user_profiles" from "anon";

revoke trigger on table "public"."user_profiles" from "anon";

revoke truncate on table "public"."user_profiles" from "anon";

revoke update on table "public"."user_profiles" from "anon";

revoke delete on table "public"."user_profiles" from "authenticated";

revoke insert on table "public"."user_profiles" from "authenticated";

revoke references on table "public"."user_profiles" from "authenticated";

revoke select on table "public"."user_profiles" from "authenticated";

revoke trigger on table "public"."user_profiles" from "authenticated";

revoke truncate on table "public"."user_profiles" from "authenticated";

revoke update on table "public"."user_profiles" from "authenticated";

revoke delete on table "public"."user_profiles" from "service_role";

revoke insert on table "public"."user_profiles" from "service_role";

revoke references on table "public"."user_profiles" from "service_role";

revoke select on table "public"."user_profiles" from "service_role";

revoke trigger on table "public"."user_profiles" from "service_role";

revoke truncate on table "public"."user_profiles" from "service_role";

revoke update on table "public"."user_profiles" from "service_role";

alter table "public"."pass_templates" drop constraint "check_coupon";

alter table "public"."user_profiles" drop constraint "user_profiles_user_id_key";

alter table "public"."pass_templates" drop constraint "pass_templates_pkey";

alter table "public"."user_profiles" drop constraint "user_profile_pkey";

drop index if exists "public"."pass_templates_pkey";

drop index if exists "public"."user_profile_pkey";

drop index if exists "public"."user_profiles_user_id_key";

drop table "public"."pass_templates";

drop table "public"."user_profiles";

create table "public"."passTemplates" (
    "id" uuid not null default gen_random_uuid(),
    "backgroundColor" text not null,
    "description" text not null,
    "expirationDate" timestamp without time zone,
    "foregroundColor" text not null,
    "formatVersion" numeric,
    "labelColor" text not null,
    "logoText" text,
    "organizationName" text not null,
    "passTypeIdentifier" text not null,
    "serialNumber" text not null,
    "teamIdentifier" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp without time zone default (now() AT TIME ZONE 'utc'::text),
    "logoBase64" text,
    "iconBase64" text,
    "stripBase64" text,
    "coupon" jsonb not null,
    "userId" uuid not null
);


create table "public"."userProfiles" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "userId" uuid not null default gen_random_uuid(),
    "iconBase64" text,
    "logoBase64" text,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp without time zone default (now() AT TIME ZONE 'utc'::text)
);


CREATE UNIQUE INDEX "passTemplatesPkey" ON public."passTemplates" USING btree (id);

CREATE UNIQUE INDEX "userProfilePkey" ON public."userProfiles" USING btree (id);

CREATE UNIQUE INDEX "userProfilesUserIdKey" ON public."userProfiles" USING btree ("userId");

alter table "public"."passTemplates" add constraint "passTemplatesPkey" PRIMARY KEY using index "passTemplatesPkey";

alter table "public"."userProfiles" add constraint "userProfilePkey" PRIMARY KEY using index "userProfilePkey";

alter table "public"."passTemplates" add constraint "checkcoupon" CHECK (jsonb_matches_schema('{
        "type": "object",
        "properties": {
            "primaryFields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "key": {
                          "type": "string"
                        },
                        "value": {
                          "type": "string"
                        }
                    },
                    "required": ["key", "value"]
                }
            }
        },
        "required": ["primaryFields"]
    }'::json, coupon)) not valid;

alter table "public"."passTemplates" validate constraint "checkcoupon";

alter table "public"."userProfiles" add constraint "userProfilesUserIdKey" UNIQUE using index "userProfilesUserIdKey";

grant delete on table "public"."passTemplates" to "anon";

grant insert on table "public"."passTemplates" to "anon";

grant references on table "public"."passTemplates" to "anon";

grant select on table "public"."passTemplates" to "anon";

grant trigger on table "public"."passTemplates" to "anon";

grant truncate on table "public"."passTemplates" to "anon";

grant update on table "public"."passTemplates" to "anon";

grant delete on table "public"."passTemplates" to "authenticated";

grant insert on table "public"."passTemplates" to "authenticated";

grant references on table "public"."passTemplates" to "authenticated";

grant select on table "public"."passTemplates" to "authenticated";

grant trigger on table "public"."passTemplates" to "authenticated";

grant truncate on table "public"."passTemplates" to "authenticated";

grant update on table "public"."passTemplates" to "authenticated";

grant delete on table "public"."passTemplates" to "service_role";

grant insert on table "public"."passTemplates" to "service_role";

grant references on table "public"."passTemplates" to "service_role";

grant select on table "public"."passTemplates" to "service_role";

grant trigger on table "public"."passTemplates" to "service_role";

grant truncate on table "public"."passTemplates" to "service_role";

grant update on table "public"."passTemplates" to "service_role";

grant delete on table "public"."userProfiles" to "anon";

grant insert on table "public"."userProfiles" to "anon";

grant references on table "public"."userProfiles" to "anon";

grant select on table "public"."userProfiles" to "anon";

grant trigger on table "public"."userProfiles" to "anon";

grant truncate on table "public"."userProfiles" to "anon";

grant update on table "public"."userProfiles" to "anon";

grant delete on table "public"."userProfiles" to "authenticated";

grant insert on table "public"."userProfiles" to "authenticated";

grant references on table "public"."userProfiles" to "authenticated";

grant select on table "public"."userProfiles" to "authenticated";

grant trigger on table "public"."userProfiles" to "authenticated";

grant truncate on table "public"."userProfiles" to "authenticated";

grant update on table "public"."userProfiles" to "authenticated";

grant delete on table "public"."userProfiles" to "service_role";

grant insert on table "public"."userProfiles" to "service_role";

grant references on table "public"."userProfiles" to "service_role";

grant select on table "public"."userProfiles" to "service_role";

grant trigger on table "public"."userProfiles" to "service_role";

grant truncate on table "public"."userProfiles" to "service_role";

grant update on table "public"."userProfiles" to "service_role";



