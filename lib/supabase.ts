import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";
import { AppState } from "react-native";
import "react-native-get-random-values";
import { LargeSecureStore } from "~/lib/large-secure-store";
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

export async function uploadImage(base64: string, path: string) {
  const buffer = Buffer.from(base64, "base64");
  const response = await supabase.storage.from("images").upload(path, buffer, {
    contentType: "image/png",
  });
  return response;
}
