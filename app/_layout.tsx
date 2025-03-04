import "~/global.css";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { Image } from "expo-image";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { cssInterop } from "nativewind";
import React from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "~/contexts/auth-context";
import { NavigationProvider } from "~/contexts/navigation-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// See:
// https://github.com/expo/expo/issues/27783
cssInterop(Image, { className: "style" });

// See:
// https://github.com/react-navigation/react-navigation/issues/11564
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function RootLayout() {
  return (
    <React.Fragment>
      <AuthProvider>
        <NavigationProvider>
          <GestureHandlerRootView>
            <ActionSheetProvider>
              <Slot />
            </ActionSheetProvider>
          </GestureHandlerRootView>
        </NavigationProvider>
      </AuthProvider>
      <PortalHost />
    </React.Fragment>
  );
}
