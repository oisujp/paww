import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, startOfDay } from "date-fns";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { HeaderBackButton } from "~/components/header-back-button";
import { AuthContext } from "~/contexts/auth-context";
import {
  contentStyle,
  headerStyle,
  passBase,
  sampleStrips,
  themeColors,
} from "~/lib/constants";
import { passTemplateSchema } from "~/schemas";

export default function AppLayout() {
  const form = useForm<z.infer<typeof passTemplateSchema>>({
    resolver: zodResolver(passTemplateSchema),
    defaultValues: {
      id: uuidv4(),
      name: "coupon", // placeholder
      description: "coupon", // placeholder
      passContentLabel: "特典", // fixed for now
      passContentValue: "",
      foregroundColor: passBase.foregroundColor,
      backgroundColor: passBase.backgroundColor,
      stripUrl: sampleStrips[0],
      expirationDate: startOfDay(addMonths(new Date(), 1)),
      noExpirationDate: false,
    },
  });

  const { session } = useContext(AuthContext);
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerTintColor: themeColors.foreground,
          headerBackButtonDisplayMode: "minimal",
          headerStyle,
          contentStyle,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(new-pass-template)"
          options={{
            title: "テンプレートを作成",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(aux)/settings"
          options={{
            title: "設定",
            headerLeft: HeaderBackButton,
          }}
        />
        <Stack.Screen
          name="(aux)/debug"
          options={{
            title: "デバッグ",
            headerLeft: HeaderBackButton,
          }}
        />
        <Stack.Screen
          name="(aux)/license"
          options={{
            title: "ライセンス情報",
            headerLeft: HeaderBackButton,
          }}
        />
      </Stack>
    </FormProvider>
  );
}
