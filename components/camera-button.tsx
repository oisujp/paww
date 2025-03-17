import { Link } from "expo-router";
import { Camera } from "lucide-react-native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function CameraButton() {
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const buttonSize = 60;
  return (
    <Link asChild href={{ pathname: "/new-pass-template" }}>
      <Button
        className={cn(
          "fixed z-20 rounded-full bg-white text-primary border-primary border-2",
          `left-[${width / 2 - 20}px]`
        )}
        style={{
          left: width / 2 - buttonSize / 2,
          bottom,
          width: buttonSize,
          height: buttonSize,
        }}
      >
        <Camera className="size-10" />
      </Button>
    </Link>
  );
}
