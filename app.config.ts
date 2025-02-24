import { ConfigContext } from "expo/config";
import { bundleIdentifier } from "~/lib/constants";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getAppName = () => {
  if (IS_DEV) {
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
