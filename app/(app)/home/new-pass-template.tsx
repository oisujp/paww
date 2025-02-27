import { ErrorMessage } from "@hookform/error-message";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { format, getTime } from "date-fns";
import { useNavigation, useRouter } from "expo-router";
import { Share } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Image, ScrollView, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Menubar, MenubarMenu, MenubarTrigger } from "~/components/ui/menubar";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { passBase, themeColors } from "~/lib/constants";
import { fetchWithToken, supabase, uploadImage } from "~/lib/supabase";
import { cn, logger, pickImage } from "~/lib/utils";
import { passTemplateSchema } from "~/schemas";

export default function NewPassTemplate() {
  const { user, session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();
  const navigation = useNavigation();
  const [platform, setPlatform] = useState<string>("apple");

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

  const { control, handleSubmit, watch, setValue, getValues, reset, trigger } =
    useFormContext<z.infer<typeof passTemplateSchema>>();

  useEffect(() => {
    return () => {
      reset();
      setValue("id", uuidv4());
    };
  }, [reset, setValue]);

  useEffect(() => {
    if (user?.name) {
      setValue("logoText", user.name);
    }
  }, [user, setValue]);

  if (!user) {
    return null;
  }

  const primaryFields = [
    {
      key: "pass-content",
      label: watch("passContentLabel"),
      value: watch("passContentValue"),
    },
  ];
  const secondaryFields = [
    {
      key: "pass-content",
      label: watch("passContentLabel"),
      value: watch("passContentValue"),
    },
    {
      key: "expiration-date",
      label: "有効期限",
      value:
        watch("expirationDate") &&
        format(watch("expirationDate"), "yyyy/MM/dd"),
    },
  ];

  const onSubmit = async () => {
    if (!(await trigger())) {
      logger.error("form error");
      return "";
    }
    const userId = session?.user.id;
    if (!userId) {
      return;
    }
    const {
      name,
      backgroundColor,
      description,
      expirationDate,
      foregroundColor,
      labelColor,
      stripUrl,
      logoText,
    } = getValues();
    const { teamIdentifier, passTypeIdentifier } = passBase;

    try {
      // insert passTemplate
      const res = await insert([
        {
          name,
          userId,
          backgroundColor,
          description,
          expirationDate: expirationDate.toDateString(),
          foregroundColor,
          formatVersion: 1,
          labelColor,
          organizationName: name ?? "",
          teamIdentifier,
          logoText,
          passTypeIdentifier,
          serialNumber: uuidv4(),
          logoUrl: user.logoUrl,
          stripUrl,
          coupon: {
            primaryFields,
            secondaryFields,
          },
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

      const fetchResult = await fetchWithToken(url, { passTemplateId });
      logger.info(fetchResult);

      navigation.goBack();
    } catch (error) {
      logger.error(error);
    }
  };

  const pickStrip = async () => {
    try {
      setLoading(true);

      const stripBase64 = await pickImage(undefined, 450);

      if (stripBase64) {
        const path = `${user.id}/pass-templates/${watch("id")}/strip-${getTime(
          new Date()
        )}.png`;
        await uploadImage(stripBase64, path);
        const stripUrl = supabase.storage.from("images").getPublicUrl(path)
          .data.publicUrl;
        setValue("stripUrl", stripUrl);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const passTemplateProps = {
    name: watch("name"),
    organizationName: user.name,
    backgroundColor: watch("backgroundColor"),
    expirationDate:
      watch("expirationDate") && format(watch("expirationDate"), "yyyy/MM/dd"),
    foregroundColor: watch("foregroundColor"),
    labelColor: watch("labelColor"),
    logoText: watch("logoText"),
    coupon: {
      headerFields: [],
      primaryFields,
      secondaryFields,
      auxiliaryFields: [],
      backFields: [],
    },
    logoUrl: user.logoUrl,
    stripUrl: watch("stripUrl"),
  };

  const onChangeExpirationDate = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setValue("expirationDate", date);
    }
  };

  return (
    <React.Fragment>
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
        <View className={cn("flex-1 gap-5 p-6 bg-secondary/30")}>
          <PassTemplateImage passTemplateProps={passTemplateProps} />

          <Label>カバー画像</Label>
          {watch("stripUrl") && (
            <Image
              className="w-full h-32"
              source={{
                uri: watch("stripUrl"),
              }}
            />
          )}

          <Button
            variant="outline"
            onPress={pickStrip}
            disabled={loading}
            className="rounded-lg flex flex-row text-primary gap-2"
          >
            <Share width={15} height={16} color={themeColors.primary} />
            <Text>画像を選択する</Text>
          </Button>

          <Label>特典</Label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="お会計から10%引き！"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="passContentValue"
          />
          <Text className="text-sm text-destructive">
            <ErrorMessage name="passContentValue" />
          </Text>

          <Label>有効期限</Label>
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
            }}
            className="-ml-6"
          >
            <DateTimePicker
              mode="datetime"
              locale="ja"
              onChange={onChangeExpirationDate}
              value={watch("expirationDate") ?? new Date()}
            />
          </View>

          <Label>背景色</Label>

          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/home/pick-color",
                params: { key: "backgroundColor" },
              });
            }}
            style={{ backgroundColor: watch("backgroundColor") }}
          >
            <Text>{watch("backgroundColor")}</Text>
          </Button>

          <Label>メイン文字色</Label>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/home/pick-color",
                params: { key: "foregroundColor" },
              });
            }}
            style={{ backgroundColor: watch("foregroundColor") }}
          >
            <Text>{watch("foregroundColor")}</Text>
          </Button>

          <Label>サブ文字色</Label>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/home/pick-color",
                params: { key: "labelColor" },
              });
            }}
            style={{ backgroundColor: watch("labelColor") }}
          >
            <Text>{watch("labelColor")}</Text>
          </Button>

          <View className="w-full gap-4">
            <Text>発行済みのパスには、変更は適用されません。</Text>
            <Button onPress={handleSubmit(onSubmit)}>
              <Text>保存</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </React.Fragment>
  );
}
