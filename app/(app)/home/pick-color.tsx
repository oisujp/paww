import { useLocalSearchParams } from "expo-router";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import ColorPicker, { Panel5 } from "reanimated-color-picker";

export default function PickColor() {
  const form = useFormContext();
  const { key } = useLocalSearchParams<{
    key: "backgroundColor" | "foregroundColor" | "labelColor";
  }>();
  return (
    <View className="p-6">
      <ColorPicker
        value={form.watch(key)}
        onComplete={(result) => {
          form.setValue(key, result.hex);
        }}
      >
        <Panel5 />
      </ColorPicker>
    </View>
  );
}
