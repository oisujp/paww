import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, startOfDay } from "date-fns";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { AuthContext } from "~/contexts/auth-context";
import { passBase } from "~/lib/constants";
import { passTemplateSchema } from "~/schemas";

export default function AppLayout() {
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
    },
  });

  const { session } = useContext(AuthContext);
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <FormProvider {...form}>
      <Stack>
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
      </Stack>
    </FormProvider>
  );
}
