import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { themeColors } from "~/lib/constants";

export const HeaderBackButton = () => {
  const router = useRouter();
  if (Platform.OS === "android") {
    return undefined;
  }
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <ChevronLeft size={24} color={themeColors.foreground} />
    </TouchableOpacity>
  );
};
