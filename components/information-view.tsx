import Information from "assets/images/information.svg";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export function InformationView({ text }: { text: string }) {
  return (
    <View>
      <View className="bg-primary-light flex flex-row gap-1 items-center justify-center py-1">
        <Information className="size-5" />
        <Text className="text-primary text-sm font-bold">{text}</Text>
      </View>
    </View>
  );
}
