import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, ScrollView, View } from "react-native";
import ColorPicker, {
  Panel5,
  Preview,
  returnedResults,
} from "reanimated-color-picker";
import { z } from "zod";
import { Pass } from "~/components/pass";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { defaultImages, passBase } from "~/lib/constants";
import { cn, pickImage } from "~/lib/utils";

type FormData = {
  passName: string;
  passContentLabel: string;
  passContentValue: string;
  stripBase64: string;
  expirationDate: Date;
  labelColor: string;
  foregroundColor: string;
  backgroundColor: string;
};

const signUpSchema = z.object({
  passName: z.string(),
  passContentLabel: z.string(),
  passContentValue: z.string(),
  stripBase64: z.string(),
  expirationDate: z.date(),
  labelColor: z.string(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
});

export default function NewTemplate() {
  const { userProfile } = useContext(AuthContext);
  const [foregroundColorOpen, setForegroundColorOpen] = useState(false);
  const [backgroundColorOpen, setBackgroundColorOpen] = useState(false);
  const [labelColorOpen, setLabelColorOpen] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof signUpSchema>
  >({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      passName: "テスト",
      passContentLabel: "特典",
      passContentValue: "20%引き",
      stripBase64: defaultImages.stripBase64,
      expirationDate: new Date(),
      labelColor: passBase.labelColor,
      foregroundColor: passBase.foregroundColor,
      backgroundColor: passBase.backgroundColor,
    },
  });

  if (!userProfile) {
    return null;
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {};

  const pickStrip = async () => {
    const image = await pickImage(160, 50);
    if (image?.base64) {
      setValue("stripBase64", image.base64);
    }
  };

  const passData: PassData = {
    fields: {
      headerFields: [],
      primaryFields: [
        {
          type: "text",
          label: watch("passContentLabel"),
          value: watch("passContentValue"),
        },
      ],
      secondaryFields: [
        {
          type: "text",
          label: "有効期限",
          value: format(watch("expirationDate"), "yyyy/MM/dd"),
        },
      ],
      auxiliaryFields: [],
      backFields: [],
    },
    images: {
      icon: userProfile?.icon,
      strip: watch("stripBase64"),
      logo: userProfile?.logo,
    },
    colors: {
      labelColor: watch("labelColor"),
      foregroundColor: watch("foregroundColor"),
      backgroundColor: watch("backgroundColor"),
    },
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
    <ScrollView>
      <View
        className={cn(
          "flex-1 justify-center items-center gap-5 p-6 bg-secondary/30"
        )}
      >
        <Pass passData={passData} />

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>クーポン情報</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Label>名前</Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="クーポンの名前"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="passName"
            />

            <Label>クーポンの画像</Label>
            <Image
              className="w-full h-32"
              source={{
                uri: `data:image/png;base64,${watch("stripBase64")}`,
              }}
            />
            <Button variant="secondary" onPress={pickStrip}>
              <Text>画像を選択</Text>
            </Button>

            <Label>クーポンの内容</Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="クーポンの内容"
                  inputMode="text"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="passContentValue"
            />

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
                value={watch("expirationDate")}
              />
            </View>
          </CardContent>
        </Card>

        <View className="w-full gap-4">
          <Button onPress={handleSubmit(onSubmit)}>
            <Text>保存</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
