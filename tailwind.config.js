/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        surface: "#121B2E",
        card: "#172238",
        line: "#243047",
        text: "#E6EDF7",
        muted: "#8A97AE",
        brand: "#4ADE80",
        brandDeep: "#16A34A",
        warn: "#F59E0B",
        bad: "#EF4444",
        good: "#22C55E",
        info: "#38BDF8",
      },
      fontFamily: {
        display: ["System"],
      },
    },
  },
  plugins: [],
};
