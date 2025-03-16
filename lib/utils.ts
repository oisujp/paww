import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { logger as RNLogger } from "react-native-logs";
import { twMerge } from "tailwind-merge";

export const logger = RNLogger.createLogger();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function resizeWithAspectRatio(
  width: number,
  height: number,
  maxWidth: number = 160,
  maxHeight: number = 50
): { width: number; height: number } {
  const widthRatio = width / maxWidth;
  const heightRatio = height / maxHeight;
  const maxRatio = Math.max(widthRatio, heightRatio);

  if (maxRatio > 1) {
    return {
      width: Math.floor(width / maxRatio),
      height: Math.floor(height / maxRatio),
    };
  }

  return { width, height };
}

export const pickImage = async (maxWidth?: number, maxHeight?: number) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) {
    throw new Error("Image picker canceled");
  }

  const pickedImage = result.assets[0];
  const uri = pickedImage.uri;
  const newSize = resizeWithAspectRatio(
    pickedImage.width,
    pickedImage.height,
    maxWidth,
    maxHeight
  );
  const resized = await ImageManipulator.manipulate(uri).resize({
    width: newSize.width,
    height: newSize.height,
  });
  const imageRef = await resized.renderAsync();
  const ref = await imageRef.saveAsync({
    base64: true,
    format: SaveFormat.PNG,
  });
  return ref.base64;
};

export const formatDatetime = (datetime?: string | null) => {
  if (!datetime) {
    return "";
  }
  return format(datetime, "yyyy/MM/dd HH:mm:ss");
};

export const formatDate = (date?: Date | string | null) => {
  if (!date) {
    return "";
  }
  return format(date, "yyyy/MM/dd");
};

export const formatTime = (date?: Date | string | null) => {
  if (!date) {
    return "";
  }
  return format(date, "HH:mm");
};
