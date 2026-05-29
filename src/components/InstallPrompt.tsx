import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

/**
 * Cross-platform PWA install banner.
 *   - Android / Chrome: captures the `beforeinstallprompt` event and offers a
 *     one-tap install button.
 *   - iOS Safari: there is no install API, so we show a friendly hint with the
 *     Share → Add to Home Screen instructions. Auto-hides once the user is
 *     already running in standalone mode.
 *   - Native (real app build): renders nothing.
 *
 * State is remembered in localStorage so the banner doesn't keep nagging.
 */
const DISMISS_KEY = "plateiq.install.dismissed";

type BeforeInstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    if (window.localStorage.getItem(DISMISS_KEY)) return;

    // Already installed / standalone? Nothing to do.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS-specific
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(window.navigator.userAgent);

    if (isIOS && isSafari) {
      // iOS doesn't fire beforeinstallprompt — show the manual hint.
      setIosHint(true);
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (Platform.OS !== "web" || !show) return null;

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "1");
    }
    setShow(false);
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    dismiss();
  };

  return (
    <View className="absolute left-3 right-3 bottom-3 bg-card border border-line rounded-2xl p-3 flex-row items-center shadow-lg">
      <Text className="text-2xl mr-3">📱</Text>
      <View className="flex-1 pr-2">
        <Text className="text-text font-bold">Install PlateIQ</Text>
        {iosHint ? (
          <Text className="text-muted text-xs mt-0.5">
            Tap the Share icon ⬆️ in Safari, then choose “Add to Home Screen”.
          </Text>
        ) : (
          <Text className="text-muted text-xs mt-0.5">
            Add to your home screen for offline access and a full-screen app.
          </Text>
        )}
      </View>
      {!iosHint && (
        <Pressable onPress={install} className="bg-brand rounded-xl px-3 py-2 mr-2">
          <Text className="text-bg font-bold text-xs">Install</Text>
        </Pressable>
      )}
      <Pressable onPress={dismiss} className="px-2 py-2">
        <Text className="text-muted">✕</Text>
      </Pressable>
    </View>
  );
}
