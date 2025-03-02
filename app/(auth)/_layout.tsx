import { Stack } from "expo-router";
import React from "react";
import { BackButton } from "~/components/back-button";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="reset-password"
        options={{
          headerTitle: "パスワードをリセットする",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerTitle: "パスワードの再設定をする",
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="change-password-success"
        options={{
          headerTitle: "パスワードの再設定完了",
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="reset-password-success"
        options={{
          headerTitle: "パスワードのリセットが完了",
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="confirm-email"
        options={{
          headerTitle: "確認メールの送信完了",
          headerLeft: () => <></>,
        }}
      />
    </Stack>
  );
}
