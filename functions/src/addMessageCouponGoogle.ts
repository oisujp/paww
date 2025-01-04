import { onRequest } from "firebase-functions/v2/https";
import { JWT } from "google-auth-library";
import { getGoogleWalletCredential } from "./util";

export const addMessageCouponGoogle = onRequest(async (_, response) => {
  const googleWalletCredentials = getGoogleWalletCredential();

  const client = new JWT({
    email: googleWalletCredentials.client_email,
    key: googleWalletCredentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/wallet_object.issuer",
    ],
  });
  const issuerId = "3388000000022271791";
  const url = `https://walletobjects.googleapis.com/walletobjects/v1/offerClass?issuerId=${issuerId}`;
  const res = await client.request({ url });

  response.send(res);
});
