# PlateIQ

> **On-device AI that demystifies food labels and plates — runs on any phone, costs nothing to operate.**

PlateIQ is a cross-platform mobile app (Expo / React Native) that lets anyone point their camera at a barcode, ingredient label, or plate of food and instantly get:

- **Nutri-Score (A–E)** and a **Clean-Ingredient score (0–100)**
- **Decoded ingredients** — hidden sugars, trans-fats, preservatives, artificial colours, MSG, ultra-processed markers — each with a plain-language one-liner
- **Plate recognition** — TensorFlow.js MobileNet runs **on the phone** to identify foods and estimate calories + macros
- **Dietary fit checks** — Vegan, Vegetarian, Gluten-Free, Dairy-Free, Nut-Free, Jain, Halal, Keto — toggleable
- **Offline-first, private by default** — no accounts, no tracking, no paid LLM APIs

## Why this exists

Most "scan your food" apps either (a) charge a subscription, (b) ship your data to the cloud, or (c) just show a nutrition table without explaining anything. PlateIQ replicates the *FoodPharmer*-style explanation in software, with zero recurring cost and full on-device privacy.

## The zero-cost stack

| Layer | Choice | Cost | Why |
|---|---|---|---|
| App framework | **Expo (React Native)** | Free | One codebase → iOS, Android, Web |
| Styling | **NativeWind (Tailwind)** | Free | Fast, consistent UI |
| Barcode scan | **expo-camera** | Free | Native on iOS/Android |
| Product DB | **Open Food Facts API** | Free, no key | 3M+ products, open data |
| OCR | **Google ML Kit (on-device)** | Free | No network, no cost per scan |
| Plate vision | **TensorFlow.js + MobileNet** | Free | Runs on the phone's CPU/GPU |
| Ingredient decoder | **Curated local DB + rules** | Free | Deterministic, instant, no LLM bill |
| Nutri-Score | **Open algorithm (EU)** | Free | Public-domain scoring |
| State | **Zustand + AsyncStorage** | Free | Local persistence |

**Total monthly bill at any scale: $0.**

## 📲 Get the app

| Platform | How to install | Cost |
|---|---|---|
| **iPhone / iPad** | Open the [PWA link](https://rinkal-27.github.io/PlateIQ/) in Safari → Share → **Add to Home Screen** | Free |
| **Android** | Download the latest `.apk` from the [Releases page](../../releases) and tap to install | Free |
| **Android (browser)** | Open the [PWA link](https://rinkal-27.github.io/PlateIQ/) in Chrome → menu → **Install app** | Free |
| **Desktop** | Open the [PWA link](https://rinkal-27.github.io/PlateIQ/) in Chrome / Edge → install icon in address bar | Free |

> Replace the `#` links above with your GitHub Pages URL and Release assets once you've published (see "Distribute" below).

## Run it locally

```bash
cd PlateIQ
npm install
npx expo prebuild      # generates native iOS/Android projects (needed for ML Kit)
npx expo run:android   # or run:ios
```

> ML Kit text recognition ships native code, so PlateIQ needs an Expo **dev build** — Expo Go isn't enough. The free `eas build --profile development` works perfectly.

For the Web build (barcode + plate flow only, OCR disabled):

```bash
npx expo start --web
```

## Project structure

```
app/                         expo-router screens
  (tabs)/                    bottom-tab navigator (Scan / History / Diet)
  scan/camera.tsx            barcode + photo capture
  scan/result.tsx            unified result screen
src/
  data/
    ingredients.ts           curated additive / sugar / preservative DB
    foodNutrition.ts         per-100g macro table for plate recognition
    dietaryRules.ts          diet definitions + verdict engine
  services/
    openFoodFacts.ts         free product API client
    ingredientDecoder.ts     deterministic decoder + clean-score
    nutriScore.ts            Nutri-Score 2023 algorithm
    ocr.ts                   ML Kit text recognition
    plateRecognition.ts      TF.js MobileNet → food → macros
  components/                ScoreRing, NutriGradeBadge, IngredientChip, DietBadge, ui
  store/useStore.ts          Zustand store (diets + history)
```

## Distribute (publish so anyone can install)

PlateIQ ships through three free channels.

### A. Push code to GitHub

```bash
cd PlateIQ
git init
git add .
git commit -m "feat: initial PlateIQ release"
git branch -M main
git remote add origin https://github.com/<your-user>/plateiq.git
git push -u origin main
```

### B. Web PWA → GitHub Pages (works on iPhone, Android, desktop)

A workflow is already committed at `.github/workflows/deploy-web.yml`.

1. In your GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` — the workflow auto-builds `npx expo export --platform web` and publishes to `https://<your-user>.github.io/plateiq/`.
3. Share the link. iOS users open it in Safari → Share → **Add to Home Screen**. Android users get a one-tap **Install** prompt.

This covers **every iPhone in the world for free** (no $99 Apple Developer fee). It's the same trick Starbucks and Twitter Lite use.

### C. Android `.apk` → GitHub Releases (full native experience: ML Kit OCR, faster TF.js)

EAS Build is free for ~30 builds/month — plenty for a side project.

```bash
npm install -g eas-cli
eas login                       # one-time, free Expo account
eas build --platform android --profile preview
```

After ~10 min you get an `.apk` URL. Download it, then:

1. Go to your repo → **Releases → Draft a new release**.
2. Tag `v0.1.0`, attach `plateiq-0.1.0.apk`, publish.
3. Anyone can now download and sideload (Android only — Android will warn about "unknown source", that's normal for non-Play-Store apps).

### D. iOS (Apple Store / TestFlight) — the one paid step

Apple charges **$99/yr** for the Developer Program; it's the only legal way to distribute a native iOS app outside the EU. If/when you pay:

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

EAS handles signing, provisioning and App Store Connect upload. Until then, point iOS users at the PWA — it covers >90% of the features.

## What's intentionally not here (yet)

These are the obvious next ships, each is a tidy ~2-day add:

- Replace MobileNet with a **Food-101 fine-tuned model** (still free, much better accuracy)
- **Portion estimation** via reference-object (coin/credit card) or ARKit depth
- **Weekly nutrition dashboard** from local history
- **Community ingredient DB** synced from Open Food Facts taxonomy
- **Recipe scan** mode (OCR the back of a meal-kit box)

