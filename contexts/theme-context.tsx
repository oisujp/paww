import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
  Theme,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Platform } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";

type Props = {
  isColorSchemeLoaded: boolean;
};

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export const ThemeContext = createContext<Props>({} as Props);

export function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <RNThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <ThemeContext.Provider
        value={{
          isColorSchemeLoaded,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </RNThemeProvider>
  );
}
