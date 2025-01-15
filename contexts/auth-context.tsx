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

type UserProfile = { name: string; icon: string; logo: string };

type Props = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  session?: Session | null;
  userProfile: UserProfile | null;
  setUserProfile: (userProfile: UserProfile) => void;
};

export const AuthContext = createContext<Props>({} as Props);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (user) {
        const { data } = await supabase
          .from("user_profiles")
          .select()
          .eq("user_id", user.id)
          .single();
        setUserProfile(data);
      } else {
        setUserProfile(null);
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
            router.replace("(tabs)");
          }
        },
        signOut: async () => {
          await supabase.auth.signOut();
          setSession(null);
        },
        session,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
