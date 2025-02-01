const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "jp.oisu.paww.dev";
  }
  if (IS_PREVIEW) {
    return "jp.oisu.paww.preview";
  }
  return "jp.oisu.paww";
};
const getAppName = () => {
  if (IS_DEV) {
    return "paww (Dev)";
  }
  if (IS_PREVIEW) {
    return "paww (Preview)";
  }
  return "paww";
};
const getSlug = () => {
  if (IS_DEV) {
    return "paww-dev";
  }
  if (IS_PREVIEW) {
    return "paww-preview";
  }
  return "paww";
};
const getProjectId = () => {
  if (IS_DEV) {
    return "f12ebb4c-192a-4a9c-a23f-322be40f5527";
  }
  if (IS_PREVIEW) {
    return "paww-preview";
  }
  return "b924bd99-e83f-4e59-8394-eac010d4a470";
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
