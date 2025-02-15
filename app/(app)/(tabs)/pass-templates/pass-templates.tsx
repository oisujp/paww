import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link, useRouter } from "expo-router";
import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PassTemplateBlock } from "~/components/pass/pass-template-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function PassTemplates() {
  const router = useRouter();
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const { data: passTemplatesData, count } = useQuery(
    supabase
      .from("passTemplates")
      .select(`*, passes( id, publishedAt )`, { count: "exact" })
      .order("updatedAt", { ascending: false })
      .eq("userId", userId)
      .is("deletedAt", null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
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
      <View className="flex-1 p-8 gap-4">
        <Text>1. お店情報を設定する</Text>
        <Button onPress={() => router.navigate("store")}>
          <Text>お店情報の設定に進む</Text>
        </Button>
        <Text>2. テンプレートを作成する</Text>
        <Button onPress={() => router.navigate("/(app)/new-template")}>
          <Text>テンプレートの作成に進む</Text>
        </Button>
        <Text>3. パスを発行する</Text>
        <Button>
          <Text>パスの発行に進む</Text>
        </Button>
      </View>
    );
  }

  return (
    <React.Fragment>
      <View className="flex w-full items-end p-6">
        <Text className="text-right">全{count}件</Text>
      </View>
      <FlatList
        data={passTemplatesData}
        contentContainerClassName="gap-6 px-6"
        className="w-full"
        renderItem={({ item }) => {
          return <PassTemplateBlock key={uuidv4()} passTemplate={item} />;
        }}
      />
      <View className="flex w-full p-6">
        <Link href="pass-templates/new-template" asChild>
          <Button className="w-full">
            <Text>新しくテンプレートを作成</Text>
          </Button>
        </Link>
      </View>
    </React.Fragment>
  );
}
