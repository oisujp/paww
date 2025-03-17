import * as Application from "expo-application";
import { useNavigation, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight } from "lucide-react-native";
import React, { useContext, useEffect } from "react";
import { Pressable, SafeAreaView, SectionList, View } from "react-native";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { cn } from "~/lib/utils";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({ title: "設定" });
  }, [navigation]);

  const appSectionData = [
    {
      title: "お問い合わせ",
      href: "https://forms.gle/j63KQLFUUZqTLpv39",
      pathname: "",
    },
    { title: "Webサイト", href: "https://paww.jp/", pathname: "" },
    { title: "運営会社", href: "https://oisu.jp/", pathname: "" },
  ];

  const otherSectionData = [
    { title: "ライセンス情報", pathname: "/license" },
    {
      title: "プライバシーポリシー",
      href: "https://www.termsfeed.com/live/82e17554-98e6-40a1-8ed5-afb0fb66e0d9",
      pathname: "",
    },
    { title: "利用規約", href: "", pathname: "" },
  ];

  return (
    <SafeAreaView className="flex justify-between flex-1">
      <SectionList
        ItemSeparatorComponent={() => <Separator />}
        sections={[
          {
            title: "アプリ全般",
            data: appSectionData,
          },
          {
            title: "その他",
            data: otherSectionData,
          },
        ]}
        renderItem={({ item: { title, pathname, href } }) => {
          if (pathname) {
            return (
              <Pressable
                onPress={() => {
                  router.push({ pathname: pathname as any });
                }}
              >
                <TableRow title={title} />
              </Pressable>
            );
          }
          if (href) {
            return (
              <Pressable
                onPress={async () => {
                  await WebBrowser.openBrowserAsync(href);
                }}
              >
                <TableRow title={title} />
              </Pressable>
            );
          }
          return <TableRow title={title} />;
        }}
        renderSectionHeader={({ section }) => (
          <Text className="text-primary font-bold px-4 pt-11 pb-3">
            {section.title}
          </Text>
        )}
      />

      {process.env.EXPO_PUBLIC_APP_VARIANT !== "production" && (
        <Pressable
          onPress={() => {
            router.replace("/debug");
          }}
          className="my-4"
        >
          <TableRow title="デバッグ" />
        </Pressable>
      )}

      <View>
        <Pressable
          onPress={() => {
            signOut();
            router.dismissTo("/sign-in");
          }}
        >
          <TableRow title="ログアウト" destructive />
        </Pressable>
        <View className="flex items-center text-secondary py-4">
          <Text>
            アプリバージョン：{Application.nativeApplicationVersion} (
            {Application.nativeBuildVersion})
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const TableRow = ({
  title,
  destructive,
}: {
  title: string;
  destructive?: boolean;
}) => {
  return (
    <View className="h-[58px] px-6 items-center flex flex-row bg-white justify-between">
      <Text className={cn("text-lg", destructive && "text-destructive")}>
        {title}
      </Text>
      <ChevronRight className="text-secondary" />
    </View>
  );
};
