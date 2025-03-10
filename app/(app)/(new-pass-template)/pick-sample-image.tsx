import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { sampleStrips } from "~/lib/constants";

export default function PickSampleImage() {
  const form = useFormContext();
  const router = useRouter();
  const data = sampleStrips;

  return (
    <View className="bg-white px-3">
      <FlatList
        data={data}
        columnWrapperClassName="gap-3"
        numColumns={2}
        contentContainerClassName="gap-3 w-full"
        renderItem={({ item }) => {
          return (
            <Pressable
              className="flex flex-1"
              onPress={() => {
                form.setValue("stripUrl", item);
                router.back();
              }}
            >
              <Image
                source={{ uri: item }}
                className="h-32 border border-border rounded-xl"
                contentFit="contain"
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}
