import { createClient } from "jsr:@supabase/supabase-js@2";
import { Buffer } from "node:buffer";
import * as crypto from "node:crypto";
import { PKPass } from "npm:passkit-generator@3.3.0";
import { appleWalletCertificates } from "../shared/util.ts";

Deno.serve(async (req) => {
  const { name, image } = await req.json();

  // Feel free to use any other kind of UID here or even read an
  // existing ticket from the database and use its ID
  const passID = crypto
    .createHash("md5")
    .update(`${name}_${Date.now()}`)
    .digest("hex");
  // Generate the pass
  const pass = new PKPass(
    {
      "icon.png": Buffer.from(image, "base64"),
      "pass.json": Buffer.from(
        JSON.stringify({
          formatVersion: 1,
          passTypeIdentifier: "pass.jp.oisu.luckycat",
          teamIdentifier: "B8KVAMPYW5",
          serialNumber: "0000001",
          organizationName: "Oisu LLC",
          description: "川崎市立図書館 貸出カード",
          associatedStoreIdentifiers: [6446005163],
          labelColor: "rgb(255, 255, 255)",
          foregroundColor: "rgb(255, 255, 255)",
          backgroundColor: "rgb(11, 45, 125)",
          logoText: "川崎市立図書館 貸出カード",
        })
      ),
    },
    appleWalletCertificates,
    {
      serialNumber: passID,
    }
  );
  pass.type = "coupon";
  pass.backFields.push({
    key: "lineItem4",
    label: "Test link",
    value: "https://apple.com",
    dataDetectorTypes: ["PKDataDetectorTypeLink"],
    attributedValue:
      '<a href="https://apple.com">Used literally on iPhone, used correctly on Watch</a>',
  });
  if (name) {
    pass.secondaryFields.push({
      key: "name",
      label: "お名前",
      value: name,
    });
  }

  // Upload pkpass
  const authHeader = req.headers.get("Authorization")!;
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabaseClient.auth.getUser(token);
  const userId = user?.id;
  const timestamp = +new Date();
  const uploadName = `${userId}/${timestamp}.pkpass`;

  const { data: upload, error: uploadError } = await supabaseClient.storage
    .from("passes")
    .upload(uploadName, pass.getAsBuffer(), {
      contentType: pass.mimeType,
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error(uploadError);
    return new Response("Failed to upload the file", {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("passes").getPublicUrl(upload.path);

  return new Response(publicUrl, {
    headers: { "Content-Type": "application/json" },
  });
});
