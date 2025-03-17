import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Pressable, SafeAreaView, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { sampleStrips } from "~/lib/constants";

export default function PickSampleImage() {
  const form = useFormContext();
  const data = sampleStrips;
  const [sampleImageUrl, setSampleImageUrl] = useState(data[0]);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 flex justify-center">
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperClassName="gap-5"
        contentContainerClassName="p-5 gap-5"
        renderItem={({ item }) => {
          return (
            <Pressable
              className="flex flex-1 active:opacity-90"
              onPress={() => {
                setSampleImageUrl(item);
              }}
            >
              <Image
                source={{ uri: item }}
                className="h-32 border border-border rounded-xl"
                contentFit="contain"
              />

              {sampleImageUrl === item ? (
                <View className="absolute right-2.5 top-1.5 size-5 bg-primary items-center flex justify-center rounded-full">
                  <Check size="12" className="text-white font-bold" />
                </View>
              ) : (
                <View className="absolute right-2.5 top-1.5 size-5 rounded-full border border-border" />
              )}
            </Pressable>
          );
        }}
        ListFooterComponent={() => {
          return (
            <View className="w-full p-5">
              <Button
                onPress={() => {
                  form.setValue("stripUrl", sampleImageUrl);
                  router.dismiss();
                }}
              >
                <Text>選択する</Text>
              </Button>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
