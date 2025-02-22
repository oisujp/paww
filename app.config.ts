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
const getSlug = () => {
  if (IS_DEV) {
    return "paww-dev";
  }
  return "paww";
};
const getProjectId = () => {
  if (IS_DEV) {
    return "f12ebb4c-192a-4a9c-a23f-322be40f5527";
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
  owner: "oisujp",
  extra: {
    eas: {
      projectId: getProjectId(),
    },
  },
};
