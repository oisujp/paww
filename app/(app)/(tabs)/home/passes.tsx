import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import PassesImage from "assets/images/passes.svg";
import { useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import { PassBlock } from "~/components/pass/pass-block";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function Passes() {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";
  const { passTemplateId } = useLocalSearchParams();

  if (typeof passTemplateId !== "string") {
    throw new Error("passTemplateId is required");
  }

  const { data: passesData, count } = useQuery(
    supabase
      .from("passes")
      .select(`*, passTemplates( id )`, { count: "exact" })
      .order("publishedAt", { ascending: false })
      .eq("userId", userId)
      .eq("passTemplateId", passTemplateId)
  );

  if (count === 0) {
    return (
      <View className="flex flex-1 p-8 gap-4 justify-center items-center bg-background border-t border-border">
        <PassesImage className="size-[90px]" />
        <Text>発行されたパスはありません</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 bg-background border-t border-border p-6 gap-3">
      <View className="flex w-full items-end">
        <Text className="text-right text-sm">全{count}件</Text>
      </View>
      <FlatList
        data={passesData}
        contentContainerClassName="gap-4"
        className="w-full"
        renderItem={({ item }) => {
          return <PassBlock key={item.id} pass={item} />;
        }}
      />
    </View>
  );
}
