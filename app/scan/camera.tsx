import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PrimaryButton, GhostButton } from "@/components/ui";

type Mode = "barcode" | "label" | "plate";

export default function CameraScreen() {
  const { mode } = useLocalSearchParams<{ mode: Mode }>();
  const router = useRouter();
  const [perm, requestPerm] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const cam = useRef<CameraView>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (perm && !perm.granted && perm.canAskAgain) void requestPerm();
  }, [perm, requestPerm]);

  const goResult = (params: Record<string, string>) => {
    router.replace({ pathname: "/scan/result", params: { mode: mode!, ...params } });
  };

  const onBarcode = (b: BarcodeScanningResult) => {
    if (handledRef.current) return;
    handledRef.current = true;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goResult({ barcode: b.data });
  };

  const capture = async () => {
    if (!cam.current || busy) return;
    setBusy(true);
    try {
      const photo = await cam.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      if (photo?.uri) goResult({ uri: photo.uri });
    } catch (e: any) {
      Alert.alert("Camera error", e?.message ?? "Could not capture image.");
    } finally {
      setBusy(false);
    }
  };

  const pickFromLibrary = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!r.canceled && r.assets[0]) goResult({ uri: r.assets[0].uri });
  };

  if (!perm) return <View className="flex-1 bg-bg" />;
  if (!perm.granted) {
    return (
      <View className="flex-1 bg-bg items-center justify-center p-6">
        <Text className="text-text text-center mb-4">
          PlateIQ needs camera access to scan food.
        </Text>
        <PrimaryButton label="Grant camera access" onPress={() => requestPerm()} />
      </View>
    );
  }

  const title =
    mode === "barcode" ? "Point at a barcode" :
    mode === "label"   ? "Frame the ingredients list" :
                         "Frame your plate";

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cam}
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={
          mode === "barcode"
            ? { barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "qr"] }
            : undefined
        }
        onBarcodeScanned={mode === "barcode" ? onBarcode : undefined}
      />
      <View className="absolute top-12 left-0 right-0 items-center">
        <View className="bg-black/60 px-4 py-2 rounded-full">
          <Text className="text-white font-semibold">{title}</Text>
        </View>
      </View>

      {mode !== "barcode" && (
        <View className="absolute bottom-10 left-0 right-0 px-6 gap-3">
          <Pressable
            onPress={capture}
            disabled={busy}
            className="self-center w-20 h-20 rounded-full bg-white items-center justify-center border-4 border-brand"
          >
            {busy ? <ActivityIndicator /> : <View className="w-14 h-14 rounded-full bg-brand" />}
          </Pressable>
          <GhostButton label="Pick from library" onPress={pickFromLibrary} />
        </View>
      )}
    </View>
  );
}
