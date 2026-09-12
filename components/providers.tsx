"use client";

import { ThemeProvider } from "next-themes";

/**
 * The issue prints on paper. Negative flips it to ink.
 *
 * `defaultTheme` is the ink the site is printed in when nobody has expressed
 * a preference; the top-bar button is the inverse of it, whichever way round
 * that is. Nav derives its label and pressed state from this, so changing the
 * word here is the whole change — there is no second place that assumes which
 * one is "normal".
 *
 * `enableSystem` is off on purpose: which way the issue prints is a property
 * of the issue, not of the reader's operating system. A visitor who wants the
 * other one chooses it from the top bar, and next-themes persists that choice
 * to localStorage, so it survives navigation and return visits — which is what
 * makes it a site setting rather than a per-page toggle.
 *
 * Note for testing: anyone who has already chosen a theme keeps it. Changing
 * the default only affects visitors with nothing in localStorage, so check
 * this in a fresh browser profile, not in the tab you have been using.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
