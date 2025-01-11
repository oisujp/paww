import "~/global.css";

import { Slot, SplashScreen } from "expo-router";
import { AuthProvider } from "~/contexts/auth-context";
import { ThemeProvider } from "~/contexts/theme-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
