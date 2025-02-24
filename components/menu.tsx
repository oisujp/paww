import { Link } from "expo-router";
import { AlignJustify } from "lucide-react-native";
import React, { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";

export function Menu() {
  const contentInsets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <AlignJustify />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={contentInsets} className="w-64 native:w-72">
        <Link asChild href={{ pathname: "/debug" }}>
          <DropdownMenuItem>
            <Text>デバッグ</Text>
          </DropdownMenuItem>
        </Link>

        <Link asChild href={"https://paww.jp/"}>
          <DropdownMenuItem>
            <Text>Webサイト</Text>
          </DropdownMenuItem>
        </Link>
        <Link asChild href={"https://oisu.jp/"}>
          <DropdownMenuItem>
            <Text>運営会社</Text>
          </DropdownMenuItem>
        </Link>
        <Link asChild href={{ pathname: "/license" }}>
          <DropdownMenuItem>
            <Text>ライセンス情報</Text>
          </DropdownMenuItem>
        </Link>
        <Link asChild href={{ pathname: "/license" }}>
          <DropdownMenuItem>
            <Text>プライバシーポリシー</Text>
          </DropdownMenuItem>
        </Link>
        <Link asChild href={{ pathname: "/license" }}>
          <DropdownMenuItem>
            <Text>利用規約</Text>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onPress={() => {
            try {
              signOut();
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Text className="text-destructive">ログアウト</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
