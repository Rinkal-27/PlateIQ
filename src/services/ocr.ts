import TextRecognition from "@react-native-ml-kit/text-recognition";

/**
 * On-device OCR via Google ML Kit (bundled, free, no network).
 * Returns the full recognised text — the decoder takes it from there.
 *
 * Note: requires an Expo *dev build* (not Expo Go) because ML Kit ships
 * native code. `npx expo prebuild && npx expo run:android` is enough.
 */
export async function recognizeLabel(imageUri: string): Promise<string> {
  const result = await TextRecognition.recognize(imageUri);
  return result.text ?? "";
}
