import { createContext, useState, type PropsWithChildren } from "react";

type Props = {
  loading: boolean;
  setLoading: (bool: boolean) => void;
};

export const NavigationContext = createContext<Props>({} as Props);

export function NavigationProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <NavigationContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
