import * as tf from "@tensorflow/tfjs";

/** Web: load image via HTMLImageElement and feed it through tf.browser.fromPixels. */
export async function loadImageTensor(uri: string): Promise<tf.Tensor3D> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = uri;
  });
  return tf.browser.fromPixels(img);
}

export async function ensureTf(): Promise<void> {
  await tf.ready();
}
