import { Link } from "expo-router";
import { SettingsIcon } from "lucide-react-native";
import React from "react";
import { Button } from "~/components/ui/button";

export function Settings() {
  return (
    <Link asChild href="/settings">
      <Button variant="ghost" className="-mr-4 px-0">
        <SettingsIcon color={"#5F6368"} />
      </Button>
    </Link>
  );
}
