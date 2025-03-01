import Clipboard from "assets/images/clipboard.svg";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function SuccessBlock({
  caption,
  description,
}: {
  caption: string;
  description?: string;
}) {
  return (
    <View className="flex flex-col justify-center items-center p-6">
      <Clipboard className="w-[90px] h-[90px]" />
      <Text className="text-xl text-center font-bold mt-2.5 mb-2">
        {caption}
      </Text>
      <Text>{description}</Text>
    </View>
  );
}
