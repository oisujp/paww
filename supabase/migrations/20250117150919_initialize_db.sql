create extension if not exists "pg_jsonschema" with schema "public" version '0.3.3';

create table "public"."pass_templates" (
    "id" uuid not null default gen_random_uuid(),
    "background_color" text not null,
    "description" text not null,
    "expiration_date" timestamp without time zone,
    "foreground_color" text not null,
    "format_version" numeric,
    "label_color" text not null,
    "logo_text" text,
    "organization_name" text not null,
    "pass_type_identifier" text not null,
    "serial_number" text not null,
    "team_identifier" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp without time zone default (now() AT TIME ZONE 'utc'::text),
    "logo_base64" text,
    "icon_base64" text,
    "strip_base64" text,
    "coupon" jsonb not null
);


alter table "public"."pass_templates" enable row level security;

create table "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "user_id" uuid not null default gen_random_uuid(),
    "icon_base64" text,
    "logo_base64" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp without time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX pass_templates_pkey ON public.pass_templates USING btree (id);

CREATE UNIQUE INDEX user_profile_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX user_profiles_user_id_key ON public.user_profiles USING btree (user_id);

alter table "public"."pass_templates" add constraint "pass_templates_pkey" PRIMARY KEY using index "pass_templates_pkey";

alter table "public"."user_profiles" add constraint "user_profile_pkey" PRIMARY KEY using index "user_profile_pkey";

alter table "public"."pass_templates" add constraint "check_coupon" CHECK (jsonb_matches_schema('{
        "type": "object",
        "properties": {
            "primary_fields": {
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
        "required": ["primary_fields"]
    }'::json, coupon)) NOT VALID not valid;

alter table "public"."pass_templates" validate constraint "check_coupon";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_key" UNIQUE using index "user_profiles_user_id_key";

grant delete on table "public"."pass_templates" to "anon";

grant insert on table "public"."pass_templates" to "anon";

grant references on table "public"."pass_templates" to "anon";

grant select on table "public"."pass_templates" to "anon";

grant trigger on table "public"."pass_templates" to "anon";

grant truncate on table "public"."pass_templates" to "anon";

grant update on table "public"."pass_templates" to "anon";

grant delete on table "public"."pass_templates" to "authenticated";

grant insert on table "public"."pass_templates" to "authenticated";

grant references on table "public"."pass_templates" to "authenticated";

grant select on table "public"."pass_templates" to "authenticated";

grant trigger on table "public"."pass_templates" to "authenticated";

grant truncate on table "public"."pass_templates" to "authenticated";

grant update on table "public"."pass_templates" to "authenticated";

grant delete on table "public"."pass_templates" to "service_role";

grant insert on table "public"."pass_templates" to "service_role";

grant references on table "public"."pass_templates" to "service_role";

grant select on table "public"."pass_templates" to "service_role";

grant trigger on table "public"."pass_templates" to "service_role";

grant truncate on table "public"."pass_templates" to "service_role";

grant update on table "public"."pass_templates" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

create policy "can access auth user only"
on "public"."user_profiles"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));




