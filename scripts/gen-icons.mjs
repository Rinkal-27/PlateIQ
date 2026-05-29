/**
 * One-shot icon generator.
 *   node scripts/gen-icons.mjs
 *
 * Reads assets/icon.svg and writes every PNG size Expo + iOS PWA need.
 * Run this once (and again whenever you tweak the SVG).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const src = path.join(root, "assets", "icon.svg");
const svg = await fs.readFile(src);

// Expo app icons
const expoTargets = [
  { out: "assets/icon.png", size: 1024, bg: null },
  { out: "assets/adaptive-icon.png", size: 1024, bg: "#0B1220" },
  { out: "assets/splash.png", size: 1242, bg: "#0B1220", pad: 0.45 },
  { out: "assets/favicon.png", size: 64, bg: null },
];

// Apple Touch Icons + iOS PWA tiles (copied into public/ so they ship to the web bundle)
const appleTargets = [
  { out: "public/apple-touch-icon.png", size: 180, bg: "#0B1220" },
  { out: "public/apple-touch-icon-120.png", size: 120, bg: "#0B1220" },
  { out: "public/apple-touch-icon-152.png", size: 152, bg: "#0B1220" },
  { out: "public/apple-touch-icon-167.png", size: 167, bg: "#0B1220" },
  { out: "public/icon-192.png", size: 192, bg: "#0B1220" },
  { out: "public/icon-512.png", size: 512, bg: "#0B1220" },
  { out: "public/favicon.png", size: 64, bg: null },
];

for (const t of [...expoTargets, ...appleTargets]) {
  const abs = path.join(root, t.out);
  await fs.mkdir(path.dirname(abs), { recursive: true });

  const pad = t.pad ?? 0; // 0..1 fraction of canvas to leave as padding
  const inner = Math.round(t.size * (1 - pad));

  let img = sharp(svg).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });

  if (pad > 0 || t.bg) {
    img = sharp({
      create: {
        width: t.size,
        height: t.size,
        channels: 4,
        background: t.bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).composite([{ input: await img.png().toBuffer(), gravity: "center" }]);
  }

  await img.png().toFile(abs);
  console.log(`✓ ${t.out}  (${t.size}px)`);
}
