import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, startOfDay } from "date-fns";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { HeaderBackButton } from "~/components/header-back-button";
import { HeaderCloseButton } from "~/components/header-close-button";
import {
  contentStyle,
  headerStyle,
  passBase,
  sampleStrips,
} from "~/lib/constants";
import { passTemplateSchema } from "~/schemas";

export default function Layout() {
  const form = useForm<z.infer<typeof passTemplateSchema>>({
    resolver: zodResolver(passTemplateSchema),
    defaultValues: {
      id: uuidv4(),
      description: "",
      foregroundColor: passBase.foregroundColor,
      backgroundColor: passBase.backgroundColor,
      stripUrl: sampleStrips[0],
      expirationDate: startOfDay(addMonths(new Date(), 1)),
      noExpirationDate: false,
    },
  });
  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerStyle,
          contentStyle,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "テンプレートを作成",
            headerLeft: HeaderBackButton,
          }}
        />
        <Stack.Screen
          name="preview-pass-template"
          options={{
            // https://github.com/software-mansion/react-native-screens/issues/2590
            headerShown: Platform.OS === "ios" ? false : true,
            title: "テンプレートのプレビュー",
            headerLeft: HeaderBackButton,
          }}
        />
        <Stack.Screen
          name="pick-color"
          options={{
            presentation: "modal",
            title: "色を選択",
            headerStyle: { backgroundColor: "white" },
            headerRight: HeaderCloseButton,
            contentStyle: { backgroundColor: "white" },
          }}
        />
        <Stack.Screen
          name="pick-sample-image"
          options={{
            presentation: "modal",
            title: "サンプル画像を選択",
            headerStyle: { backgroundColor: "white" },
            headerRight: HeaderCloseButton,
            contentStyle: { backgroundColor: "white" },
          }}
        />
      </Stack>
    </FormProvider>
  );
}
