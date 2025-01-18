import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Buffer } from "node:buffer";
import { format } from "npm:date-fns@4.1.0";
import { PKPass } from "npm:passkit-generator@3.3.0";
import { Database } from "./database.types.ts";

function base64EnvToString(envKey: string) {
  const envValue = Deno.env.get(envKey)!;
  return Buffer.from(envValue, "base64").toString();
}

export const appleWalletCertificates = {
  wwdr: base64EnvToString("APPLE_WALLET_CERT_WWDR"),
  signerCert: base64EnvToString("APPLE_WALLET_CERT_SIGNER"),
  signerKey: base64EnvToString("APPLE_WALLET_CERT_KEY"),
};

export const uploadPkpass = async (
  pass: PKPass,
  uploadPath: string,
  supabase: SupabaseClient
) => {
  const { data: upload, error: uploadError } = await supabase.storage
    .from("passes")
    .upload(uploadPath, pass.getAsBuffer(), {
      contentType: pass.mimeType,
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error(uploadError);
    return;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("passes").getPublicUrl(upload.path);
  return publicUrl;
};

export const parseCoupon = (
  passTemplate: Database["public"]["Tables"]["passTemplates"]["Row"]
) => {
  return { ...passTemplate, coupon: passTemplate.coupon as PassFields };
};

export function generateTimestamp(date = new Date()) {
  const mainTimestamp = format(date, "yyyyMMddHHmmss");
  const microseconds = date.getMilliseconds() * 1000;
  return `${mainTimestamp}${microseconds
    .toString()
    .padStart(4, "0")
    .slice(0, 4)}`;
}
