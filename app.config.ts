import { ConfigContext } from "expo/config";

const IS_LOCAL = process.env.EXPO_PUBLIC_APP_VARIANT === "local";
const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === "development";
const IS_PREVIEW = process.env.EXPO_PUBLIC_APP_VARIANT === "preview";

const bundleIdentifier =
  IS_LOCAL || IS_DEV ? "jp.oisu.paww.dev" : "jp.oisu.paww";

const getAppName = () => {
  if (IS_LOCAL) {
    return "paww (Local)";
  } else if (IS_DEV) {
    return "paww (Dev)";
  } else if (IS_PREVIEW) {
    return "paww (Preview)";
  }
  return "paww";
};

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    name: getAppName(),
    scheme: bundleIdentifier,
    ios: {
      ...config.ios,
      bundleIdentifier,
    },
    android: {
      ...config.android,
      package: bundleIdentifier,
    },
  };
};
