import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { themeColors } from "~/lib/constants";

export const HeaderCloseButton = () => {
  const router = useRouter();
  if (Platform.OS === "android") {
    return undefined;
  }
  return (
    <TouchableOpacity onPress={() => router.dismiss()}>
      <X size={24} color={themeColors.foreground} />
    </TouchableOpacity>
  );
};
