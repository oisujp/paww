import "~/global.css";

import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "戻る" }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="change-password-success" />
      <Stack.Screen name="confirm-email" />
    </Stack>
  );
}
