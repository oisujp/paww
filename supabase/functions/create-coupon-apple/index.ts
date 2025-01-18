import { createClient } from "jsr:@supabase/supabase-js@2";
import { Buffer } from "node:buffer";
import { PKPass } from "npm:passkit-generator@3.3.0";
import { Database } from "../database.types.ts";
import {
  appleWalletCertificates,
  generateTimestamp,
  parseCoupon,
  uploadPkpass,
} from "../shared/util.ts";

Deno.serve(async (req) => {
  const { templateId } = await req.json();
  const authHeader = req.headers.get("Authorization")!;
  const timestamp = generateTimestamp(new Date());
  const serialNumber = timestamp;

  const supabase = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: authHeader } },
    }
  );
  const { data } = await supabase
    .from("passTemplates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (!data) {
    return new Response("Failed to upload the file", {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  const passTemplate = parseCoupon(data);
  const {
    iconBase64,
    stripBase64,
    logoBase64,
    formatVersion,
    labelColor,
    foregroundColor,
    backgroundColor,
    logoText,
    description,
    organizationName,
    passTypeIdentifier,
    teamIdentifier,
    coupon,
  } = passTemplate;

  const buffers: { [key: string]: Buffer } = {};
  buffers["pass.json"] = Buffer.from(
    JSON.stringify({
      formatVersion,
      passTypeIdentifier,
      teamIdentifier,
      serialNumber,
      organizationName,
      description,
      labelColor,
      foregroundColor,
      backgroundColor,
      logoText,
    })
  );
  if (iconBase64) {
    buffers["icon.png"] = Buffer.from(iconBase64, "base64");
  }
  if (stripBase64) {
    buffers["strip.png"] = Buffer.from(stripBase64, "base64");
  }
  if (logoBase64) {
    buffers["logo.png"] = Buffer.from(logoBase64, "base64");
  }
  const pass = new PKPass(buffers, appleWalletCertificates, {
    serialNumber,
  });
  pass.type = "coupon";
  pass.primaryFields.push(coupon.primaryFields[0]);

  // Upload pkpass
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  const userId = user?.id;
  const uploadPath = `${userId}/${timestamp}.pkpass`;
  const publicUrl = await uploadPkpass(pass, uploadPath, supabase);
  if (!publicUrl) {
    return new Response("Failed to upload the file", {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ publicUrl }), {
    headers: { "Content-Type": "application/json" },
  });
});
