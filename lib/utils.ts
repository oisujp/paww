import { type ClassValue, clsx } from "clsx";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { twMerge } from "tailwind-merge";

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

export const pickImage = async (width: number, height: number) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const pickedImage = result.assets[0];
    const uri = pickedImage.uri;
    const newSize = resizeWithAspectRatio(
      pickedImage.width,
      pickedImage.height
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
    return ref;
  }
};
