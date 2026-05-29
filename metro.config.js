const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// allow TF.js model files
config.resolver.assetExts.push("bin");

// Stub `react-native-fs` — referenced by a dead code path in
// @tensorflow/tfjs-react-native that Metro still resolves at bundle time.
// Aliasing to an empty module keeps the bundle small and skips the native dep.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "react-native-fs": path.resolve(__dirname, "src/stubs/react-native-fs.js"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
