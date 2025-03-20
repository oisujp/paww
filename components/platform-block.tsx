import AndroidIcon from "assets/images/android.svg";
import AppleIcon from "assets/images/apple.svg";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function PlatformBlock({ platform }: { platform: string }) {
  return (
    <View className="flex flex-row items-center gap-1">
      {platform === "ios" ? (
        <>
          <AppleIcon className="size-[20px]" />
          <Text className="text-sm">Apple</Text>
        </>
      ) : platform === "android" ? (
        <>
          <AndroidIcon className="size-[20px]" />
          <Text className="text-sm">Google</Text>
        </>
      ) : null}
    </View>
  );
}
