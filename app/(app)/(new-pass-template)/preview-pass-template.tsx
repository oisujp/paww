import {
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "~/components/ui/menubar";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { passBase, sampleIcons } from "~/lib/constants";
import { fetchWithToken, supabase, userQuery } from "~/lib/supabase";
import { logger } from "~/lib/utils";
import { passTemplateSchema } from "~/schemas";

export default function NewPassTemplate() {
  const { session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  const [platform, setPlatform] = useState<string>("apple");

  const userId = session?.user.id ?? "";
  const { data: userData } = useQuery(userQuery(userId));

  function onPlatformChange(val: string | undefined) {
    if (val) {
      setPlatform(val);
    }
  }

  const { trigger: insert } = useInsertMutation(
    supabase.from("passTemplates"),
    ["id"],
    "id"
  );

  const { handleSubmit, watch, getValues, reset } =
    useFormContext<z.infer<typeof passTemplateSchema>>();

  if (!userData?.name) {
    return null;
  }

  const onSubmit = async () => {
    if (!userData.name) {
      return;
    }
    setLoading(true);
    const {
      backgroundColor,
      description,
      caveats,
      expirationDate,
      foregroundColor,
      stripUrl,
      noExpirationDate,
    } = getValues();

    const { teamIdentifier, passTypeIdentifier } = passBase;

    try {
      // insert passTemplate
      const res = await insert([
        {
          userId,
          backgroundColor,
          description,
          caveats,
          expirationDate:
            !noExpirationDate && expirationDate
              ? expirationDate.toDateString()
              : null,
          foregroundColor,
          formatVersion: 1,
          organizationName: userData.name,
          teamIdentifier,
          logoText: userData.logoText,
          passTypeIdentifier,
          serialNumber: uuidv4(),
          iconUrl: sampleIcons[0], // TODO
          logoUrl: userData.logoUrl ?? "", // TODO
          stripUrl,
        },
      ]);

      if (!res || res.length === 0) {
        throw "insert passTemplate error";
      }

      // insert google offer class
      const passTemplateId = res[0].id;
      const url =
        process.env.EXPO_PUBLIC_PAWW_BASE_URL +
        "/api/google/create-coupon-template";
      await fetchWithToken(url, { passTemplateId });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      reset();
      router.dismissTo("/home/pass-templates");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const passTemplateProps = {
    organizationName: userData.name,
    backgroundColor: watch("backgroundColor"),
    expirationDate: watch("expirationDate"),
    foregroundColor: watch("foregroundColor"),
    logoText: userData.logoText,
    caveats: watch("caveats"),
    logoUrl: userData.logoUrl,
    stripUrl: watch("stripUrl"),
    description: watch("description"),
  };

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <Menubar
        value={platform}
        onValueChange={onPlatformChange}
        className="flex items-center justify-center"
      >
        <MenubarMenu value="apple">
          <MenubarTrigger>
            <Text>Apple</Text>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu value="google">
          <MenubarTrigger>
            <Text>Google</Text>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <ScrollView>
        <View className="p-6">
          <PassTemplateImage
            passTemplateProps={passTemplateProps}
            showBarcode
          />
        </View>
      </ScrollView>

      <View className="flex p-4">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex flex-row gap-2 w-full"
        >
          {loading && <ActivityIndicator className="text-white" />}
          <Text>保存する</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
