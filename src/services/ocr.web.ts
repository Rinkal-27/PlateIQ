/**
 * Web stub for OCR. ML Kit is native-only; on web we simply tell the caller
 * OCR isn't available and let them fall back to barcode/manual entry.
 */
export async function recognizeLabel(_imageUri: string): Promise<string> {
  throw new Error(
    "On-device OCR isn't available in the web build. Use the barcode scanner, " +
      "or run the Android/iOS dev build to enable ML Kit text recognition.",
  );
}
