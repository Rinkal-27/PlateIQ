/**
 * Excludes react-native-worklets from native autolinking.
 *
 * Why: NativeWind 4 / react-native-css-interop imports the worklets babel
 * plugin during Metro bundling, so the package must be installed. But the
 * NATIVE side of worklets requires RN 0.75+, and Expo SDK 51 ships RN 0.74.
 * Without this file the Gradle build hits:
 *
 *   :react-native-worklets:assertMinimalReactNativeVersionTask FAILED
 *   [Worklets] Unsupported React Native version. Please use 75 or newer.
 *
 * Setting both platforms to `null` makes autolinking skip the package, so the
 * Android / iOS build never tries to compile worklets' native code. We don't
 * use any worklet-powered animations, so this is safe.
 */
module.exports = {
  dependencies: {
    "react-native-worklets": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
