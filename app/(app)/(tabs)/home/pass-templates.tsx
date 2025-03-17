import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import PassTemplateImage from "assets/images/pass-template.svg";
import Store from "assets/images/store.svg";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { PassTemplateBlock } from "~/components/pass/pass-template-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { passTemplatesQuery, userQuery } from "~/lib/supabase";

export default function Home() {
  const router = useRouter();
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const {
    data: passTemplatesData,
    count,
    isLoading: isLoadingPassTemplates,
  } = useQuery(passTemplatesQuery(userId));

  const { data: userData, isLoading: isLoadingUser } = useQuery(
    userQuery(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoadingPassTemplates || isLoadingUser) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="bg-background flex flex-1 justify-center items-center gap-8 p-6">
        <Store className="w-[129px] h-[90px]" />
        <View className="flex items-center gap-2">
          <Text className="text-2xl font-bold">お店情報を作成してください</Text>
          <View className="flex items-center">
            <Text>まずはデジタルパスを作成するために</Text>
            <Text>あなたのお店情報を設定しましょう</Text>
          </View>
        </View>
        <Button className="w-full" onPress={() => router.push("/store")}>
          <Text>お店情報の設定に進む</Text>
        </Button>
      </View>
    );
  }

  if (passTemplatesData?.length === 0) {
    return (
      <View className="bg-background flex flex-1 justify-center items-center gap-8 p-6">
        <PassTemplateImage className="size-[90px]" />
        <View className="flex items-center gap-2">
          <Text className="text-2xl font-bold">
            テンプレートを作成してください
          </Text>
          <View className="flex items-center">
            <Text>お店オリジナルのデジタルパスを作成するために</Text>
            <Text>テンプレートを作成しましょう</Text>
          </View>
        </View>
        <Button
          className="w-full"
          onPress={() => router.push("/(app)/(new-pass-template)")}
        >
          <Text>テンプレートの作成に進む</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="bg-background flex flex-1">
      <View className="flex w-full items-end my-3 px-6">
        <Text className="text-right text-sm">全{count}件</Text>
      </View>
      <FlatList
        data={passTemplatesData}
        contentContainerClassName="gap-3"
        columnWrapperClassName="gap-3 px-6"
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <View className="flex flex-1">
              <PassTemplateBlock passTemplateId={item.id} />
            </View>
          );
        }}
      />
      <Button
        className="m-4"
        onPress={() => router.push({ pathname: "/(app)/(new-pass-template)" })}
      >
        <Text className="text-white">新しくテンプレートを作成する</Text>
      </Button>
    </View>
  );
}
