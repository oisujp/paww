import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Menu } from "~/components/menu";
import { passBase } from "~/lib/constants";
import { passTemplateSchema } from "~/schemas";

export default function PassTemplatesLayout() {
  const form = useForm<z.infer<typeof passTemplateSchema>>({
    resolver: zodResolver(passTemplateSchema),
    defaultValues: {
      id: uuidv4(),
      name: "", // always empty for now
      description: "created by paww", // fixed for now
      passContentLabel: "特典", // fixed for now
      passContentValue: "",
      labelColor: passBase.labelColor,
      foregroundColor: passBase.foregroundColor,
      backgroundColor: passBase.backgroundColor,
    },
  });

  return (
    <FormProvider {...form}>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            title: "テンプレート一覧",
            headerRight: () => {
              return <Menu />;
            },
          }}
        />
        <Stack.Screen
          name="new-template"
          options={{
            title: "テンプレートを作成",
          }}
        />
        <Stack.Screen
          name="passes"
          options={{
            title: "発行済みパス一覧",
          }}
        />
        <Stack.Screen
          name="pass"
          options={{
            title: "発行済みパス詳細",
          }}
        />
        <Stack.Screen
          name="pick-color"
          options={{
            presentation: "formSheet",
            gestureDirection: "vertical",
            animation: "slide_from_bottom",
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.5],
            headerTitle: "色を選択",
            gestureEnabled: true,
          }}
        />
      </Stack>
    </FormProvider>
  );
}
