import { ConfigContext } from "expo/config";

const IS_LOCAL = process.env.APP_VARIANT === "local";
const IS_TEST = process.env.APP_VARIANT === "test";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const bundleIdentifier =
  IS_LOCAL || IS_TEST ? "jp.oisu.paww.dev" : "jp.oisu.paww";

const getAppName = () => {
  if (IS_LOCAL) {
    return "paww (Local)";
  } else if (IS_TEST) {
    return "paww (Test)";
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
