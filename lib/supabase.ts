import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, Session } from "@supabase/supabase-js";
import * as aesjs from "aes-js";
import { decode } from "base64-arraybuffer";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { logger } from "~/lib/utils";
import { Database } from "~/types/database.types";

// See:
// https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1)
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1)
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return encrypted;
    }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function uploadImage(
  uri: string,
  base64: string,
  session: Session
) {
  const response = await fetch(uri);
  const fileName = uri.split("/").filter(Boolean).pop();
  const mimeType = response.headers.get("Content-Type");
  const userId = session.user.id;
  const uploadName = `${userId}/${fileName}`;

  const { data: upload, error: uploadError } = await supabase.storage
    .from("images")
    .upload(uploadName, decode(base64), {
      contentType: mimeType ?? "",
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
  logger.info(upload);
}

export async function publishPass(templateId: string) {
  const { data, error } = await supabase.functions.invoke(
    "create-coupon-apple",
    {
      body: {
        templateId,
      },
    }
  );
  if (error) {
    logger.error(error);
  }
  return data as { publicUrl: string };
}
