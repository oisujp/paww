import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PassBlock } from "~/components/pass-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function Home() {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const { data, count } = useQuery(
    supabase
      .from("passTemplates")
      .select("*", { count: "exact" })
      .order("updatedAt", { ascending: false })
      .eq("userId", userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <React.Fragment>
      <View className="flex w-full items-end p-6">
        <Text className="text-right">全{count}件</Text>
      </View>
      <FlatList
        data={data}
        contentContainerClassName="gap-6 px-6"
        className="w-full"
        renderItem={({ item }) => {
          return <PassBlock key={uuidv4()} pass={item} />;
        }}
      />
      <View className="flex w-full p-6">
        <Link href="/(app)/new-template" asChild>
          <Button className="w-full">
            <Text>テンプレートを作成</Text>
          </Button>
        </Link>
      </View>
    </React.Fragment>
  );
}
