import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "~/components/ui/button";

import { Text } from "~/components/ui/text";
export default function Home() {
  return (
    <ScrollView contentContainerClassName="flex-1 items-center justify-center p-6">
      <Link href="/(app)/new-template" asChild>
        <Button className="w-full">
          <Text>テンプレートを作成</Text>
        </Button>
      </Link>
    </ScrollView>
  );
}
