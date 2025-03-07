export const themeColors = {
  primary: "#FF7D52",
  secondary: "#ADB3BC",
  foreground: "#322B29",
  background: "#FCFCFC",
};

export const sampleStrips = [
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-1.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-2.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-3.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-4.png",
  "https://qsinzsuopxjjetahfmyj.supabase.co/storage/v1/object/public/sample-images/strip/sample-5.png",
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

export const passBase: PassTemplateBase = {
  formatVersion: 1,
  passTypeIdentifier: ["local", "development", "test"].includes(
    process.env.EXPO_PUBLIC_APP_VARIANT!
  )
    ? "pass.jp.oisu.luckycat"
    : "pass.jp.oisu.paww",
  teamIdentifier: "B8KVAMPYW5",
  organizationName: "",
  labelColor: "#000000",
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
};
