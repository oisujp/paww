import { useRouter } from "expo-router";
import { SettingsIcon } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export function Settings() {
  const router = useRouter();
  return (
    // https://github.com/react-navigation/react-navigation/issues/12274
    <TouchableOpacity
      className="-mr-4 px-0"
      onPress={() => {
        router.push({ pathname: "/settings" });
      }}
    >
      <SettingsIcon color={"#5F6368"} />
    </TouchableOpacity>
  );
}
