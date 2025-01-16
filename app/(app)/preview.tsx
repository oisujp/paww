import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "~/contexts/auth-context";

export default function Preview() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
