import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1C1917",
        teal: "#C8973E",
        "teal-dark": "#8B6B2A",
        orange: "#D4614A",
        sand: "#F0E9DA",
        slate: "#F7F2EB",

        // Influential Women brand magenta — used only on the recognition card,
        // where it belongs to an external award rather than to this site.
        // Contrast-checked against the card grounds:
        //   iw-pink       4.41:1 on white — large text, rules, fills only
        //   iw-pink-deep  5.85:1 on white — body text and links (AA)
        //   iw-pink-light 8.20:1 on #1C1A18 — text in dark mode (AA)
        "iw-pink": "#BE4F98",
        "iw-pink-deep": "#A63C82",
        "iw-pink-light": "#E79BC8",
        "iw-pink-tint": "#FBEFF6",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
