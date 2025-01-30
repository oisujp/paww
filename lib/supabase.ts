import { createClient, Session } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { AppState } from "react-native";
import "react-native-get-random-values";
import { LargeSecureStore } from "~/lib/large-secure-store";
import { logger } from "~/lib/utils";
import { Database } from "~/types/database.types";

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

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
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
