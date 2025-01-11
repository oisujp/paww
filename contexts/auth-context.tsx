import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";

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

type Props = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  session?: Session | null;
};

export const AuthContext = createContext<Props>({} as Props);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp: async (email: string, password: string) => {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          console.log(error);
        },
        signIn: async (email: string, password: string) => {
          const {
            error,
            data: { session },
          } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (session) {
            const { access_token, refresh_token } = session;
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            router.replace("/");
          }
        },
        signOut: async () => {
          await supabase.auth.signOut();
          setSession(null);
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
