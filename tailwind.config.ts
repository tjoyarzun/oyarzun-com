import type { Config } from "tailwindcss";

const config: Config = {
  /**
   * `class` rather than `media`, because Negative is a deliberate choice the
   * reader makes in the top bar — not a reflection of their OS setting. The
   * class is applied by next-themes and read by `html.dark` in globals.css.
   */
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Issue 04 ─────────────────────────────────────────────────────
           The issue is printed in one ink on one paper. These three are the
           whole palette; the ink/paper pair inverts under Negative, which is
           why components should read the CSS variables in globals.css rather
           than these Tailwind names wherever inversion matters. They are
           exposed here for the handful of places that are fixed in one
           polarity regardless of theme (the nav plate, the red band). */
        paper: "#DCD9D0",
        ink: "#141414",
        red: "#DD2F1C",

        /* Influential Women brand magenta — used only on the recognition
           card, where it belongs to an external award rather than to this
           site. Contrast-checked against the card grounds:
             iw-pink       4.41:1 on white — large text, rules, fills only
             iw-pink-deep  5.85:1 on white — body text and links (AA)
             iw-pink-light 8.20:1 on #1C1A18 — text in dark mode (AA) */
        "iw-pink": "#BE4F98",
        "iw-pink-deep": "#A63C82",
        "iw-pink-light": "#E79BC8",
        "iw-pink-tint": "#FBEFF6",

        /* ── Pre-Issue-04 palette ────────────────────────────────────────
           Still referenced by the components under components/{dashboard,
           travels,profiles,blog,home,family} that have not yet been ported
           to the new design. Delete these names in the same commit that
           deletes the last component using them — `pnpm build` will name any
           stragglers. */
        navy: "#1C1917",
        teal: "#C8973E",
        "teal-dark": "#8B6B2A",
        orange: "#D4614A",
        sand: "#F0E9DA",
        slate: "#F7F2EB",
      },
      fontFamily: {
        /* Names match the CSS variables in globals.css (--disp/--body/--cred)
           so a Tailwind utility and a design-system rule cannot disagree. */
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "Arial Narrow", "sans-serif"],
        cred: ["var(--font-cred)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
