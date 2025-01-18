import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState } from "react-native";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";
import { User } from "~/types/supabase";

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
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<Props>({} as Props);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (user) {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("userId", user.id)
          .single();
        setUser(data);
      } else {
        setUser(null);
      }
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
          if (error) {
            logger.error(error);
          }
        },
        signIn: async (email: string, password: string) => {
          const {
            data: { session },
          } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (session) {
            const { access_token, refresh_token } = session;
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            router.replace("(tabs)");
          }
        },
        signOut: async () => {
          await supabase.auth.signOut();
          setSession(null);
        },
        session,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
