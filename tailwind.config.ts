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
