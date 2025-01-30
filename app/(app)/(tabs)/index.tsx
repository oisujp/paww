import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link, useNavigation } from "expo-router";
import React, { useContext, useEffect } from "react";
import { FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "~/components/menu";
import { PassTemplateBlock } from "~/components/pass-template-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function Home() {
  const navigation = useNavigation();

  const { session } = useContext(AuthContext);
  const userId = session?.user.id ?? "";

  const { data: passTemplatesData, count } = useQuery(
    supabase
      .from("passTemplates")
      .select(`*, passes( id, publishedAt )`, { count: "exact" })
      .order("updatedAt", { ascending: false })
      .eq("userId", userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: passesData } = useQuery(
    supabase
      .from("passes")
      .select(`*`)
      .order("updatedAt", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Menu />;
      },
    });
  }, [navigation]);

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
          const passes =
            passesData?.filter((p) => p.passTemplateId === item.id) ?? [];
          return (
            <PassTemplateBlock
              key={uuidv4()}
              passTemplate={item}
              passes={passes}
            />
          );
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
