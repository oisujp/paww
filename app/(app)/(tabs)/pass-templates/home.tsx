import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PassTemplateBlock } from "~/components/pass/pass-template-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function Home() {
  const router = useRouter();
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const { data: passTemplatesData, count } = useQuery(
    supabase
      .from("passTemplates")
      .select(`*, passes( id, publishedAt )`, { count: "exact" })
      .order("updatedAt", { ascending: false })
      .eq("userId", userId)
      .is("deletedAt", null)
  );
  const { data: userData } = useQuery(
    supabase.from("users").select(`*`).eq("id", userId).single(),

    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (!userData) {
    return (
      <View className="bg-background flex flex-1 justify-center items-center gap-8 p-6">
        <Image
          source={require("../../../../assets/images/store.svg")}
          className="w-[129px] h-[90px]"
        />
        <View className="flex items-center gap-2">
          <Text className="text-2xl font-bold">お店情報を作成してください</Text>
          <View className="flex items-center">
            <Text>まずはデジタルパスを作成するために</Text>
            <Text>あなたのお店情報を設定しましょう</Text>
          </View>
        </View>
        <Button className="w-full" onPress={() => router.navigate("store")}>
          <Text>お店情報の設定に進む</Text>
        </Button>
      </View>
    );
  }

  if (passTemplatesData?.length === 0) {
    return (
      <View className="bg-background flex flex-1 justify-center items-center gap-8 p-6">
        <Image
          source={require("../../../../assets/images/pass-template.svg")}
          className="size-[90px]"
        />
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
          onPress={() => router.navigate("pass-templates/new-template")}
        >
          <Text>テンプレートの作成に進む</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="bg-background">
      <View className="flex w-full items-end p-6">
        <Text className="text-right">全{count}件</Text>
      </View>
      <FlatList
        data={passTemplatesData}
        contentContainerClassName="gap-6 px-6"
        className="w-full"
        renderItem={({ item }) => {
          return <PassTemplateBlock key={uuidv4()} passTemplateId={item.id} />;
        }}
      />
      <View className="flex w-full p-6">
        <Link href="pass-templates/new-template" asChild>
          <Button className="w-full">
            <Text>新しくテンプレートを作成</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
