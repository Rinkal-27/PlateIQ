// Stub for `react-native-fs`. tfjs-react-native references it in a "never
// reached" code path (loading TF models from bundled resources). We don't use
// that path, so we alias the import to this empty module via metro.config.js.
module.exports = {};
