import "~/global.css";

import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "戻る" }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="reset-password"
        options={{
          headerTitle: "パスワードをリセットする",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerTitle: "パスワードを変更する",
        }}
      />
      <Stack.Screen
        name="change-password-success"
        options={{
          headerTitle: "パスワードの変更完了",
        }}
      />
      <Stack.Screen
        name="reset-password-success"
        options={{
          headerTitle: "パスワードのリセット",
        }}
      />
      <Stack.Screen
        name="confirm-email"
        options={{
          headerTitle: "確認メールの送信完了",
        }}
      />
    </Stack>
  );
}
