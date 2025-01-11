import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  if (process.env.MY_ENVIRONMENT === "development") {
    const devPackage = "jp.oisu.paw.dev";
    return {
      ...config,
      scheme: devPackage,
      android: {
        ...config.android,
        package: devPackage,
      },
      ios: {
        ...config.ios,
        bundleIdentifier: devPackage,
      },
      slug: "paw-dev",
      name: "Paw Dev",
    };
  }
  const prodPackage = "jp.oisu.paw";
  return {
    ...config,
    scheme: prodPackage,
    android: {
      ...config.android,
      package: prodPackage,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: prodPackage,
    },
    slug: "paw",
    name: "Paw",
  };
};
