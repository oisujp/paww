import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <ChevronLeft size={24} />
    </TouchableOpacity>
  );
};
