import { Buffer } from "node:buffer";

function base64EnvToString(envKey: string) {
  const envValue = Deno.env.get(envKey)!;
  return Buffer.from(envValue, "base64").toString();
}

export const appleWalletCertificates = {
  wwdr: base64EnvToString("APPLE_WALLET_CERT_WWDR"),
  signerCert: base64EnvToString("APPLE_WALLET_CERT_SIGNER"),
  signerKey: base64EnvToString("APPLE_WALLET_CERT_KEY"),
};
