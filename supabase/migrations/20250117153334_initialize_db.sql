alter table "public"."pass_templates" drop constraint "check_coupon";

alter table "public"."pass_templates" add column "user_id" uuid not null;

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



