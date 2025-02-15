import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";
import CameraButton from "~/components/camera-button";
import { AuthContext } from "~/contexts/auth-context";

export default function AppLayout() {
  const { session } = useContext(AuthContext);
  if (session === undefined) {
    return null;
  }
  if (session === null) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="camera"
          options={{
            headerShown: false,
            presentation: "modal",
            title: "カメラ",
          }}
        />
      </Stack>
      <CameraButton />
    </React.Fragment>
  );
}
