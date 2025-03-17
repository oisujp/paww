import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Platform, SafeAreaView, View } from "react-native";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export default function PickColor() {
  const form = useFormContext();
  const { key } = useLocalSearchParams<{
    key: "backgroundColor" | "foregroundColor" | "labelColor";
  }>();
  const [color, setColor] = useState(form.watch(key));
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1 p-6">
      <View className={cn(Platform.select({ ios: "p-6" }))}>
        <ColorPicker
          value={form.watch(key)}
          onComplete={(result) => {
            setColor(result.hex);
          }}
        >
          <Panel5 />
          <Button
            className="w-full my-6"
            onPress={() => {
              form.setValue(key, color);
              router.dismiss();
            }}
          >
            <Text>選択する</Text>
          </Button>
        </ColorPicker>
      </View>
    </SafeAreaView>
  );
}
