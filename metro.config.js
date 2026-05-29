const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// allow TF.js model files
config.resolver.assetExts.push("bin");

module.exports = withNativeWind(config, { input: "./global.css" });
