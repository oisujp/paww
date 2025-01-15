import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Buffer } from "node:buffer";
import jwt from "npm:jsonwebtoken@9.0.2";
import { v4 as uuidv4 } from "npm:uuid@11.0.3";

const googleWalletCredentialsBase64 = Deno.env.get(
  "GOOGLE_WALLET_CREDENTIALS"
)!;
const googleWalletCredentials = JSON.parse(
  Buffer.from(googleWalletCredentialsBase64, "base64").toString()
) as {
  project_id: string;
  client_email: string;
  private_key: string;
};

Deno.serve(async (req) => {
  const classSuffix = "jp.oisu.luckycat.offer";
  const issuerId = "3388000000022271791";
  const classId = `${issuerId}.${classSuffix}`;

  const { issuerName, title, provider, barcodeValue } = await req.json();

  const objectId = `${issuerId}.${uuidv4()}`;
  const offerClass = {
    id: `${issuerId}.${classSuffix}`,
    reviewStatus: "APPROVED",
    redemptionChannel: "ONLINE",
    issuerName,
    provider,
    title,
  };
  const newObject = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    barcode: {
      type: "QR_CODE",
      alternateText: barcodeValue,
      value: barcodeValue,
    },
  };
  const claims = {
    iss: googleWalletCredentials.client_email,
    aud: "google",
    origins: [],
    typ: "savetowallet",
    payload: {
      offerClasses: [offerClass],
      offerObjects: [newObject],
    },
  };
  const token = jwt.sign(claims, googleWalletCredentials.private_key, {
    algorithm: "RS256",
  });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return new Response(saveUrl, {
    headers: { "Content-Type": "application/json" },
  });
});
