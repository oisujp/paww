import "~/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Slot, SplashScreen } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "~/contexts/auth-context";
import { NavigationProvider } from "~/contexts/navigation-context";
import { ThemeProvider } from "~/contexts/theme-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <React.Fragment>
      <AuthProvider>
        <ThemeProvider>
          <NavigationProvider>
            <GestureHandlerRootView>
              <Slot />
            </GestureHandlerRootView>
          </NavigationProvider>
        </ThemeProvider>
      </AuthProvider>
      <PortalHost />
    </React.Fragment>
  );
}
