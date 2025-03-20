import { Platform } from "react-native";

export const themeColors = {
  primary: "#FF7D52",
  secondary: "#ADB3BC",
  foreground: "#322B29",
  background: "#FCFCFC",
  border: "#E7E7E7",
  borderDark: "#B2B2B2",
};

export const sampleStrips = [
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-1.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-2.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-3.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-4.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-5.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-6.png",
];
export const sampleIcons = [
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/icon/sample-1.svg",
];
export const sampleLogos = [];

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // prima=ry
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const passBase = {
  formatVersion: 1,
  passTypeIdentifier: ["local", "development", "test"].includes(
    process.env.EXPO_PUBLIC_APP_VARIANT!
  )
    ? "pass.jp.oisu.luckycat"
    : "pass.jp.oisu.paww",
  teamIdentifier: "B8KVAMPYW5",
  organizationName: "",
  foregroundColor: "#000000",
  backgroundColor: "#FEF1D5",
};

export const defaultLabel = {
  coupon: {
    description: "特典",
    expirationDate: "有効期限",
    caveats: "注意事項",
    organizationName: "配布元",
    redeemLink: "クーポンを使う 👉",
  },
};

export const headerStyle = Platform.select({
  ios: {
    backgroundColor: themeColors.background,
  },
  android: {},
});

export const contentStyle = Platform.select({
  ios: {
    borderTopWidth: 0.5,
    borderTopColor: themeColors.border,
  },
  android: {},
});
