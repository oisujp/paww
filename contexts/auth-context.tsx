import { Session } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Alert } from "react-native";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";
import { User } from "~/types/supabase";

type Props = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  createSessionFromUrl: (url: string) => Promise<Session | null | undefined>;
  session?: Session | null;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<Props>({} as Props);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        router.replace("/home/pass-templates");
      } else {
        router.replace("/sign-in");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    void (async () => {
      const user = session?.user;
      if (user) {
        const { data } = await supabase
          .from("users")
          .select()
          .eq("id", user.id)
          .single();
        setUser(data);
      } else {
        setUser(null);
      }
    })();
  }, [session]);

  const scheme = Constants.expoConfig?.scheme;
  if (typeof scheme !== "string") {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        signUp: async (email: string, password: string) => {
          try {
            const res = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: makeRedirectUri({
                  scheme,
                  path: "confirm-email",
                }),
              },
            });
            const error = res.error;
            if (error) {
              logger.error(error);
              Alert.alert("エラー", error.message);
              throw error;
            }
          } catch (error) {
            logger.error(error);
          }
        },
        signIn: async (email: string, password: string) => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            logger.error(error);
            Alert.alert("エラー", error.message);
            throw error;
          }
        },
        signOut: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              logger.error(error);
              throw error;
            }
            setSession(null);
          } catch (error) {
            logger.error(error);
          }
        },
        resetPassword: async (email: string) => {
          try {
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: makeRedirectUri({
                scheme,
                path: "change-password",
              }),
            });
          } catch (error) {
            logger.error(error);
          }
        },
        changePassword: async (password: string) => {
          await supabase.auth.updateUser({ password });
        },
        createSessionFromUrl: async (url: string) => {
          try {
            const { params, errorCode } = QueryParams.getQueryParams(url);
            if (errorCode) throw new Error(errorCode);

            const { access_token, refresh_token } = params;
            if (!access_token) return;

            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;

            return data.session;
          } catch (error) {
            logger.error(error);
          }
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
