import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, startOfDay } from "date-fns";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import CameraButton from "~/components/camera-button";
import { Menu } from "~/components/menu";
import { passBase } from "~/lib/constants";
import { passTemplateSchema } from "~/schemas";

export default function PassTemplatesLayout() {
  const sampleStripUrl =
    "https://ndhmdespsfgginfazkds.supabase.co/storage/v1/object/public/images/1c60c02e-18e6-473e-9ef0-94d12ead2b56/user/logo-1740107365121.png";
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
      expirationDate: startOfDay(addMonths(new Date(), 1)),
      stripUrl: sampleStripUrl,
    },
  });

  return (
    <FormProvider {...form}>
      <Stack>
        <Stack.Screen
          name="pass-templates"
          options={{
            title: "テンプレート一覧",
            headerRight: () => {
              return <Menu />;
            },
          }}
        />
        <Stack.Screen
          name="new-pass-template"
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
      <CameraButton />
    </FormProvider>
  );
}
