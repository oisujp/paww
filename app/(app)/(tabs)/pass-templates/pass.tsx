import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { PassBlock } from "~/components/pass/pass-block";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function Pass() {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const { data: passesData, count } = useQuery(
    supabase
      .from("passes")
      .select(`*, templates( id )`, { count: "exact" })
      .order("publishedAt", { ascending: false })
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
        data={passesData}
        contentContainerClassName="gap-6 px-6"
        className="w-full"
        renderItem={({ item }) => {
          return <PassBlock key={item.id} pass={item} />;
        }}
      />
    </React.Fragment>
  );
}
