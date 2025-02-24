import { ConfigContext } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "jp.oisu.paww.dev";
  }
  return "jp.oisu.paww";
};
const getAppName = () => {
  if (IS_DEV) {
    return "paww (Dev)";
  }
  return "paww";
};

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    name: getAppName(),
    scheme: getUniqueIdentifier(),
    ios: {
      ...config.ios,
      bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
      ...config.android,
      package: getUniqueIdentifier(),
    },
  };
};
