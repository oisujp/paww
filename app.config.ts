const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "jp.oisu.paw.dev";
  }
  if (IS_PREVIEW) {
    return "jp.oisu.paw.preview";
  }
  return "jp.oisu.paw";
};
const getAppName = () => {
  if (IS_DEV) {
    return "Paw (Dev)";
  }
  if (IS_PREVIEW) {
    return "Paw (Preview)";
  }
  return "Paw";
};
const getSlug = () => {
  if (IS_DEV) {
    return "paw-dev";
  }
  if (IS_PREVIEW) {
    return "paw-preview";
  }
  return "paw";
};
const getProjectId = () => {
  if (IS_DEV) {
    return "ed676a75-d4c0-4cbe-8b60-ae94845051af";
  }
  if (IS_PREVIEW) {
    return "paw-preview";
  }
  return "925b75b6-a4eb-48dc-adb2-330eac52e19c";
};

export default {
  name: getAppName(),
  scheme: getUniqueIdentifier(),
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    package: getUniqueIdentifier(),
  },
  slug: getSlug(),
  extra: {
    eas: {
      projectId: getProjectId(),
    },
  },
};
