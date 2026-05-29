import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

/** Native: read JPEG bytes off disk and decode into a tf.Tensor3D. */
export async function loadImageTensor(uri: string): Promise<tf.Tensor3D> {
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return decodeJpeg(raw);
}

export async function ensureTf(): Promise<void> {
  await tf.ready();
}
