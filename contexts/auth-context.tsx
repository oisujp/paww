import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";
import { User } from "~/types/supabase";

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
  const [session, setSession] = useState<Session | null | undefined>();
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
          .eq("id", user.id)
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
            throw error;
          }
        },
        signIn: async (email: string, password: string) => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            logger.error(error);
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
            console.log(error);
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
