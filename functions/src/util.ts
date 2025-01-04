import { defineSecret } from "firebase-functions/params";

type GoogleCredential = {
  project_id: string;
  client_email: string;
  private_key: string;
};

export const getGoogleWalletCredential = () => {
  const googleWalletCredentialsBase64 = defineSecret(
    "GOOGLE_WALLET_CREDENTIALS"
  ).value();
  const googleWalletCredentials = JSON.parse(
    Buffer.from(googleWalletCredentialsBase64, "base64").toString()
  ) as GoogleCredential;

  return googleWalletCredentials;
};

export const fetchImageAsBuffer = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error("error");
  }
};
