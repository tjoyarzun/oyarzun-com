"use client";

import { ThemeProvider } from "next-themes";

/**
 * Negative is a deliberate act, not a reflection of the reader's OS.
 *
 * `enableSystem` is off on purpose: the issue is printed on paper, and a
 * visitor arriving with a dark OS should still land on paper and choose
 * Negative from the top bar if they want it. next-themes persists that choice
 * to localStorage, so it survives navigation and return visits — which is
 * what makes it a site setting rather than a per-page toggle.
 *
 * If we decide the OS preference should win after all, this is a one-word
 * change; nothing in the design system depends on it.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
