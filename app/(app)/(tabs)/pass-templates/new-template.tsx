import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { format, getTime } from "date-fns";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, ScrollView, View } from "react-native";
import ColorPicker, {
  Panel5,
  Preview,
  returnedResults,
} from "reanimated-color-picker";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Menubar, MenubarMenu, MenubarTrigger } from "~/components/ui/menubar";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { passBase } from "~/lib/constants";
import { supabase, uploadImage } from "~/lib/supabase";
import { cn, logger, pickImage } from "~/lib/utils";

type FormData = z.infer<typeof templateSchema>;

const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoText: z.string(),
  description: z.string(),
  passContentLabel: z.string(),
  passContentValue: z.string(),
  stripUrl: z.string(),
  expirationDate: z.date(),
  labelColor: z.string(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
});

export default function NewTemplate() {
  const { user, session } = useContext(AuthContext);
  const navigation = useNavigation();
  const [foregroundColorOpen, setForegroundColorOpen] = useState(false);
  const [backgroundColorOpen, setBackgroundColorOpen] = useState(false);
  const [labelColorOpen, setLabelColorOpen] = useState(false);
  const [menuValue, setMenuValue] = useState<string>("apple");

  function onMenuValueChange(val: string | undefined) {
    if (val) {
      setMenuValue(val);
    }
  }

  const { trigger: insert } = useInsertMutation(
    supabase.from("passTemplates"),
    ["id"]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          variant="ghost"
          onPress={() => {
            navigation.goBack();
          }}
          className="-ml-4"
        >
          <AntDesign name="close" size={18} color="black" />
        </Button>
      ),
    });
  }, [navigation]);

  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof templateSchema>
  >({
    resolver: zodResolver(templateSchema),
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

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
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
    } = formData;
    const { teamIdentifier, passTypeIdentifier } = passBase;

    try {
      await insert([
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
      navigation.goBack();
    } catch (error) {
      logger.error(error);
    }
  };

  const pickStrip = async () => {
    const stripBase64 = await pickImage(160, 50);
    if (stripBase64) {
      const path = `${user.id}/pass-templates/${watch("id")}/strip-${getTime(
        new Date()
      )}.png`;
      await uploadImage(stripBase64, path);
      const stripUrl = supabase.storage.from("images").getPublicUrl(path)
        .data.publicUrl;
      setValue("stripUrl", stripUrl);
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

  const onSelectForegroundColor = (colors: returnedResults) => {
    setValue("foregroundColor", colors.rgb);
  };
  const onSelectBackgroundColor = (colors: returnedResults) => {
    setValue("backgroundColor", colors.rgb);
  };
  const onSelectLabelColor = (colors: returnedResults) => {
    setValue("labelColor", colors.rgb);
  };
  const onChangeExpirationDate = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setValue("expirationDate", date);
    }
  };

  return (
    <React.Fragment>
      <Menubar
        value={menuValue}
        onValueChange={onMenuValueChange}
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
        <View
          className={cn(
            "flex-1 justify-center items-center gap-5 p-6 bg-secondary/30"
          )}
        >
          <PassTemplateImage passTemplateProps={passTemplateProps} />

          <Card className="w-full">
            <CardHeader>
              <CardTitle>クーポン情報</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Label>カバー画像</Label>
              {watch("stripUrl") && (
                <Image
                  className="w-full h-32"
                  source={{
                    uri: watch("stripUrl"),
                  }}
                />
              )}
              <Button variant="secondary" onPress={pickStrip}>
                <Text>画像を選択</Text>
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

              <Label>有効期限</Label>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-start",
                }}
                className="-ml-3"
              >
                <DateTimePicker
                  mode="datetime"
                  onChange={onChangeExpirationDate}
                  value={watch("expirationDate") ?? new Date()}
                />
              </View>

              <Label>背景色</Label>
              <ColorPicker
                value={watch("backgroundColor")}
                onComplete={onSelectBackgroundColor}
              >
                <Collapsible
                  open={backgroundColorOpen}
                  onOpenChange={(open) => setBackgroundColorOpen(open)}
                >
                  <CollapsibleTrigger
                    className="p-2 rounded-md"
                    style={{ backgroundColor: watch("backgroundColor") }}
                  >
                    <Preview hideInitialColor />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Panel5 />
                  </CollapsibleContent>
                </Collapsible>
              </ColorPicker>

              <Label>メイン文字色</Label>
              <ColorPicker
                value={watch("foregroundColor")}
                onComplete={onSelectForegroundColor}
              >
                <Collapsible
                  open={foregroundColorOpen}
                  onOpenChange={(open) => setForegroundColorOpen(open)}
                >
                  <CollapsibleTrigger
                    className="p-2 rounded-md"
                    style={{ backgroundColor: watch("foregroundColor") }}
                  >
                    <Preview hideInitialColor />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Panel5 />
                  </CollapsibleContent>
                </Collapsible>
              </ColorPicker>

              <Label>サブ文字色</Label>
              <ColorPicker
                value={watch("labelColor")}
                onComplete={onSelectLabelColor}
              >
                <Collapsible
                  open={labelColorOpen}
                  onOpenChange={(open) => setLabelColorOpen(open)}
                >
                  <CollapsibleTrigger
                    className="p-2 rounded-md"
                    style={{ backgroundColor: watch("labelColor") }}
                  >
                    <Preview hideInitialColor />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Panel5 />
                  </CollapsibleContent>
                </Collapsible>
              </ColorPicker>
            </CardContent>
          </Card>

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
